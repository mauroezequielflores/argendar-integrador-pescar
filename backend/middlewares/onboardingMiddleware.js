import { supabaseAdmin } from '../config/supabase.js';

/**
 * Middleware que intercepta los accesos a rutas protegidas de profesionales (ej. /api/v1/job-requests/feed).
 * Verifica que onboarding_completo sea true en la tabla professional_profiles o perfil.
 * De lo contrario, bloquea el acceso con 403 Forbidden.
 */
export const requireOnboardingComplete = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const role = req.profile?.rol || req.profile?.role;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Usuario no autenticado."
      });
    }

    // Si el usuario no es un profesional, no aplica la restricción de onboarding profesional
    if (role !== 'professional') {
      return res.status(403).json({
        status: "error",
        message: "Acceso denegado: Esta sección es exclusiva para profesionales."
      });
    }

    let is_onboarding_complete = req.profile?.onboarding_completo ?? req.profile?.is_onboarding_complete;

    // Consultar el estado de onboarding en professional_profiles
    try {
      const { data: profProfile, error } = await supabaseAdmin
        .from('professional_profiles')
        .select('onboarding_completo, is_onboarding_complete')
        .eq('usuario_id', userId)
        .single();

      if (!error && profProfile) {
        is_onboarding_complete = profProfile.onboarding_completo ?? profProfile.is_onboarding_complete;
      }
    } catch (e) {
      console.warn("[requireOnboardingComplete] Error al consultar perfil profesional:", e.message);
    }

    if (is_onboarding_complete !== true) {
      return res.status(403).json({
        status: "error",
        code: "ONBOARDING_INCOMPLETE",
        message: "Debes completar el proceso de onboarding para acceder a esta funcionalidad."
      });
    }

    next();
  } catch (error) {
    console.error("[requireOnboardingComplete] Error inesperado:", error);
    return res.status(500).json({
      status: "error",
      message: "Error interno al verificar el estado de onboarding."
    });
  }
};
