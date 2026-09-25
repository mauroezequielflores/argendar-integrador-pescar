import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

// Helper to resolve href if not directly stored in database
const resolveHref = (n) => {
  if (n.href) return n.href;
  if (!n.related_entity_id) return null;

  switch (n.type) {
    case 'offer_accepted':
    case 'offer_rejected':
      return `/professional/offers/${n.related_entity_id}/details`;
    case 'appointment_reminder':
      return `/professional/reminders/${n.related_entity_id}/details`;
    case 'appointment_cancelled':
      return `/professional/cancellations/${n.related_entity_id}/details`;
    case 'payment_confirmed':
      return `/professional/payments/${n.related_entity_id}/details`;
    case 'review_received':
      return `/professional/reviews/${n.related_entity_id}/details`;
    default:
      return null;
  }
};

export const getNotifications = async (userId, { tab = 'active', type = 'all', sort = 'newest' }) => {
  let query = supabase
    .from('notifications')
    .select('id, type, title, description, is_read, created_at, related_entity_id, related_entity_type, href, metadata', { count: 'exact' })
    .eq('user_id', userId);

  // Tab filter
  if (tab === 'active') {
    query = query.eq('is_read', false);
  } else if (tab === 'history') {
    query = query.eq('is_read', true);
  }

  // Type filter
  if (type !== 'all') {
    query = query.eq('type', type);
  }

  // Sort
  if (sort === 'oldest') {
    query = query.order('created_at', { ascending: true });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, count, error } = await query;

  if (error) {
    throw new AppError('Error fetching notifications', 500);
  }

  // Enriquecer recordatorios de turnos con datos reales del cliente
  const reminderApptIds = (data || [])
    .filter(n => (n.type === 'appointment_reminder' || n.title === 'Recordatorio') && n.related_entity_id)
    .map(n => n.related_entity_id);

  let remindersMap = {};
  if (reminderApptIds.length > 0) {
    const { data: appts } = await supabase
      .from('appointments')
      .select('id, scheduled_at, status, offer_id')
      .in('id', reminderApptIds);

    if (appts && appts.length > 0) {
      const offerIds = appts.map(a => a.offer_id).filter(Boolean);
      const { data: offers } = await supabase
        .from('offers')
        .select('id, request_id')
        .in('id', offerIds);

      const reqIds = (offers || []).map(o => o.request_id).filter(Boolean);
      const { data: reqs } = await supabase
        .from('requests')
        .select('id, title, client_id')
        .in('id', reqIds);

      const clientIds = (reqs || []).map(r => r.client_id).filter(Boolean);
      const { data: clients } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', clientIds);

      const offerMap = (offers || []).reduce((acc, o) => ({ ...acc, [o.id]: o }), {});
      const reqMap = (reqs || []).reduce((acc, r) => ({ ...acc, [r.id]: r }), {});
      const clientMap = (clients || []).reduce((acc, c) => ({ ...acc, [c.id]: c }), {});

      appts.forEach(appt => {
        const off = offerMap[appt.offer_id];
        const req = off ? reqMap[off.request_id] : null;
        const cli = req ? clientMap[req.client_id] : null;

        const name = cli ? `${cli.first_name || ''} ${cli.last_name || ''}`.trim() : 'Cliente';
        const parts = name.split(' ').filter(Boolean);
        const initials = parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();

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

        remindersMap[appt.id] = {
          clientName: name,
          clientInitials: initials,
          clientAvatarUrl: cli?.avatar_url || null,
          serviceName: req?.title || 'Servicio acordado',
          status: (appt.status || 'CONFIRMADO').toUpperCase(),
          date: formatDateStr(appt.scheduled_at),
          timeAgo: 'Hoy',
        };
      });
    }
  }

  return {
    total: count || 0,
    notifications: (data || []).map(n => {
      const enrichedReminder = remindersMap[n.related_entity_id] || {};
      const metadata = {
        ...enrichedReminder,
        ...(n.metadata || {})
      };

      return {
        id: n.id,
        type: n.type,
        title: n.title,
        description: n.description,
        isRead: n.is_read,
        createdAt: n.created_at,
        relatedEntityId: n.related_entity_id,
        relatedEntityType: n.related_entity_type,
        href: resolveHref(n),
        metadata,
        ...metadata
      };
    })
  };
};

export const getPreview = async (userId) => {
  // Count unread
  const { count: unreadCount, error: countError } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (countError) {
    throw new AppError('Error fetching unread count', 500);
  }

  // Get latest 4 notifications
  const { data, error } = await supabase
    .from('notifications')
    .select('id, type, title, description, is_read, created_at, related_entity_id, related_entity_type, href')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) {
    throw new AppError('Error fetching notification preview', 500);
  }

  return {
    unreadCount: unreadCount || 0,
    notifications: data.map(n => ({
      id: n.id,
      type: n.type,
      title: n.title,
      description: n.description,
      isRead: n.is_read,
      createdAt: n.created_at,
      relatedEntityId: n.related_entity_id,
      relatedEntityType: n.related_entity_type,
      href: resolveHref(n)
    }))
  };
};

export const getNotificationById = async (userId, notificationId) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('id, type, title, description, is_read, created_at, related_entity_id, related_entity_type, metadata, href')
    .eq('user_id', userId)
    .eq('id', notificationId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new AppError('Notification not found', 404);
    }
    throw new AppError('Error fetching notification details', 500);
  }

  if (!data) {
    throw new AppError('Notification not found', 404);
  }

  return {
    id: data.id,
    type: data.type,
    title: data.title,
    description: data.description,
    isRead: data.is_read,
    createdAt: data.created_at,
    relatedEntityId: data.related_entity_id,
    relatedEntityType: data.related_entity_type,
    metadata: data.metadata,
    href: resolveHref(data)
  };
};

export const markNotificationAsRead = async (userId, notificationId) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('id', notificationId)
    .select('id, is_read')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new AppError('Notification not found', 404);
    }
    throw new AppError('Error marking notification as read', 500);
  }

  if (!data) {
    throw new AppError('Notification not found', 404);
  }

  return {
    id: data.id,
    isRead: data.is_read
  };
};
