import { mockDashboardMetrics, mockRecentActivity } from "../data/mockDashboardData";

/**
 * Servicio para obtener datos del Dashboard de Administrador.
 * Preparado para futura conexión con API backend / endpoints REST.
 */
export const dashboardService = {
  /**
   * Obtiene las métricas globales del dashboard.
   */
  async getMetrics() {
    // Simula retardo de red
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { ...mockDashboardMetrics };
  },

  /**
   * Obtiene la lista de actividades recientes.
   */
  async getRecentActivity() {
    // Simula retardo de red
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Por defecto retornamos un array vacío o los mocks según estado inicial
    return [...mockRecentActivity];
  },
};
