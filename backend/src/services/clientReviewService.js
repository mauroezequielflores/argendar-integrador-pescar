import { supabase } from '../config/supabase.js';
import { AppError, NotFoundError, ConflictError } from '../utils/errors.js';

/**
 * Crea una nueva calificación (review) para un profesional desde una notificación de cliente.
 * 
 * @param {string} userId UUID del cliente autenticado
 * @param {object} reviewData Datos del review (notificationId, rating, tags, comment)
 * @returns {object} El review creado
 */
export const createReview = async (userId, { notificationId, rating, tags, comment }) => {
  // 1. Validar la notificación
  const { data: notification, error: notifError } = await supabase
    .from('notifications')
    .select('user_id, metadata, related_entity_id')
    .eq('id', notificationId)
    .maybeSingle();

  if (notifError || !notification || notification.user_id !== userId) {
    throw new NotFoundError('Notificación no encontrada'); // Evitamos fuga de info con 404 en lugar de 403
  }

  const appointmentId = notification.metadata?.appointmentId || notification.related_entity_id;
  if (!appointmentId) {
    throw new AppError('La notificación no está asociada a un turno válido', 400);
  }

  // 2. Validar el turno con consultas desacopladas seguras
  const { data: appointment, error: apptError } = await supabase
    .from('appointments')
    .select('id, status, offer_id')
    .eq('id', appointmentId)
    .maybeSingle();

  if (apptError || !appointment) {
    throw new NotFoundError('El turno asociado no existe');
  }

  // Verificar estado del turno
  const finalStatuses = ['FINALIZADO', 'COMPLETED', 'completed', 'finalizado'];
  if (!finalStatuses.includes(appointment.status)) {
    throw new ConflictError('No se puede calificar un turno que no ha finalizado');
  }

  // Obtener oferta para verificar profesional y solicitud
  const { data: offer } = await supabase
    .from('offers')
    .select('id, professional_id, request_id')
    .eq('id', appointment.offer_id)
    .maybeSingle();

  if (!offer) {
    throw new NotFoundError('La oferta asociada al turno no existe');
  }

  // Obtener solicitud para verificar pertenencia al cliente
  const { data: request } = await supabase
    .from('requests')
    .select('id, client_id')
    .eq('id', offer.request_id)
    .maybeSingle();

  if (!request || request.client_id !== userId) {
    throw new NotFoundError('El turno asociado no existe');
  }

  const professionalId = offer.professional_id;

  // 3. Insertar la reseña
  const { data: newReview, error: insertError } = await supabase
    .from('reviews')
    .insert({
      appointment_id: appointmentId,
      reviewer_id: userId,
      reviewee_id: professionalId,
      rating,
      tags: tags || [],
      comment: comment || null
    })
    .select()
    .single();

  if (insertError) {
    // Manejar violación de restricción UNIQUE en appointment_id
    if (insertError.code === '23505' || insertError.message.includes('unique')) {
      throw new ConflictError('Este turno ya fue calificado previamente');
    }
    throw new AppError(`Error al registrar la calificación: ${insertError.message}`, 500);
  }

  // 4. Marcar la notificación del cliente como leída
  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  // 5. Crear notificación para el profesional (review_received)
  try {
    const { data: clientProfile } = await supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url')
      .eq('id', userId)
      .maybeSingle();

    const clientName = clientProfile
      ? `${clientProfile.first_name || ''} ${clientProfile.last_name || ''}`.trim()
      : 'Cliente';

    await supabase.from('notifications').insert({
      user_id: professionalId,
      type: 'review_received',
      title: 'Un cliente calificó tu servicio',
      description: 'Recibiste una nueva valoración sobre un turno finalizado.',
      href: `/professional/reviews/${newReview.id}/details`,
      related_entity_id: newReview.id,
      related_entity_type: 'review',
      is_read: false,
      metadata: {
        clientName,
        serviceName: request?.title || 'Servicio acordado',
        rating,
        tags: tags || [],
        comment: comment || null,
        appointmentId,
        reviewId: newReview.id,
        avatarUrl: clientProfile?.avatar_url || null,
        status: 'FINALIZADO',
      },
    });
  } catch (notifErr) {
    console.warn('[createReview] Error al crear notificación para el profesional:', notifErr);
  }

  return newReview;
};
