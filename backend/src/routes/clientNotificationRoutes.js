import { Router } from 'express';
import { listNotifications, readNotification } from '../controllers/clientNotificationController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { getNotificationsSchema, readNotificationSchema } from '../middlewares/schemas/notificationSchemas.js';

const router = Router();

// Apply auth and role middlewares to all routes in this router
router.use(authMiddleware);
router.use(requireRole('client'));

// GET /api/v1/client/notifications
router.get('/', validateRequest(getNotificationsSchema), listNotifications);

// PATCH /api/v1/client/notifications/:id/read
router.patch('/:id/read', validateRequest(readNotificationSchema), readNotification);

export default router;
