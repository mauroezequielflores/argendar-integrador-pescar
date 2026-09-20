import { useState, useEffect, useCallback } from "react";
import {
  mockDashboardMetrics,
  mockMarketplaceActivity,
  mockRecentActivity,
} from "../data/mockDashboardData";

/**
 * useDashboardData — Hook personalizado para gestionar el estado de métricas, gráfico y actividad reciente.
 * Maneja estados de carga (isLoading), error (error), datos y reintento (refetch).
 *
 * @param {object} [options]
 * @param {boolean} [options.initialEmpty=true] - Si es true, inicia con actividades vacías para coincidir con la captura.
 */
export function useDashboardData(options = {}) {
  const { initialEmpty = true } = options;
  const [metrics, setMetrics] = useState(mockDashboardMetrics);
  const [marketplaceData, setMarketplaceData] = useState(mockMarketplaceActivity);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulación de carga asíncrona
      await new Promise((resolve) => setTimeout(resolve, 150));
      setMetrics(mockDashboardMetrics);
      setMarketplaceData(mockMarketplaceActivity);
      setActivities(initialEmpty ? [] : mockRecentActivity);
    } catch (err) {
      setError(err?.message || "No se pudieron cargar los datos del dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, [initialEmpty]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    metrics,
    marketplaceData,
    activities,
    setActivities,
    isLoading,
    error,
    refetch: fetchData,
  };
}
