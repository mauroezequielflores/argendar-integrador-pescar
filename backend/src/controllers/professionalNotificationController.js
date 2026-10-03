import * as professionalNotificationService from '../services/professionalNotificationService.js';

export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { tab, type, sort } = req.query;

    const result = await professionalNotificationService.getNotifications(userId, { tab, type, sort });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPreview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await professionalNotificationService.getPreview(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getNotificationDetail = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await professionalNotificationService.getNotificationById(userId, id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await professionalNotificationService.markNotificationAsRead(userId, id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
