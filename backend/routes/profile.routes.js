import { Router } from 'express';
import {
  actualizarPerfilBasico,
  actualizarPerfilProfesional,
  obtenerRubros,
  asignarRubrosProfesional,
  obtenerZonas,
  asignarZonasProfesional,
  obtenerPerfilPublico
} from '../controllers/profile.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import {
  validarPerfilBasico,
  validarPerfilProfesional,
  validarRubros,
  validarZonas
} from '../validations/profile.validation.js';

// Router para /api/v1/profile
export const profileRouter = Router();
profileRouter.put('/', authMiddleware, validarPerfilBasico, actualizarPerfilBasico);

// Router para /api/v1/professional-profile
export const professionalProfileRouter = Router();
professionalProfileRouter.put('/', authMiddleware, requireRole('professional'), validarPerfilProfesional, actualizarPerfilProfesional);
professionalProfileRouter.put('/rubros', authMiddleware, requireRole('professional'), validarRubros, asignarRubrosProfesional);
professionalProfileRouter.put('/zones', authMiddleware, requireRole('professional'), validarZonas, asignarZonasProfesional);

// Router para /api/v1/rubros
export const rubrosRouter = Router();
rubrosRouter.get('/', obtenerRubros);

// Router para /api/v1/zones
export const zonesRouter = Router();
zonesRouter.get('/', obtenerZonas);

// Router para /api/v1/professionals
export const professionalsRouter = Router();
professionalsRouter.get('/:id', authMiddleware, obtenerPerfilPublico);

// Router unificado para compatibilidad en español /api/v1/perfil-profesional
export const perfilProfesionalRouter = Router();
perfilProfesionalRouter.put('/', authMiddleware, requireRole('professional'), validarPerfilProfesional, actualizarPerfilProfesional);
perfilProfesionalRouter.put('/paso1', authMiddleware, requireRole('professional'), validarPerfilProfesional, actualizarPerfilProfesional);
perfilProfesionalRouter.put('/paso2', authMiddleware, requireRole('professional'), validarRubros, asignarRubrosProfesional);
perfilProfesionalRouter.put('/rubros', authMiddleware, requireRole('professional'), validarRubros, asignarRubrosProfesional);
perfilProfesionalRouter.put('/zonas', authMiddleware, requireRole('professional'), validarZonas, asignarZonasProfesional);
perfilProfesionalRouter.put('/zones', authMiddleware, requireRole('professional'), validarZonas, asignarZonasProfesional);
perfilProfesionalRouter.get('/:id', authMiddleware, obtenerPerfilPublico);

export default profileRouter;
