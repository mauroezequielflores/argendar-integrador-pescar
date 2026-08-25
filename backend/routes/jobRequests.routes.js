import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { requireOnboardingComplete } from '../middlewares/onboardingMiddleware.js';

const router = Router();

/**
 * GET /api/v1/job-requests/feed
 * Protegido con:
 * 1. authMiddleware (usuario autenticado y no suspendido)
 * 2. requireRole('professional') (solo profesionales)
 * 3. requireOnboardingComplete (solo profesionales con onboarding completado)
 */
router.get(
  '/feed',
  authMiddleware,
  requireRole('professional'),
  requireOnboardingComplete,
  (req, res) => {
    return res.status(200).json({
      status: "success",
      message: "Feed de solicitudes de trabajo obtenido exitosamente.",
      data: {
        feed: [
          {
            id: "job-101",
            title: "Mantenimiento de Aire Acondicionado",
            client_name: "Juan Pérez",
            location: "Buenos Aires, CABA",
            category: "Climatización",
            created_at: new Date().toISOString()
          }
        ]
      }
    });
  }
);

export default router;
