import { Router } from 'express';
import OffersController from '../controllers/OffersController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createOfferSchema, acceptOfferSchema } from '../middlewares/schemas/marketplaceSchemas.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

// Profesional crea oferta
router.post(
  '/',
  authMiddleware,
  requireRole(ROLES.PROFESSIONAL),
  validateRequest(createOfferSchema),
  OffersController.create
);

// Cliente acepta oferta
router.post(
  '/:id/accept',
  authMiddleware,
  requireRole(ROLES.CLIENT),
  validateRequest(acceptOfferSchema),
  OffersController.accept
);

export default router;
