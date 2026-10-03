import { getNotifications, markAsRead } from '../services/clientNotificationService.js';
import { processUpcomingReminders } from '../services/appointmentReminderService.js';
import { AppError } from '../utils/errors.js';

/**
 * Controller to list notifications for the authenticated client.
 */
export const listNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Zod already parses these, but they are guaranteed to exist with fallbacks
    const { page, limit } = req.query;

    const result = await getNotifications(userId, page, limit);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to mark a notification as read.
 */
export const readNotification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const data = await markAsRead(notificationId, userId);

    return res.status(200).json({
      message: 'Notificación marcada como leída exitosamente',
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to trigger reminder check for the authenticated client.
 */
export const triggerReminderCheck = async (req, res, next) => {
  try {
    const clientId = req.user.id;
    const result = await processUpcomingReminders({ targetClientId: clientId });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


