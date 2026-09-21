import { supabase } from '../config/supabase.js';

/**
 * Creates a notification in the database.
 * This function should not throw errors that break the main application flow.
 * 
 * @param {Object} params
 * @param {string} params.userId - The ID of the user receiving the notification
 * @param {string} params.type - The type of notification (new_offer, payment, cancellation, rating, reminder)
 * @param {string} params.title - Notification title
 * @param {string} params.description - Notification description
 * @param {string} params.href - Route to navigate to when clicked (default: /client/agenda)
 * @param {string} params.relatedEntityId - ID of the related entity (e.g. offer_id, appointment_id)
 * @param {string} params.relatedEntityType - Type of the related entity (e.g. offer, appointment)
 * @param {Object} params.metadata - Additional JSON metadata required by the UI for rendering
 */
export const createNotification = async ({
  userId,
  type,
  title,
  description,
  href = '/client/agenda',
  relatedEntityId = null,
  relatedEntityType = null,
  metadata = {}
}) => {
  try {
    const notificationPayload = {
      user_id: userId,
      type,
      title,
      description,
      href,
      related_entity_id: relatedEntityId,
      related_entity_type: relatedEntityType,
      metadata,
      is_read: false
    };

    const { error } = await supabase
      .from('notifications')
      .insert(notificationPayload);

    if (error) {
      console.error(`Error creating notification of type ${type} for user ${userId}:`, error);
    }
  } catch (err) {
    console.error(`Unexpected error creating notification of type ${type} for user ${userId}:`, err);
  }
};
