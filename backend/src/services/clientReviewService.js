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
    .select('user_id, metadata')
    .eq('id', notificationId)
    .single();

  if (notifError || !notification) {
    throw new NotFoundError('Notificación no encontrada');
  }

  if (notification.user_id !== userId) {
    throw new NotFoundError('Notificación no encontrada'); // Evitamos fuga de info con 404 en lugar de 403
  }

  const appointmentId = notification.metadata?.appointmentId;
  if (!appointmentId) {
    throw new AppError('La notificación no está asociada a un turno válido', 400);
  }

  // 2. Validar el turno (estado FINALIZADO y pertenencia al cliente)
  const { data: appointment, error: apptError } = await supabase
    .from('appointments')
    .select(`
      id,
      status,
      offers (
        professional_id,
        requests (
          client_id
        )
      )
    `)
    .eq('id', appointmentId)
    .single();

  if (apptError || !appointment) {
    throw new NotFoundError('El turno asociado no existe');
  }

  // Verificar pertenencia (el cliente del request debe ser el userId)
  const clientId = appointment.offers?.requests?.client_id;
  if (clientId !== userId) {
    throw new NotFoundError('El turno asociado no existe');
  }

  // Verificar estado del turno
  const finalStatuses = ['FINALIZADO', 'COMPLETED', 'completed', 'finalizado'];
  if (!finalStatuses.includes(appointment.status)) {
    throw new ConflictError('No se puede calificar un turno que no ha finalizado');
  }

  const professionalId = appointment.offers.professional_id;

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

  return newReview;
};
