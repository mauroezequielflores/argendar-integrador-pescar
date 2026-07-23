import { Router } from 'express';
import { loginUsuario, obtenerHistorial } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Endpoint para Login y registro automático de auditoría
router.post('/login', loginUsuario);

// Endpoint para consultar el historial de inicios de sesión del usuario
router.get('/historial/:usuarioId', authMiddleware, obtenerHistorial);

export default router;