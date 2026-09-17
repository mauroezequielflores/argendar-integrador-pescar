import { Router } from 'express';
import JobRequestsController from '../controllers/JobRequestsController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createJobRequestSchema } from '../middlewares/schemas/marketplaceSchemas.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

// Endpoint para que el cliente cree una solicitud de trabajo
router.post(
  '/',
  authMiddleware,
  requireRole(ROLES.CLIENT),
  validateRequest(createJobRequestSchema),
  JobRequestsController.create
);

// Endpoint para que el cliente obtenga sus propias solicitudes
router.get(
  '/',
  authMiddleware,
  requireRole(ROLES.CLIENT),
  JobRequestsController.getClientRequests
);

export default router;
