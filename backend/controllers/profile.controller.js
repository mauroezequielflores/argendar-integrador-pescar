import { ProfileService } from '../services/profile.service.js';

/**
 * Controlador para la gestión de Perfil de Usuario y Perfil Profesional (HU-07 a HU-10)
 */

/**
 * PUT /api/v1/profile (HU-07)
 * Actualiza el perfil básico del usuario autenticado en public.profiles
 */
export const actualizarPerfilBasico = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const resultado = await ProfileService.updateProfile(userId, req.body);

    return res.status(200).json({
      status: "success",
      message: "Perfil de usuario actualizado exitosamente.",
      data: resultado
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/professional-profile (HU-07)
 * Actualiza los datos profesionales del usuario autenticado en public.professional_profiles
 */
export const actualizarPerfilProfesional = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const resultado = await ProfileService.updateProfessionalProfile(userId, req.body);

    return res.status(200).json({
      status: "success",
      message: "Perfil profesional actualizado exitosamente.",
      data: resultado
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/rubros (HU-08)
 * Retorna todos los rubros técnicos activos en la plataforma
 */
export const obtenerRubros = async (req, res, next) => {
  try {
    const rubros = await ProfileService.getRubros();

    return res.status(200).json({
      status: "success",
      data: rubros
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/professional-profile/rubros (HU-08)
 * Asigna rubros técnicos al perfil del profesional
 */
export const asignarRubrosProfesional = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const rubroIds = req.body.rubro_ids || req.body.rubroIds;
    const resultado = await ProfileService.updateProfessionalRubros(userId, rubroIds);

    return res.status(200).json({
      status: "success",
      message: "Rubros técnicos actualizados exitosamente.",
      data: resultado
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/zones (HU-09)
 * Retorna todas las zonas/barrios habilitadas para cobertura
 */
export const obtenerZonas = async (req, res, next) => {
  try {
    const zones = await ProfileService.getZones();

    return res.status(200).json({
      status: "success",
      data: zones
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/v1/professional-profile/zones (HU-09)
 * Asigna zonas geográficas de cobertura y activa onboarding_completo = true
 */
export const asignarZonasProfesional = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const zoneIds = req.body.zone_ids || req.body.zoneIds;
    const finalizar = req.body.finalizar_onboarding !== false;

    const resultado = await ProfileService.updateProfessionalZones(userId, zoneIds, finalizar);

    return res.status(200).json({
      status: "success",
      message: "Zonas de cobertura asignadas y onboarding completado exitosamente.",
      data: {
        ...resultado,
        redirect_url: "/dashboard/feed"
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/professionals/:id (HU-10)
 * Visualización pública y segura del perfil profesional
 */
export const obtenerPerfilPublico = async (req, res, next) => {
  try {
    const professionalId = req.params.id;
    const perfilPublico = await ProfileService.getPublicProfessionalProfile(professionalId);

    return res.status(200).json({
      status: "success",
      data: perfilPublico
    });
  } catch (error) {
    next(error);
  }
};
