import { Router } from 'express';
import MarketplaceController from '../controllers/MarketplaceController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { getMarketplaceRequestsSchema } from '../middlewares/schemas/marketplaceSchemas.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

// Endpoints para el profesional en el marketplace
router.get(
  '/requests',
  authMiddleware,
  requireRole(ROLES.PROFESSIONAL),
  validateRequest(getMarketplaceRequestsSchema),
  MarketplaceController.getRequests
);

router.get(
  '/requests/:id',
  authMiddleware,
  requireRole(ROLES.PROFESSIONAL),
  // Asumimos que id es uuid, puede validarse en ruta o controller
  MarketplaceController.getRequestById
);

export default router;
