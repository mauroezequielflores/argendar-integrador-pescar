export const dashboardKeys = {
  all: ['dashboard'],
  metrics: (period) => [...dashboardKeys.all, 'metrics', period],
  activityChart: (days) => [...dashboardKeys.all, 'activityChart', days],
  recentActivity: (limit) => [...dashboardKeys.all, 'recentActivity', limit],
};
