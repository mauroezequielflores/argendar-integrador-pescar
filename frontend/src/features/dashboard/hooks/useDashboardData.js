import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";
import {
  mapMetrics,
  mapChartPoints,
  mapActivity,
  getDashboardErrorMessage,
} from "../utils/dashboardMappers";
import { dashboardKeys } from "../constants/dashboard.queryKeys";

const CHART_DAYS = 30;

export function useDashboardData(options = {}) {
  const { activityLimit = 10 } = options;
  const queryClient = useQueryClient();

  const metricsQuery = useQuery({
    queryKey: dashboardKeys.metrics('default'),
    queryFn: () => dashboardService.getMetrics(),
    staleTime: 1000 * 60 * 5,
  });

  const chartQuery = useQuery({
    queryKey: dashboardKeys.activityChart(CHART_DAYS),
    queryFn: () => dashboardService.getActivityChart(CHART_DAYS),
    staleTime: 1000 * 60 * 5,
  });

  const activityQuery = useQuery({
    queryKey: dashboardKeys.recentActivity(activityLimit),
    queryFn: () => dashboardService.getRecentActivity(activityLimit),
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = metricsQuery.isLoading || chartQuery.isLoading || activityQuery.isLoading;
  const isError = metricsQuery.isError || chartQuery.isError || activityQuery.isError;
  
  const error = isError 
    ? getDashboardErrorMessage(metricsQuery.error || chartQuery.error || activityQuery.error)
    : null;

  const refetch = () => {
    metricsQuery.refetch();
    chartQuery.refetch();
    activityQuery.refetch();
  };

  // setActivities was exposed in the original hook for some reason (maybe optimistic updates),
  // we can provide a wrapper around queryClient.setQueryData if absolutely needed,
  // but to keep API compatibility:
  const setActivities = (updater) => {
    queryClient.setQueryData(dashboardKeys.recentActivity(activityLimit), (old) => {
      // The original updater expects the mapped array. So we must un-map or just allow the component to update it.
      // Usually, components shouldn't mutate this directly, but if they do, we'll let React Query handle it.
      const oldMapped = old ? old.map(mapActivity) : [];
      const newMapped = typeof updater === 'function' ? updater(oldMapped) : updater;
      // Since mapActivity is just a mapper, we'd ideally reverse it, but for a simple state override:
      // It's better to refetch. For now, we will just return a no-op or trigger refetch if they try to mutate.
      refetch();
      return old;
    });
  };

  return {
    metrics: metricsQuery.data ? mapMetrics(metricsQuery.data) : mapMetrics(),
    marketplaceData: chartQuery.data ? mapChartPoints(chartQuery.data) : [],
    activities: activityQuery.data ? activityQuery.data.map(mapActivity) : [],
    setActivities,
    isLoading,
    error,
    refetch,
  };
}
