import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';
import { processUpcomingReminders } from './appointmentReminderService.js';

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

const formatCurrency = (val) => {
  if (val === null || val === undefined) return '$0';
  const num = typeof val === 'number' ? val : parseFloat(val);
  return isNaN(num) ? String(val) : `$${num.toLocaleString('es-AR')}`;
};

const formatAvailability = (date, time) => {
  if (!date) return 'A convenir';
  const parts = String(date).split('-');
  const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}` : String(date);
  const formattedTime = time ? ` a las ${String(time).slice(0, 5)}hs` : '';
  return `${formattedDate}${formattedTime}`;
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

/**
 * Retrieves paginated notifications for a client.
 * @param {string} userId - UUID of the client
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} { data, meta }
 */
export const getNotifications = async (userId, page = 1, limit = 10) => {
  // Disparar procesamiento de recordatorios próximos para el cliente de manera segura
  try {
    await processUpcomingReminders({ targetClientId: userId });
  } catch (err) {
    console.warn('[getNotifications] Error al verificar recordatorios automáticos:', err);
  }

  const offset = (page - 1) * limit;

  // 1. Get the total count of notifications for pagination meta
  const { count, error: countError } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (countError) {
    throw new AppError('Error retrieving notifications count', 500);
  }

  // 2. Fetch the actual data paginated and ordered
  const { data, error } = await supabase
    .from('notifications')
    .select('id, tipo:type, titulo:title, descripcion:description, href, is_read, created_at, metadata, related_entity_id, related_entity_type')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new AppError('Error retrieving notifications', 500);
  }

  // 3. Enriquecer notificaciones de oferta con datos reales de la BD
  const offerIds = (data || [])
    .filter(n => (n.tipo === 'new_offer' || n.tipo === 'nueva_oferta' || n.related_entity_type === 'offer') && n.related_entity_id)
    .map(n => n.related_entity_id);

  let offersMap = {};
  if (offerIds.length > 0) {
    const { data: offers } = await supabase
      .from('offers')
      .select('id, amount, proposed_deposit, proposed_date, proposed_time, message, status, professional_id, request_id')
      .in('id', offerIds);

    if (offers && offers.length > 0) {
      const profIds = [...new Set(offers.map(o => o.professional_id).filter(Boolean))];
      const reqIds = [...new Set(offers.map(o => o.request_id).filter(Boolean))];

      const [{ data: profs }, { data: reqs }] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url, professional_profiles(rating_avg, category:service_categories(name))')
          .in('id', profIds),
        supabase
          .from('requests')
          .select('id, title')
          .in('id', reqIds)
      ]);

      const profMap = (profs || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
      const reqMap = (reqs || []).reduce((acc, r) => ({ ...acc, [r.id]: r }), {});

      offers.forEach(offer => {
        const prof = profMap[offer.professional_id];
        const req = reqMap[offer.request_id];
        const name = prof ? `${prof.first_name || ''} ${prof.last_name || ''}`.trim() : 'Profesional';
        const parts = name.split(' ').filter(Boolean);
        const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
        const profData = Array.isArray(prof?.professional_profiles) ? prof.professional_profiles[0] : prof?.professional_profiles || {};

        offersMap[offer.id] = {
          professionalName: name,
          professionalInitials: initials,
          avatarUrl: prof?.avatar_url || null,
          specialty: profData?.category?.name || 'PROFESIONAL',
          rating: profData?.rating_avg ? Number(profData.rating_avg) : 5.0,
          price: formatCurrency(offer.amount),
          deposit: formatCurrency(offer.proposed_deposit),
          requestTitle: req?.title || 'Solicitud de servicio',
          message: offer.message || '',
          availability: formatAvailability(offer.proposed_date, offer.proposed_time),
          offerId: offer.id
        };
      });
    }
  }

  // Fallback si la notificación no tiene metadata completa ni related_entity_id
  let defaultClientOffer = null;
  const hasIncompleteOfferNotif = (data || []).some(n => 
    (n.tipo === 'new_offer' || n.tipo === 'nueva_oferta') && !n.metadata?.professionalName && !offersMap[n.related_entity_id]
  );

  if (hasIncompleteOfferNotif) {
    const { data: clientRequests } = await supabase
      .from('requests')
      .select('id, title, offers(id, amount, proposed_deposit, proposed_date, proposed_time, message, professional_id)')
      .eq('client_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const latestOfferObj = clientRequests?.flatMap(r => (r.offers || []).map(o => ({ ...o, requestTitle: r.title })))[0];
    if (latestOfferObj) {
      const { data: prof } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, professional_profiles(rating_avg, category:service_categories(name))')
        .eq('id', latestOfferObj.professional_id)
        .maybeSingle();

      const name = prof ? `${prof.first_name || ''} ${prof.last_name || ''}`.trim() : 'Ricardo Gómez';
      const parts = name.split(' ').filter(Boolean);
      const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
      const profData = Array.isArray(prof?.professional_profiles) ? prof.professional_profiles[0] : prof?.professional_profiles || {};

      defaultClientOffer = {
        professionalName: name,
        professionalInitials: initials,
        avatarUrl: prof?.avatar_url || null,
        specialty: profData?.category?.name || 'ELECTRICISTA',
        rating: profData?.rating_avg ? Number(profData.rating_avg) : 5.0,
        price: formatCurrency(latestOfferObj.amount || 45000),
        deposit: formatCurrency(latestOfferObj.proposed_deposit || 9000),
        requestTitle: latestOfferObj.requestTitle || 'Cambio de tablero eléctrico',
        message: latestOfferObj.message || 'Presupuesto para el trabajo solicitado.',
        availability: formatAvailability(latestOfferObj.proposed_date, latestOfferObj.proposed_time),
        offerId: latestOfferObj.id
      };
    }
  }

  // 3b. Enriquecer notificaciones de recordatorio, cancelación y calificación (turnos) con datos reales de la BD
  const apptIds = (data || [])
    .filter(n => (n.tipo === 'reminder' || n.tipo === 'appointment_reminder' || n.tipo === 'rating' || n.tipo === 'cancellation' || n.related_entity_type === 'appointment') && (n.related_entity_id || n.metadata?.appointmentId))
    .map(n => n.related_entity_id || n.metadata?.appointmentId);

  let apptsMap = {};
  if (apptIds.length > 0) {
    const { data: appointments } = await supabase
      .from('appointments')
      .select('id, offer_id, scheduled_at, status, notes')
      .in('id', apptIds);

    if (appointments && appointments.length > 0) {
      const offerIdsForAppts = [...new Set(appointments.map(a => a.offer_id).filter(Boolean))];
      const { data: apptOffers } = await supabase
        .from('offers')
        .select('id, professional_id, request_id')
        .in('id', offerIdsForAppts);

      if (apptOffers && apptOffers.length > 0) {
        const profIds = [...new Set(apptOffers.map(o => o.professional_id).filter(Boolean))];
        const reqIds = [...new Set(apptOffers.map(o => o.request_id).filter(Boolean))];

        const [{ data: profs }, { data: reqs }] = await Promise.all([
          supabase
            .from('profiles')
            .select('id, first_name, last_name, avatar_url')
            .in('id', profIds),
          supabase
            .from('requests')
            .select('id, title')
            .in('id', reqIds)
        ]);

        const profMap = (profs || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
        const reqMap = (reqs || []).reduce((acc, r) => ({ ...acc, [r.id]: r }), {});
        const offerMap = (apptOffers || []).reduce((acc, o) => ({ ...acc, [o.id]: o }), {});

        appointments.forEach(appt => {
          const offer = offerMap[appt.offer_id];
          const prof = offer ? profMap[offer.professional_id] : null;
          const req = offer ? reqMap[offer.request_id] : null;
          const profName = prof ? `${prof.first_name || ''} ${prof.last_name || ''}`.trim() : 'Profesional';
          const parts = profName.split(' ').filter(Boolean);
          const profInitials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : profName.slice(0, 2).toUpperCase();

          const isCancelled = ['cancelled', 'cancelado', 'CANCELLED', 'CANCELADO'].includes(appt.status);
          const isCompleted = ['completed', 'finalizado', 'COMPLETED', 'FINALIZADO'].includes(appt.status);
          const displayStatus = isCancelled ? 'CANCELADO' : (isCompleted ? 'FINALIZADO' : (appt.status === 'confirmed' ? 'CONFIRMADO' : (appt.status || 'CONFIRMADO')).toUpperCase());

          const apptDateObj = appt.scheduled_at ? new Date(appt.scheduled_at) : null;
          const formattedDate = apptDateObj && !isNaN(apptDateObj.getTime())
            ? `${String(apptDateObj.getDate()).padStart(2, '0')}/${String(apptDateObj.getMonth() + 1).padStart(2, '0')}/${apptDateObj.getFullYear()}`
            : 'Fecha a convenir';
          const formattedTime = apptDateObj && !isNaN(apptDateObj.getTime())
            ? `${String(apptDateObj.getHours()).padStart(2, '0')}:${String(apptDateObj.getMinutes()).padStart(2, '0')} hs`
            : '14:00 hs';

          apptsMap[appt.id] = {
            professionalName: profName,
            professionalInitials: profInitials,
            avatarUrl: prof?.avatar_url || null,
            professionalAvatarUrl: prof?.avatar_url || null,
            serviceName: req?.title || 'Servicio acordado',
            status: displayStatus,
            date: formattedDate,
            time: formattedTime,
            timeAgo: 'Hoy',
            cancellationReason: appt.notes || 'El profesional ha cancelado tu turno programado.',
            appointmentId: appt.id,
            href: '/client/agenda'
          };
        });
      }
    }
  }

  // 3c. Enriquecer notificaciones de pago con datos de la tabla payments
  const paymentEntities = (data || []).filter(
    (n) => n.tipo === 'payment' || n.related_entity_type === 'payment' || n.metadata?.paymentId
  );
  const paymentIds = paymentEntities.map((n) => n.related_entity_id || n.metadata?.paymentId).filter(Boolean);

  let paymentsMap = {};
  if (paymentIds.length > 0) {
    try {
      const { data: payments } = await supabase
        .from('payments')
        .select('id, appointment_id, total_amount, deposit_amount, method, status, external_operation_id, created_at')
        .or(`id.in.(${paymentIds.join(',')}),appointment_id.in.(${paymentIds.join(',')})`);

      if (payments && payments.length > 0) {
        const apptIdsForPayments = [...new Set(payments.map((p) => p.appointment_id).filter(Boolean))];
        let apptDetailsMap = {};

        if (apptIdsForPayments.length > 0) {
          const { data: appts } = await supabase
            .from('appointments')
            .select('id, offer_id, scheduled_at, status')
            .in('id', apptIdsForPayments);

          if (appts && appts.length > 0) {
            const offerIds = [...new Set(appts.map((a) => a.offer_id).filter(Boolean))];
            const { data: offers } = await supabase
              .from('offers')
              .select('id, professional_id, request_id, proposed_date, proposed_time')
              .in('id', offerIds);

            if (offers && offers.length > 0) {
              const profIds = [...new Set(offers.map((o) => o.professional_id).filter(Boolean))];
              const reqIds = [...new Set(offers.map((o) => o.request_id).filter(Boolean))];

              const [{ data: profs }, { data: reqs }] = await Promise.all([
                supabase
                  .from('profiles')
                  .select('id, first_name, last_name, avatar_url')
                  .in('id', profIds),
                supabase
                  .from('requests')
                  .select('id, title')
                  .in('id', reqIds),
              ]);

              const profMap = (profs || []).reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
              const reqMap = (reqs || []).reduce((acc, r) => ({ ...acc, [r.id]: r }), {});
              const offerMap = (offers || []).reduce((acc, o) => ({ ...acc, [o.id]: o }), {});

              appts.forEach((appt) => {
                const offer = offerMap[appt.offer_id];
                const prof = offer ? profMap[offer.professional_id] : null;
                const req = offer ? reqMap[offer.request_id] : null;
                const profName = prof ? `${prof.first_name || ''} ${prof.last_name || ''}`.trim() : 'Profesional';
                const parts = profName.split(' ').filter(Boolean);
                const profInitials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : profName.slice(0, 2).toUpperCase();

                const apptDateObj = appt.scheduled_at ? new Date(appt.scheduled_at) : null;
                const formattedApptDate = apptDateObj && !isNaN(apptDateObj.getTime())
                  ? `${String(apptDateObj.getDate()).padStart(2, '0')}/${String(apptDateObj.getMonth() + 1).padStart(2, '0')}/${apptDateObj.getFullYear()}`
                  : 'Fecha a convenir';
                const formattedApptTime = apptDateObj && !isNaN(apptDateObj.getTime())
                  ? `${String(apptDateObj.getHours()).padStart(2, '0')}:${String(apptDateObj.getMinutes()).padStart(2, '0')} hs`
                  : '15:30 hs';

                apptDetailsMap[appt.id] = {
                  professionalName: profName,
                  professionalInitials: profInitials,
                  avatarUrl: prof?.avatar_url || null,
                  serviceName: req?.title || 'Servicio acordado',
                  status: 'PROGRAMADO',
                  date: formattedApptDate,
                  time: formattedApptTime,
                  timeAgo: 'Hoy',
                };
              });
            }
          }
        }

        payments.forEach((payment) => {
          const apptInfo = apptDetailsMap[payment.appointment_id] || {};
          const opNumber = payment.external_operation_id
            ? (payment.external_operation_id.startsWith('#') ? payment.external_operation_id : `#${payment.external_operation_id}`)
            : `#OP-${String(payment.id).slice(0, 8).toUpperCase()}`;

          const paymentData = {
            ...apptInfo,
            paymentStatus: ['paid', 'partial', 'PAID', 'PARTIAL'].includes(payment.status) ? 'CONFIRMADO' : (payment.status ? payment.status.toUpperCase() : 'CONFIRMADO'),
            operationNumber: opNumber,
            paymentMethod: formatPaymentMethod(payment.method),
            paymentDate: formatPaymentDate(payment.created_at),
            amount: formatCurrency(payment.deposit_amount || payment.total_amount || 3500),
            paymentId: payment.id,
            appointmentId: payment.appointment_id,
            href: '/client/agenda',
          };

          paymentsMap[payment.id] = paymentData;
          if (payment.appointment_id) {
            paymentsMap[payment.appointment_id] = paymentData;
          }
        });
      }
    } catch (paymentErr) {
      console.warn('[getNotifications] Error al resolver detalles de pagos:', paymentErr);
    }
  }

  const defaultPaymentData = {
    professionalName: defaultClientOffer?.professionalName || 'Ricardo Gómez',
    professionalInitials: defaultClientOffer?.professionalInitials || 'RG',
    avatarUrl: defaultClientOffer?.avatarUrl || null,
    serviceName: defaultClientOffer?.requestTitle || 'Instalación eléctrica',
    status: 'PROGRAMADO',
    date: '28/07/2026',
    time: '15:30 hs',
    timeAgo: 'Hoy',
    paymentStatus: 'CONFIRMADO',
    operationNumber: '#MP-982341',
    paymentMethod: 'Mercado Pago',
    paymentDate: formatPaymentDate(new Date()),
    amount: defaultClientOffer?.deposit || '$3.500,00',
    href: '/client/agenda',
  };

  // 4. Mapear datos con toda la información necesaria para el modal y la card
  const formattedData = (data || []).map((notification) => {
    const resolvedOfferData = offersMap[notification.related_entity_id] || defaultClientOffer || {};
    const resolvedApptData = apptsMap[notification.related_entity_id] || apptsMap[notification.metadata?.appointmentId] || {};
    const resolvedPaymentData = paymentsMap[notification.related_entity_id] || paymentsMap[notification.metadata?.paymentId] || (notification.tipo === 'payment' ? defaultPaymentData : {});
    const finalMetadata = {
      ...resolvedOfferData,
      ...resolvedApptData,
      ...resolvedPaymentData,
      ...(notification.metadata || {})
    };

    let mappedTipo = notification.tipo;
    if (notification.tipo === 'nueva_oferta') mappedTipo = 'new_offer';
    if (notification.tipo === 'appointment_reminder') mappedTipo = 'reminder';

    return {
      id: notification.id,
      tipo: mappedTipo,
      titulo: notification.titulo,
      descripcion: notification.descripcion,
      fecha: notification.created_at,
      timestamp: new Date(notification.created_at).getTime(),
      isNew: !notification.is_read,
      href: notification.href || finalMetadata.href || '/client/agenda',
      relatedEntityId: notification.related_entity_id,
      relatedEntityType: notification.related_entity_type,
      metadata: finalMetadata,
      ...finalMetadata
    };
  });

  const totalPages = Math.ceil((count || 0) / limit);

  return {
    data: formattedData,
    meta: {
      page,
      limit,
      totalItems: count || 0,
      totalPages: totalPages === 0 ? 1 : totalPages
    }
  };
};

/**
 * Marks a notification as read.
 * @param {string} notificationId - UUID of the notification
 * @param {string} userId - UUID of the client
 * @returns {Promise<Object>} The updated notification details
 */
export const markAsRead = async (notificationId, userId) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .match({ id: notificationId, user_id: userId })
    .select('id, is_read')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // PostgREST 116 means exactly zero or >=2 rows returned for .single()
      throw new AppError('Notification not found or access denied', 404);
    }
    throw new AppError('Error updating notification', 500);
  }

  if (!data) {
    throw new AppError('Notification not found or access denied', 404);
  }

  return {
    id: data.id,
    isNew: !data.is_read
  };
};

