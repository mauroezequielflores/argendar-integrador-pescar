import express from 'express';
import * as professionalNotificationController from '../controllers/professionalNotificationController.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Apply role middleware to all routes in this router
router.use(requireRole('professional'));

router.get('/', professionalNotificationController.getNotifications);
router.get('/preview', professionalNotificationController.getPreview);
router.get('/:id', professionalNotificationController.getNotificationDetail);
router.patch('/:id/read', professionalNotificationController.markAsRead);

export default router;
