import express from 'express';
import * as professionalDetailsController from '../controllers/professionalDetailsController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Todos los endpoints requieren autenticación y rol professional
router.use(authMiddleware);
router.use(requireRole('professional'));

// GET /api/v1/professional/offers/:id
router.get('/offers/:id', professionalDetailsController.getOfferDetail);

// GET /api/v1/professional/reminders/:id
router.get('/reminders/:id', professionalDetailsController.getReminderDetail);

// GET /api/v1/professional/cancellations/:id
router.get('/cancellations/:id', professionalDetailsController.getCancellationDetail);

// GET /api/v1/professional/payments/:id
router.get('/payments/:id', professionalDetailsController.getPaymentDetail);

// GET /api/v1/professional/reviews/:id
router.get('/reviews/:id', professionalDetailsController.getReviewDetail);

export default router;
