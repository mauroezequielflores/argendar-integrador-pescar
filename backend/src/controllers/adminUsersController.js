import * as adminUsersService from '../services/adminUsersService.js';

export const listUsers = async (req, res, next) => {
  try {
    const { role, search, page, limit } = req.query;
    const data = await adminUsersService.listUsers({
      role,
      search,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const data = await adminUsersService.updateUserStatus(req.params.id, req.body.status, req.user.id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const data = await adminUsersService.deleteUser(req.params.id, req.user.id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
