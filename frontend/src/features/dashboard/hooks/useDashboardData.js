import { useState, useEffect, useCallback } from "react";
import { dashboardService } from "../services/dashboardService";
import {
  mapMetrics,
  mapChartPoints,
  mapActivity,
  getDashboardErrorMessage,
} from "../utils/dashboardMappers";

const CHART_DAYS = 30;

/**
 * useDashboardData — Carga métricas, gráfico y actividad reciente desde el backend.
 * Maneja estados de carga (isLoading), error (error), datos y reintento (refetch).
 *
 * @param {object} [options]
 * @param {number} [options.activityLimit=10] - Cantidad de eventos de actividad reciente a pedir.
 */
export function useDashboardData(options = {}) {
  const { activityLimit = 10 } = options;
  const [metrics, setMetrics] = useState(() => mapMetrics());
  const [marketplaceData, setMarketplaceData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [metricsData, chartData, activityData] = await Promise.all([
        dashboardService.getMetrics(),
        dashboardService.getActivityChart(CHART_DAYS),
        dashboardService.getRecentActivity(activityLimit),
      ]);
      setMetrics(mapMetrics(metricsData));
      setMarketplaceData(mapChartPoints(chartData));
      setActivities(activityData.map(mapActivity));
    } catch (err) {
      setError(getDashboardErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [activityLimit]);

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
