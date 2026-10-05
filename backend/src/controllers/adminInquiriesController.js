import * as adminInquiriesService from '../services/adminInquiriesService.js';

export const listInquiries = async (req, res, next) => {
  try {
    const { search, status, page, limit } = req.query;
    const data = await adminInquiriesService.listInquiries({
      search,
      status,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getInquiry = async (req, res, next) => {
  try {
    const data = await adminInquiriesService.getInquiry(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const replyInquiry = async (req, res, next) => {
  try {
    const data = await adminInquiriesService.replyInquiry(req.params.id, req.body, req.user.id);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};
