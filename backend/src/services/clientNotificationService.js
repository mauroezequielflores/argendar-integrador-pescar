import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

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
    .select('id, tipo:type, titulo:title, descripcion:description, href, is_read, created_at, metadata')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new AppError('Error retrieving notifications', 500);
  }

  // 3. Map the data to match the Frontend JSON contract
  const formattedData = data.map((notification) => ({
    id: notification.id,
    tipo: notification.tipo,
    titulo: notification.titulo,
    descripcion: notification.descripcion,
    fecha: notification.created_at, // You could format this if needed, frontend might expect ISO string
    timestamp: new Date(notification.created_at).getTime(),
    isNew: !notification.is_read,
    href: notification.href,
    metadata: notification.metadata
  }));

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
