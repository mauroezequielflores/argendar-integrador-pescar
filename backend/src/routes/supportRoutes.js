import { Router } from 'express';
import { createTicket } from '../controllers/supportController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createTicketSchema } from '../middlewares/schemas/supportSchemas.js';
import { AppError } from '../utils/errors.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

// Cualquier cliente o profesional autenticado puede enviar una consulta desde "Ayuda".
const requireClientOrProfessional = (req, res, next) => {
  if (![ROLES.CLIENT, ROLES.PROFESSIONAL].includes(req.user?.role)) {
    return next(new AppError('Acceso no autorizado', 403));
  }
  next();
};

router.use(authMiddleware);
router.use(requireClientOrProfessional);

router.post('/tickets', validateRequest(createTicketSchema), createTicket);

export default router;
