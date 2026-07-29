import { Router } from 'express';
import { registrar, iniciarSesion, obtenerUsuarioActual } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authRateLimiter } from '../middlewares/rateLimiter.js';
import { validarRegistro, validarLogin } from '../validations/auth.validation.js';

const router = Router();

// Endpoint: POST /api/v1/auth/register
router.post('/register', authRateLimiter, validarRegistro, registrar);

// Endpoint: POST /api/v1/auth/login
router.post('/login', authRateLimiter, validarLogin, iniciarSesion);

// Endpoint: GET /api/v1/auth/me
router.get('/me', authMiddleware, obtenerUsuarioActual);

export default router;
