import * as adminTransactionsService from '../services/adminTransactionsService.js';

export const listTransactions = async (req, res, next) => {
  try {
    const { search, page, limit } = req.query;
    const data = await adminTransactionsService.listTransactions({
      search,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
