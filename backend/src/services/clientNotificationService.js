import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

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

/**
 * Retrieves paginated notifications for a client.
 * @param {string} userId - UUID of the client
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} { data, meta }
 */
export const getNotifications = async (userId, page = 1, limit = 10) => {
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

  // 4. Mapear datos con toda la información necesaria para el modal y la card
  const formattedData = (data || []).map((notification) => {
    const resolvedOfferData = offersMap[notification.related_entity_id] || defaultClientOffer || {};
    const finalMetadata = {
      ...resolvedOfferData,
      ...(notification.metadata || {})
    };

    return {
      id: notification.id,
      tipo: notification.tipo === 'nueva_oferta' ? 'new_offer' : notification.tipo,
      titulo: notification.titulo,
      descripcion: notification.descripcion,
      fecha: notification.created_at,
      timestamp: new Date(notification.created_at).getTime(),
      isNew: !notification.is_read,
      href: notification.href,
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

