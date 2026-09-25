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
    .select('id, type, title, description, is_read, created_at, related_entity_id, related_entity_type, href', { count: 'exact' })
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

  return {
    total: count || 0,
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
