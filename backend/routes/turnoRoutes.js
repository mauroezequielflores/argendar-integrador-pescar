import { Router } from 'express';
import { obtenerTurnosUsuario } from '../controllers/turnoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validarUsuarioId } from '../validations/turnoValidation.js';

const router = Router();

// Endpoint: GET /api/v1/turnos/:usuarioId
// Flujo: 
// 1. authMiddleware: Valida el token de autenticación.
// 2. validarUsuarioId: Verifica que el parámetro sea un UUID válido.
// 3. obtenerTurnosUsuario: Controlador que llama al servicio y retorna el JSON.
router.get('/:usuarioId', authMiddleware, validarUsuarioId, obtenerTurnosUsuario);

export default router;
