import { Router } from 'express';
import AppointmentsController from '../controllers/AppointmentsController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  getAgendaAppointmentsSchema,
  cancelAppointmentSchema,
  confirmAppointmentSchema,
  getAppointmentDetailSchema
} from '../middlewares/schemas/agendaSchemas.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.use(authMiddleware);
router.use(requireRole(ROLES.CLIENT));

// Obtener listado de turnos/solicitudes de la agenda
router.get(
  '/',
  validateRequest(getAgendaAppointmentsSchema),
  AppointmentsController.list
);

// Obtener el detalle individual de un turno
router.get(
  '/:id',
  validateRequest(getAppointmentDetailSchema),
  AppointmentsController.getById
);

// Cancelar un turno agendado
router.post(
  '/:id/cancel',
  validateRequest(cancelAppointmentSchema),
  AppointmentsController.cancel
);

// Confirmar finalización del servicio
router.post(
  '/:id/confirm-completion',
  validateRequest(confirmAppointmentSchema),
  AppointmentsController.confirmCompletion
);

export default router;
