import { api } from "../../../libs/axios";
import { PANEL_ENTITIES } from "../constants/moderation.constants";

/**
 * moderationService — Servicio de moderación (rol administrador).
 * Endpoints: /api/v1/admin/moderation/{requests|offers|reviews|appointments}
 */
export const moderationService = {
  /**
   * Lista paginada de un panel.
   * @param {"solicitudes"|"ofertas"|"calificaciones"|"turnos"} panel
   * @param {object} [params]
   * @param {string} [params.search] - Número de orden (125, ORD-00125) o UUID completo.
   * @param {number} [params.page=1]
   * @param {number} [params.limit=10]
   */
  async list(panel, { search, page = 1, limit = 10 } = {}) {
    const { data } = await api.get(`/admin/moderation/${PANEL_ENTITIES[panel]}`, {
      params: { search: search?.trim() || undefined, page, limit },
    });
    return data;
  },

  /**
   * Cambia el estado de moderación de un ítem.
   * @param {"active"|"disabled"|"deleted"} moderationStatus
   */
  async updateStatus(panel, id, moderationStatus) {
    const { data } = await api.patch(`/admin/moderation/${PANEL_ENTITIES[panel]}/${id}`, {
      moderationStatus,
    });
    return data;
  },
};
