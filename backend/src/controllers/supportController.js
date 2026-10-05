import * as supportService from '../services/supportService.js';

export const createTicket = async (req, res, next) => {
  try {
    const data = await supportService.createTicket(req.user.id, req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};
