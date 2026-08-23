import { Router } from 'express';
import { registrar, iniciarSesion, obtenerUsuarioActual, solicitarRecuperacion, restablecerPassword } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validarRegistro, validarLogin, validarForgotPassword, validarResetPassword } from '../validations/auth.validation.js';

const router = Router();

// Endpoint: POST /api/v1/auth/register
router.post('/register', validarRegistro, registrar);

// Endpoint: POST /api/v1/auth/login
router.post('/login', validarLogin, iniciarSesion);

// Endpoint: GET /api/v1/auth/me
router.get('/me', authMiddleware, obtenerUsuarioActual);

// Endpoint: POST /api/v1/auth/forgot-password
// Solicita el envío de un enlace de recuperación al email indicado.
// No requiere autenticación (el usuario no puede loguearse).
router.post('/forgot-password', validarForgotPassword, solicitarRecuperacion);

// Endpoint: POST /api/v1/auth/reset-password
// Restablece la contraseña usando el token recibido por email.
// No requiere autenticación (el token del email actúa como verificación).
router.post('/reset-password', validarResetPassword, restablecerPassword);

export default router;
