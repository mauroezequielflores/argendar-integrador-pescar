import * as adminModerationService from '../services/adminModerationService.js';

export const listModeration = async (req, res, next) => {
  try {
    const { search, page, limit } = req.query;
    const data = await adminModerationService.listModeration(req.params.entity, {
      search,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateModerationStatus = async (req, res, next) => {
  try {
    const { entity, id } = req.params;
    const data = await adminModerationService.updateModerationStatus(entity, id, req.body.moderationStatus);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
