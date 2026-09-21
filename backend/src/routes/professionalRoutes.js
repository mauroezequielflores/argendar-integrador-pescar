import { Router } from 'express';
import { getProfile, updateProfile, getSettings, updateSettings } from '../controllers/professionalController.js';
import AppointmentsController from '../controllers/AppointmentsController.js';
import { getAgendaAppointmentsSchema } from '../middlewares/schemas/agendaSchemas.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { updateProfessionalProfileSchema, updateProfessionalSettingsSchema } from '../middlewares/schemas/profileSchemas.js';

const router = Router();

router.use(authMiddleware);
router.use(requireRole('professional'));

router.get('/profile', getProfile);
router.patch('/profile', validateRequest(updateProfessionalProfileSchema), updateProfile);

router.get('/profile/settings', getSettings);
router.patch('/profile/settings', validateRequest(updateProfessionalSettingsSchema), updateSettings);

router.get('/appointments', validateRequest(getAgendaAppointmentsSchema), AppointmentsController.list);

router.post(
  '/appointments/:id/confirm-completion',
  AppointmentsController.confirmCompletion
);

export default router;
