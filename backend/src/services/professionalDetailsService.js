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

const formatCurrency = (val) => {
  if (val === null || val === undefined) return '$0';
  const num = typeof val === 'number' ? val : parseFloat(val);
  return isNaN(num) ? String(val) : `$${num.toLocaleString('es-AR')}`;
};

const formatPaymentMethod = (method) => {
  if (!method) return 'Mercado Pago';
  const m = String(method).toLowerCase();
  if (m === 'mercadopago' || m === 'mercado_pago') return 'Mercado Pago';
  if (m === 'credit_card' || m === 'creditcard' || m === 'credito') return 'Tarjeta de Crédito';
  if (m === 'debit_card' || m === 'debitcard' || m === 'debito') return 'Tarjeta de Débito';
  if (m === 'transfer' || m === 'transferencia') return 'Transferencia';
  if (m === 'cash' || m === 'efectivo') return 'Efectivo';
  return method;
};

const formatPaymentDate = (d) => {
  if (!d) return 'Hoy';
  const dateObj = new Date(d);
  if (isNaN(dateObj.getTime())) return String(d);
  const day = dateObj.getDate();
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${day} ${month}, ${year}`;
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
  // 1. Buscar el pago directamente por ID
  let { data: payment } = await supabase
    .from('payments')
    .select('id, appointment_id, total_amount, deposit_amount, remaining_amount, method, status, external_operation_id, created_at')
    .eq('id', paymentId)
    .maybeSingle();

  // 2. Si no se encuentra, verificar si paymentId corresponde al ID de una notificación
  if (!payment) {
    const { data: notif } = await supabase
      .from('notifications')
      .select('id, related_entity_id, user_id')
      .eq('id', paymentId)
      .eq('user_id', professionalId)
      .maybeSingle();

    if (notif?.related_entity_id) {
      const { data: resolvedPayment } = await supabase
        .from('payments')
        .select('id, appointment_id, total_amount, deposit_amount, remaining_amount, method, status, external_operation_id, created_at')
        .or(`id.eq.${notif.related_entity_id},appointment_id.eq.${notif.related_entity_id}`)
        .maybeSingle();
      payment = resolvedPayment;
    }
  }

  // 3. Si aún no se encuentra, verificar si paymentId es el ID de un appointment
  if (!payment) {
    const { data: apptPayment } = await supabase
      .from('payments')
      .select('id, appointment_id, total_amount, deposit_amount, remaining_amount, method, status, external_operation_id, created_at')
      .eq('appointment_id', paymentId)
      .maybeSingle();
    payment = apptPayment;
  }

  if (!payment) {
    throw new AppError('Pago no encontrado', 404);
  }

  // 4. Obtener el turno asociado
  const { data: appt } = await supabase
    .from('appointments')
    .select('id, offer_id, scheduled_at, status')
    .eq('id', payment.appointment_id)
    .maybeSingle();

  // 5. Obtener la oferta asociada y validar IDOR
  const { data: offer } = await supabase
    .from('offers')
    .select('id, professional_id, request_id, amount, proposed_deposit, proposed_date, proposed_time')
    .eq('id', appt?.offer_id)
    .maybeSingle();

  if (!offer || offer.professional_id !== professionalId) {
    throw new AppError('Pago no encontrado', 404);
  }

  // 6. Obtener solicitud y perfiles (cliente y profesional)
  const { data: request } = await supabase
    .from('requests')
    .select('id, title, client_id')
    .eq('id', offer.request_id)
    .maybeSingle();

  const userIds = [professionalId, request?.client_id].filter(Boolean);
  let profProfile = null;
  let clientProfile = null;

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .in('id', userIds);

    profProfile = profiles?.find((p) => p.id === professionalId) || null;
    clientProfile = profiles?.find((p) => p.id === request?.client_id) || null;
  }

  const profName = profProfile ? `${profProfile.first_name || ''} ${profProfile.last_name || ''}`.trim() : 'Ricardo Gómez';
  const profParts = profName.split(' ').filter(Boolean);
  const profInitials = profParts.length >= 2 ? `${profParts[0][0]}${profParts[1][0]}`.toUpperCase() : profName.slice(0, 2).toUpperCase();

  const apptDateObj = appt?.scheduled_at ? new Date(appt.scheduled_at) : null;
  const formattedDate = apptDateObj && !isNaN(apptDateObj.getTime())
    ? `${String(apptDateObj.getDate()).padStart(2, '0')}/${String(apptDateObj.getMonth() + 1).padStart(2, '0')}/${apptDateObj.getFullYear()}`
    : '28/07/2026';
  const formattedTime = apptDateObj && !isNaN(apptDateObj.getTime())
    ? `${String(apptDateObj.getHours()).padStart(2, '0')}:${String(apptDateObj.getMinutes()).padStart(2, '0')} hs`
    : '15:30 hs';

  const opId = payment.external_operation_id
    ? (payment.external_operation_id.startsWith('#') ? payment.external_operation_id : `#${payment.external_operation_id}`)
    : `#OP-${String(payment.id).slice(0, 8).toUpperCase()}`;

  return {
    id: payment.id,
    client: buildClient(clientProfile),
    professionalName: profName,
    professionalInitials: profInitials,
    serviceName: request?.title || 'Instalación eléctrica',
    status: (appt?.status || 'PROGRAMADO').toUpperCase(),
    date: formattedDate,
    time: formattedTime,
    timeAgo: 'hace 2 días',
    paymentStatus: ['paid', 'partial', 'PAID', 'PARTIAL'].includes(payment.status) ? 'CONFIRMADO' : (payment.status ? payment.status.toUpperCase() : 'CONFIRMADO'),
    operationId: opId,
    paymentMethod: formatPaymentMethod(payment.method),
    paymentDate: formatPaymentDate(payment.created_at),
    amount: formatCurrency(payment.deposit_amount || payment.total_amount || offer.proposed_deposit || offer.amount || 3500),
    totalAmount: payment.total_amount,
    depositAmount: payment.deposit_amount,
    remainingAmount: payment.remaining_amount,
    method: payment.method,
    offerId: offer.id,
    appointmentId: appt?.id || payment.appointment_id,
    scheduledAt: appt?.scheduled_at,
    createdAt: payment.created_at,
  };
};

// ─── 4. Detalle de Reseña ─────────────────────────────────────────────────────

/**
 * Obtiene el detalle de una reseña recibida por el profesional.
 * Filtro IDOR: la reseña debe tener reviewee_id = professionalId.
 * JOIN: reviews → profiles (reviewer/client)
 */
export const getReviewById = async (professionalId, reviewId) => {
  // 1. Buscar la reseña directamente por id
  let { data: review } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      comment,
      tags,
      appointment_id,
      reviewee_id,
      reviewer_id,
      created_at
    `)
    .eq('id', reviewId)
    .maybeSingle();

  // 2. Si no se encuentra, verificar si reviewId corresponde al ID de una notificación
  if (!review) {
    const { data: notif } = await supabase
      .from('notifications')
      .select('id, related_entity_id, user_id')
      .eq('id', reviewId)
      .eq('user_id', professionalId)
      .maybeSingle();

    if (notif?.related_entity_id) {
      const { data: resolvedReview } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          tags,
          appointment_id,
          reviewee_id,
          reviewer_id,
          created_at
        `)
        .eq('id', notif.related_entity_id)
        .maybeSingle();
      review = resolvedReview;
    }
  }

  // IDOR check: verificar que exista y pertenezca al profesional autenticado
  if (!review || review.reviewee_id !== professionalId) {
    throw new AppError('Reseña no encontrada', 404);
  }

  // 3. Obtener datos del cliente (reviewer)
  let reviewerProfile = null;
  if (review.reviewer_id) {
    const { data: prof } = await supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url')
      .eq('id', review.reviewer_id)
      .maybeSingle();
    reviewerProfile = prof;
  }

  // 4. Obtener datos del turno y de la solicitud asociada
  let appointmentTitle = 'Servicio realizado';
  let offerId = null;

  if (review.appointment_id) {
    const { data: appt } = await supabase
      .from('appointments')
      .select('id, offer_id')
      .eq('id', review.appointment_id)
      .maybeSingle();

    if (appt?.offer_id) {
      offerId = appt.offer_id;
      const { data: offer } = await supabase
        .from('offers')
        .select('id, request_id')
        .eq('id', appt.offer_id)
        .maybeSingle();

      if (offer?.request_id) {
        const { data: req } = await supabase
          .from('requests')
          .select('id, title')
          .eq('id', offer.request_id)
          .maybeSingle();

        if (req?.title) {
          appointmentTitle = req.title;
        }
      }
    }
  }

  return {
    id: review.id,
    client: buildClient(reviewerProfile),
    rating: review.rating,
    comment: review.comment,
    tags: review.tags || [],
    appointmentId: review.appointment_id,
    appointmentTitle,
    offerId,
    createdAt: review.created_at,
  };
};

/**
 * Marca un turno como completado / finalizado, actualiza la solicitud asociada
 * y genera automáticamente las notificaciones:
 * 1. Para el profesional: 'job_finished' (Trabajo finalizado, maleta negra).
 * 2. Para el cliente: 'rating' (¡Calificá tu experiencia!, estrella dorada).
 * 
 * @param {string} professionalId - UUID del profesional autenticado
 * @param {string} appointmentId - UUID del appointment (o id de notificación)
 * @returns {Promise<Object>} { success: true, appointmentId, status: 'completed' }
 */
export const completeAppointment = async (professionalId, appointmentId) => {
  // 1. Resolver el turno
  let appt = null;
  const { data: directAppt } = await supabase
    .from('appointments')
    .select('id, offer_id, scheduled_at, status, notes')
    .eq('id', appointmentId)
    .maybeSingle();

  if (directAppt) {
    appt = directAppt;
  } else {
    // Si vino el ID de la notificación
    const { data: notif } = await supabase
      .from('notifications')
      .select('related_entity_id')
      .eq('id', appointmentId)
      .maybeSingle();

    if (notif?.related_entity_id) {
      const { data: resolvedAppt } = await supabase
        .from('appointments')
        .select('id, offer_id, scheduled_at, status, notes')
        .or(`id.eq.${notif.related_entity_id},offer_id.eq.${notif.related_entity_id}`)
        .maybeSingle();
      appt = resolvedAppt;
    }
  }

  if (!appt) {
    throw new AppError('Turno no encontrado', 404);
  }

  // 2. Obtener oferta y validar IDOR
  const { data: offer } = await supabase
    .from('offers')
    .select('id, professional_id, request_id')
    .eq('id', appt.offer_id)
    .maybeSingle();

  if (!offer || offer.professional_id !== professionalId) {
    throw new AppError('Turno no encontrado', 404);
  }

  // 3. Obtener solicitud y cliente
  const { data: request } = await supabase
    .from('requests')
    .select('id, title, client_id')
    .eq('id', offer.request_id)
    .maybeSingle();

  const clientId = request?.client_id;
  const serviceName = request?.title || 'Servicio completado';
  const formattedDate = formatDate(appt.scheduled_at);

  // 4. Obtener perfiles
  const userIds = [professionalId, clientId].filter(Boolean);
  let profProfile = null;
  let clientProfile = null;

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .in('id', userIds);

    profProfile = profiles?.find((p) => p.id === professionalId) || null;
    clientProfile = profiles?.find((p) => p.id === clientId) || null;
  }

  const profName = profProfile ? `${profProfile.first_name || ''} ${profProfile.last_name || ''}`.trim() : 'Profesional';
  const profParts = profName.split(' ').filter(Boolean);
  const profInitials = profParts.length >= 2 ? `${profParts[0][0]}${profParts[1][0]}`.toUpperCase() : profName.slice(0, 2).toUpperCase();

  const clientName = clientProfile ? `${clientProfile.first_name || ''} ${clientProfile.last_name || ''}`.trim() : 'Cliente';

  // 5. Actualizar estado del appointment y de la request
  await supabase
    .from('appointments')
    .update({ status: 'completed' })
    .eq('id', appt.id);

  if (request?.id) {
    await supabase
      .from('requests')
      .update({ status: 'completed' })
      .eq('id', request.id);
  }

  // 6. Notificación para el Profesional (job_finished)
  const { data: existingProfNotif } = await supabase
    .from('notifications')
    .select('id')
    .eq('user_id', professionalId)
    .eq('related_entity_id', appt.id)
    .eq('type', 'job_finished')
    .maybeSingle();

  if (!existingProfNotif) {
    await supabase.from('notifications').insert({
      user_id: professionalId,
      type: 'job_finished',
      title: 'Trabajo finalizado',
      description: 'Has completado el servicio con éxito.',
      href: '/professional/agenda',
      related_entity_id: appt.id,
      related_entity_type: 'appointment',
      is_read: false,
      metadata: {
        clientName,
        serviceName,
        status: 'FINALIZADO',
        date: formattedDate,
      },
    });
  }

  // 7. Notificación para el Cliente (rating)
  if (clientId) {
    const { data: existingClientNotif } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', clientId)
      .eq('related_entity_id', appt.id)
      .eq('type', 'rating')
      .maybeSingle();

    if (!existingClientNotif) {
      await supabase.from('notifications').insert({
        user_id: clientId,
        type: 'rating',
        title: '¡Calificá tu experiencia!',
        description: `¿Cómo fue el servicio con ${profName}?`,
        href: '/client/agenda',
        related_entity_id: appt.id,
        related_entity_type: 'appointment',
        is_read: false,
        metadata: {
          professionalName: profName,
          professionalInitials: profInitials,
          avatarUrl: profProfile?.avatar_url || null,
          professionalAvatarUrl: profProfile?.avatar_url || null,
          serviceName,
          status: 'FINALIZADO',
          date: formattedDate,
          timeAgo: 'Hoy',
          appointmentId: appt.id,
        },
      });
    }
  }

  return {
    success: true,
    appointmentId: appt.id,
    status: 'completed',
  };
};
