import { Router } from 'express';
import { createReview } from '../controllers/clientReviewController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createReviewSchema } from '../middlewares/schemas/reviewSchemas.js';

const router = Router();

router.use(authMiddleware);
router.use(requireRole('client'));

// POST /api/v1/client/reviews
router.post('/', validateRequest(createReviewSchema), createReview);

export default router;
