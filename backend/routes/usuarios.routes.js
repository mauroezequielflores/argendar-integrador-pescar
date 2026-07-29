import { Router } from 'express';
import { obtenerUsuarios, obtenerMiHistorialDispositivos } from '../controllers/usuarios.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Endpoint: GET /api/v1/usuarios/me/historial-dispositivos
// Protegido con authMiddleware
router.get('/me/historial-dispositivos', authMiddleware, obtenerMiHistorialDispositivos);

// Endpoint: GET /api/v1/usuarios
// Protegido con authMiddleware
router.get('/', authMiddleware, obtenerUsuarios);

export default router;
