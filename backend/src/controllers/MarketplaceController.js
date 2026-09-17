import MarketplaceService from '../services/MarketplaceService.js';

class MarketplaceController {
  async getRequests(req, res, next) {
    try {
      const professionalId = req.user.id;
      const filters = req.query;

      const result = await MarketplaceService.getRequests(professionalId, filters);

      return res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  async getRequestById(req, res, next) {
    try {
      const professionalId = req.user.id;
      const { id } = req.params;

      const data = await MarketplaceService.getRequestById(professionalId, id);

      return res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MarketplaceController();
