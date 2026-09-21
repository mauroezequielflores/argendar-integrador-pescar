import { Router } from 'express';
import { register, login, changePassword } from '../controllers/authController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { registerSchema, loginSchema, changePasswordSchema } from '../middlewares/schemas/authSchemas.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.patch('/change-password', authMiddleware, validateRequest(changePasswordSchema), changePassword);

export default router;
