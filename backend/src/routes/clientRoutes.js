import { Router } from 'express';
import { getProfile, updateProfile, getSettings, updateSettings } from '../controllers/clientController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { updateClientProfileSchema, updateClientSettingsSchema } from '../middlewares/schemas/profileSchemas.js';

const router = Router();

router.use(authMiddleware);
router.use(requireRole('client'));

router.get('/profile', getProfile);
router.patch('/profile', validateRequest(updateClientProfileSchema), updateProfile);

router.get('/profile/settings', getSettings);
router.patch('/profile/settings', validateRequest(updateClientSettingsSchema), updateSettings);

export default router;
