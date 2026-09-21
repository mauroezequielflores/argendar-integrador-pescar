import { api } from "../../../libs/axios";

/**
 * Servicio de Autenticación — Recuperación y Restablecimiento de Contraseña.
 *
 * Módulo preparado para comunicación real con backend a través de Axios (`api`),
 * con simulación / fallback para desarrollo local y testing visual.
 */

/**
 * Solicitar enlace o instrucciones de recuperación de contraseña.
 * @param {Object} payload
 * @param {string} payload.email - Correo del usuario
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function requestPasswordReset({ email }) {
  try {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "No se pudo procesar la solicitud. Verificá el correo ingresado.";
    throw new Error(message);
  }
}

/**
 * Reenviar correo con el enlace de recuperación.
 * @param {Object} payload
 * @param {string} payload.email - Correo del usuario
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function resendPasswordReset({ email }) {
  try {
    const response = await api.post("/auth/resend-forgot-password", { email });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Error al reenviar el enlace. Por favor, intentá nuevamente en unos minutos.";
    throw new Error(message);
  }
}

/**
 * Confirmar y establecer nueva contraseña.
 * @param {Object} payload
 * @param {string} [payload.token] - Token de recuperación recibido por email o URL
 * @param {string} payload.password - Nueva contraseña
 * @param {string} payload.confirmPassword - Confirmación de contraseña
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function resetPasswordConfirm({ token = "", password, confirmPassword }) {
  try {
    const response = await api.post("/auth/reset-password", {
      token,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "El enlace de recuperación es inválido o ha expirado.";
    throw new Error(message);
  }
}