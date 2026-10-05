import * as adminDashboardService from '../services/adminDashboardService.js';

export const getMetrics = async (req, res, next) => {
  try {
    const data = await adminDashboardService.getMetrics(req.query.period);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getActivityChart = async (req, res, next) => {
  try {
    const days = req.query.days ? Number(req.query.days) : undefined;
    const data = await adminDashboardService.getActivityChart(days);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getRecentActivity = async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const data = await adminDashboardService.getRecentActivity(limit);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
