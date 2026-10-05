import { api } from "../../../libs/axios";

/**
 * Servicio para obtener datos del Dashboard de Administrador.
 * Endpoints: /api/v1/admin/dashboard/* (requiere rol administrator).
 */
export const dashboardService = {
  /**
   * Métricas globales con tendencia.
   * @param {"7days"|"30days"|"all_time"} [period="all_time"]
   */
  async getMetrics(period = "all_time") {
    const { data } = await api.get("/admin/dashboard/metrics", { params: { period } });
    return data;
  },

  /**
   * Volumen diario de operaciones del marketplace.
   * @param {number} [days=30]
   */
  async getActivityChart(days = 30) {
    const { data } = await api.get("/admin/dashboard/activity-chart", { params: { days } });
    return data;
  },

  /**
   * Últimos eventos de la plataforma.
   * @param {number} [limit=10]
   */
  async getRecentActivity(limit = 10) {
    const { data } = await api.get("/admin/dashboard/recent-activity", { params: { limit } });
    return data;
  },
};
