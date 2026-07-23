/* Endpoints protegidos por autenticación y roles */
import { Router } from 'express';
import { listarUsuarios, actualizarUsuario } from '../controllers/usuarioController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { permitRoles } from '../middlewares/roleMiddleware.js';

const router = Router();

// Rutas protegidas
// Solo Admin puede listar todos los usuarios (Dashboard Admin)
router.get('/', authMiddleware, permitRoles('admin'), listarUsuarios);

// Admin o el propio usuario pueden editar perfil
router.patch('/:id', authMiddleware, permitRoles('admin', 'profesional', 'cliente'), actualizarUsuario);

export default router;