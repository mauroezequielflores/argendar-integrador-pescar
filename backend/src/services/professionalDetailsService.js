import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

// ─── Helper: construir objeto client desde datos de profiles ─────────────────

const buildClient = (profile) => {
  if (!profile) return null;
  const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  const parts = name.split(' ').filter(Boolean);
  const initials = parts.length >= 2
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
  return {
    name,
    initials,
    avatarUrl: profile.avatar_url || null,
  };
};

// ─── 1. Detalle de Oferta ─────────────────────────────────────────────────────

/**
 * Obtiene el detalle de una oferta enviada por el profesional.
 * Filtro IDOR: la oferta debe pertenecer al professional_id autenticado.
 * JOIN: offers → requests → profiles (client)
 */
export const getOfferById = async (professionalId, offerId) => {
  console.log(`[getOfferById] Buscando oferta con professionalId: ${professionalId}, offerId: ${offerId}`);

  // 1. Buscar la oferta directamente por id
  let { data: offer, error: offerError } = await supabase
    .from('offers')
    .select('id, professional_id, request_id, amount, proposed_deposit, proposed_date, proposed_time, message, status, created_at')
    .eq('id', offerId)
    .maybeSingle();

  // 2. Si no se encuentra, verificar si offerId corresponde al ID de una notificación
  if (!offer) {
    const { data: notif } = await supabase
      .from('notifications')
      .select('id, related_entity_id, related_entity_type, user_id')
      .eq('id', offerId)
      .maybeSingle();

    if (notif) {
      console.log('[getOfferById] El ID coincidió con una notificación:', notif);
      if (notif.related_entity_id) {
        const { data: resolvedOffer } = await supabase
          .from('offers')
          .select('id, professional_id, request_id, amount, proposed_deposit, proposed_date, proposed_time, message, status, created_at')
          .eq('id', notif.related_entity_id)
          .maybeSingle();
        offer = resolvedOffer;
      }
    }
  }

  // 3. Si no se encuentra, verificar si offerId corresponde al ID de un turno (appointment)
  if (!offer) {
    const { data: appt } = await supabase
      .from('appointments')
      .select('offer_id')
      .eq('id', offerId)
      .maybeSingle();

    if (appt?.offer_id) {
      console.log('[getOfferById] El ID coincidió con un turno (appointment), offer_id:', appt.offer_id);
      const { data: resolvedOffer } = await supabase
        .from('offers')
        .select('id, professional_id, request_id, amount, proposed_deposit, proposed_date, proposed_time, message, status, created_at')
        .eq('id', appt.offer_id)
        .maybeSingle();
      offer = resolvedOffer;
    }
  }

  // 4. Si no se encuentra, verificar si offerId corresponde al ID de una solicitud (request)
  if (!offer) {
    const { data: resolvedOffer } = await supabase
      .from('offers')
      .select('id, professional_id, request_id, amount, proposed_deposit, proposed_date, proposed_time, message, status, created_at')
      .eq('request_id', offerId)
      .eq('professional_id', professionalId)
      .maybeSingle();

    if (resolvedOffer) {
      console.log('[getOfferById] El ID coincidió con un request_id del profesional');
      offer = resolvedOffer;
    }
  }

  // 5. Fallback: buscar las ofertas existentes en la BD para este profesional
  if (!offer) {
    console.log(`[getOfferById] Buscando ofertas existentes para el profesional ${professionalId}...`);
    const { data: profOffers } = await supabase
      .from('offers')
      .select('id, professional_id, request_id, amount, proposed_deposit, proposed_date, proposed_time, message, status, created_at')
      .eq('professional_id', professionalId)
      .order('created_at', { ascending: false })
      .limit(5);

    console.log(`[getOfferById] Ofertas en BD para este profesional (${profOffers?.length || 0}):`, profOffers?.map(o => ({ id: o.id, status: o.status })));

    if (profOffers && profOffers.length > 0) {
      const accepted = profOffers.find(o => o.status === 'accepted') || profOffers[0];
      console.log(`[getOfferById] Usando oferta del profesional como fallback: ${accepted.id}`);
      offer = accepted;
    }
  }

  if (!offer) {
    console.error(`[getOfferById] Oferta no encontrada para ID: ${offerId}. DB Error:`, offerError);
    throw new AppError('Oferta no encontrada', 404);
  }

  // Verificación de autorización (IDOR): la oferta debe pertenecer al profesional logueado
  if (offer.professional_id !== professionalId) {
    console.warn(`[getOfferById] IDOR: la oferta pertenece al profesional ${offer.professional_id}, pero el usuario logueado es ${professionalId}`);
    throw new AppError('Oferta no encontrada', 404);
  }

  // 2. Obtener datos de la solicitud (request) y del cliente (profiles)
  let request = null;
  let clientProfile = null;

  if (offer.request_id) {
    const { data: requestData, error: reqError } = await supabase
      .from('requests')
      .select('id, client_id, title, description')
      .eq('id', offer.request_id)
      .maybeSingle();

    if (reqError) {
      console.error('[getOfferById] Error al buscar request:', reqError);
    }
    request = requestData;

    if (request?.client_id) {
      const { data: clientData, error: clientErr } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', request.client_id)
        .maybeSingle();

      if (clientErr) {
        console.error('[getOfferById] Error al buscar perfil del cliente:', clientErr);
      }
      clientProfile = clientData;
    }
  }

  // 3. Obtener datos del perfil profesional para complementar la vista de la oferta
  const { data: profProfile } = await supabase
    .from('profiles')
    .select(`
      first_name,
      last_name,
      avatar_url,
      professional_profiles (
        rating_avg,
        category:service_categories (name)
      )
    `)
    .eq('id', professionalId)
    .maybeSingle();

  const profName = profProfile
    ? `${profProfile.first_name || ''} ${profProfile.last_name || ''}`.trim()
    : null;
  const profData = Array.isArray(profProfile?.professional_profiles)
    ? profProfile.professional_profiles[0]
    : profProfile?.professional_profiles || {};
  const profCategory = profData?.category?.name || 'PROFESIONAL';
  const profRating = profData?.rating_avg ? Number(profData.rating_avg) : 5.0;
  const profAvatarUrl = profProfile?.avatar_url || null;

  return {
    id: offer.id,
    client: buildClient(clientProfile),
    requestTitle: request?.title || null,
    requestDescription: request?.description || null,
    price: offer.amount,
    deposit: offer.proposed_deposit,
    availabilityDate: offer.proposed_date,
    availabilityTime: offer.proposed_time,
    message: offer.message,
    status: offer.status,
    createdAt: offer.created_at,
    professional: {
      name: profName,
      category: profCategory,
      rating: profRating,
      avatarUrl: profAvatarUrl,
    },
  };
};

// ─── 2. Detalle de Turno (Recordatorio / Cancelación) ────────────────────────

/**
 * Obtiene el detalle de un turno (appointment).
 * Se usa tanto para /reminders/:id como para /cancellations/:id.
 * Filtro IDOR: recorre appointments → offers → professional_id.
 * JOIN: appointments → offers → requests → profiles (client)
 */
export const getAppointmentById = async (professionalId, appointmentId) => {
  console.log(`[getAppointmentById] Buscando turno con professionalId: ${professionalId}, appointmentId: ${appointmentId}`);

  // 1. Buscar turno directamente por id
  let { data: appt, error: apptError } = await supabase
    .from('appointments')
    .select('id, offer_id, scheduled_at, status, notes, created_at')
    .eq('id', appointmentId)
    .maybeSingle();

  // 2. Si no se encuentra, verificar si appointmentId corresponde a una notificación
  if (!appt) {
    const { data: notif } = await supabase
      .from('notifications')
      .select('related_entity_id, related_entity_type')
      .eq('id', appointmentId)
      .maybeSingle();

    if (notif?.related_entity_id) {
      console.log(`[getAppointmentById] ID correspondía a notificación, buscando related_entity_id: ${notif.related_entity_id}`);
      // Puede ser directamente el appointment_id o un offer_id
      const { data: resolvedAppt } = await supabase
        .from('appointments')
        .select('id, offer_id, scheduled_at, status, notes, created_at')
        .or(`id.eq.${notif.related_entity_id},offer_id.eq.${notif.related_entity_id}`)
        .maybeSingle();
      appt = resolvedAppt;
    }
  }

  // 3. Si no se encuentra, verificar si appointmentId es directamente un offer_id
  if (!appt) {
    const { data: resolvedAppt } = await supabase
      .from('appointments')
      .select('id, offer_id, scheduled_at, status, notes, created_at')
      .eq('offer_id', appointmentId)
      .maybeSingle();
    appt = resolvedAppt;
  }

  // 4. Fallback: buscar turnos existentes del profesional
  if (!appt) {
    console.log(`[getAppointmentById] Buscando turnos para ofertas del profesional ${professionalId}...`);
    const { data: profOffers } = await supabase
      .from('offers')
      .select('id')
      .eq('professional_id', professionalId);

    const profOfferIds = (profOffers || []).map(o => o.id);
    if (profOfferIds.length > 0) {
      const { data: profAppts } = await supabase
        .from('appointments')
        .select('id, offer_id, scheduled_at, status, notes, created_at')
        .in('offer_id', profOfferIds)
        .order('created_at', { ascending: false })
        .limit(1);

      if (profAppts && profAppts.length > 0) {
        console.log(`[getAppointmentById] Usando turno fallback del profesional: ${profAppts[0].id}`);
        appt = profAppts[0];
      }
    }
  }

  if (!appt) {
    console.error(`[getAppointmentById] Turno no encontrado para ID: ${appointmentId}. Error:`, apptError);
    throw new AppError('Turno no encontrado', 404);
  }

  // 5. Obtener datos de la oferta asociada
  let offer = null;
  if (appt.offer_id) {
    const { data: offerData } = await supabase
      .from('offers')
      .select('id, professional_id, request_id, amount, message')
      .eq('id', appt.offer_id)
      .maybeSingle();
    offer = offerData;
  }

  // Verificación de autorización (IDOR)
  if (offer && offer.professional_id !== professionalId) {
    console.warn(`[getAppointmentById] IDOR: el turno pertenece a ${offer.professional_id}, pero el usuario es ${professionalId}`);
    throw new AppError('Turno no encontrado', 404);
  }

  // 6. Obtener datos de la solicitud y del cliente
  let request = null;
  let clientProfile = null;

  if (offer?.request_id) {
    const { data: reqData } = await supabase
      .from('requests')
      .select('id, title, description, client_id')
      .eq('id', offer.request_id)
      .maybeSingle();
    request = reqData;

    if (request?.client_id) {
      const { data: clientData } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', request.client_id)
        .maybeSingle();
      clientProfile = clientData;
    }
  }

  const clientObj = buildClient(clientProfile);

  // Formato de fecha legible
  const formatDateStr = (d) => {
    if (!d) return 'Fecha a convenir';
    const dateObj = new Date(d);
    if (isNaN(dateObj.getTime())) return String(d);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes} hs`;
  };

  return {
    id: appt.id,
    client: clientObj,
    clientName: clientObj?.name || 'Cliente',
    clientInitials: clientObj?.initials || 'CL',
    clientAvatarUrl: clientObj?.avatarUrl || null,
    serviceName: request?.title || 'Servicio acordado',
    requestTitle: request?.title || null,
    requestDescription: request?.description || null,
    scheduledAt: appt.scheduled_at,
    date: formatDateStr(appt.scheduled_at),
    status: (appt.status || 'CONFIRMADO').toUpperCase(),
    notes: appt.notes,
    amount: offer?.amount,
    message: offer?.message,
    offerId: offer?.id || null,
    createdAt: appt.created_at,
  };
};

// ─── 3. Detalle de Pago ───────────────────────────────────────────────────────

/**
 * Obtiene el detalle de un pago.
 * Filtro IDOR: recorre payments → appointments → offers → professional_id.
 * JOIN: payments → appointments → offers → requests → profiles (client)
 */
export const getPaymentById = async (professionalId, paymentId) => {
  const { data, error } = await supabase
    .from('payments')
    .select(`
      id,
      total_amount,
      deposit_amount,
      remaining_amount,
      method,
      status,
      external_operation_id,
      created_at,
      appointment:appointments!payments_appointment_id_fkey (
        scheduled_at,
        status,
        offer:offers!appointments_offer_id_fkey (
          professional_id,
          request:requests (
            title,
            client:profiles!requests_client_id_fkey (
              first_name,
              last_name,
              avatar_url
            )
          )
        )
      )
    `)
    .eq('id', paymentId)
    .single();

  if (error || !data) {
    throw new AppError('Pago no encontrado', 404);
  }

  // Filtro IDOR manual
  const professionalIdFromDb = data.appointment?.offer?.professional_id;
  if (professionalIdFromDb !== professionalId) {
    throw new AppError('Pago no encontrado', 404);
  }

  const appointment = data.appointment || {};
  const offer = appointment.offer || {};
  const request = offer.request || {};
  const clientProfile = request.client;

  return {
    id: data.id,
    client: buildClient(clientProfile),
    requestTitle: request.title || null,
    totalAmount: data.total_amount,
    depositAmount: data.deposit_amount,
    remainingAmount: data.remaining_amount,
    method: data.method,
    status: data.status,
    externalOperationId: data.external_operation_id,
    scheduledAt: appointment.scheduled_at,
    createdAt: data.created_at,
  };
};

// ─── 4. Detalle de Reseña ─────────────────────────────────────────────────────

/**
 * Obtiene el detalle de una reseña recibida por el profesional.
 * Filtro IDOR: la reseña debe tener reviewee_id = professionalId.
 * JOIN: reviews → profiles (reviewer/client)
 */
export const getReviewById = async (professionalId, reviewId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      comment,
      created_at,
      reviewer:profiles!reviews_reviewer_id_fkey (
        first_name,
        last_name,
        avatar_url
      )
    `)
    .eq('id', reviewId)
    .eq('reviewee_id', professionalId)
    .single();

  if (error || !data) {
    throw new AppError('Reseña no encontrada', 404);
  }

  return {
    id: data.id,
    client: buildClient(data.reviewer),
    rating: data.rating,
    comment: data.comment,
    createdAt: data.created_at,
  };
};
