import JobRequestsService from '../services/JobRequestsService.js';

class JobRequestsController {
  async create(req, res, next) {
    try {
      const clientId = req.user.id;
      const data = req.body;
      const newRequest = await JobRequestsService.createJobRequest(clientId, data);

      return res.status(201).json({
        id: newRequest.id
      });
    } catch (error) {
      next(error);
    }
  }

  async getClientRequests(req, res, next) {
    try {
      const clientId = req.user.id;
      const requests = await JobRequestsService.getClientRequests(clientId);
      return res.status(200).json(requests);
    } catch (error) {
      next(error);
    }
  }
}

export default new JobRequestsController();
