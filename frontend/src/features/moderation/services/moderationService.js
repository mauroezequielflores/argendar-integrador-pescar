import {
  mockSolicitudes,
  mockOfertas,
  mockCalificaciones,
  mockTurnos,
} from "../data/mockModerationData";

/**
 * moderationService — Servicio de moderación preparado para futura conexión al backend.
 *
 * Por ahora retorna datos mock. En producción cada función reemplaza el mock
 * por una llamada HTTP real (axios u fetch).
 */
export const moderationService = {
  async getSolicitudes() {
    await new Promise((r) => setTimeout(r, 250));
    return [...mockSolicitudes];
  },

  async getOfertas() {
    await new Promise((r) => setTimeout(r, 250));
    return [...mockOfertas];
  },

  async getCalificaciones() {
    await new Promise((r) => setTimeout(r, 250));
    return [...mockCalificaciones];
  },

  async getTurnos() {
    await new Promise((r) => setTimeout(r, 250));
    return [...mockTurnos];
  },
};
