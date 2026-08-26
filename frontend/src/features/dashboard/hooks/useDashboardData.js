import { useState, useEffect, useCallback } from "react";
import { dashboardService } from "../services/dashboardService";

/**
 * useDashboardData — Hook personalizado para gestionar el estado de métricas y actividad reciente.
 * Maneja estados de carga (isLoading), error (error), datos y reintento (refetch).
 *
 * @param {object} [options]
 * @param {boolean} [options.initialEmpty=true] - Si es true, inicia con actividades vacías para coincidir con la captura.
 */
export function useDashboardData(options = {}) {
  const { initialEmpty = true } = options;
  const [metrics, setMetrics] = useState({
    usuarios: 0,
    solicitudesActivas: 0,
    ofertasRealizadas: 0,
    transacciones: 0,
  });
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedMetrics, fetchedActivities] = await Promise.all([
        dashboardService.getMetrics(),
        dashboardService.getRecentActivity(),
      ]);
      setMetrics(fetchedMetrics);
      // Si initialEmpty es true, mantenemos la lista vacía para reflejar fielmente la captura inicial
      setActivities(initialEmpty ? [] : fetchedActivities);
    } catch (err) {
      setError(err?.message || "No se pudieron cargar los datos del dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, [initialEmpty]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleActivitiesMock = () => {
    setActivities((prev) => (prev.length === 0 ? [...prev, ...mockRecentActivityData] : []));
  };

  return {
    metrics,
    activities,
    setActivities,
    isLoading,
    error,
    refetch: fetchData,
  };
}

// Datos de respaldo para alternar vista en demos
import { mockRecentActivity as mockRecentActivityData } from "../data/mockDashboardData";
