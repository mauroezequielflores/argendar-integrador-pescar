import OffersService from '../services/OffersService.js';

class OffersController {
  async create(req, res, next) {
    try {
      const professionalId = req.user.id;
      const data = req.body;

      const offerId = await OffersService.createOffer(professionalId, data);

      return res.status(201).json({
        success: true,
        message: 'Oferta enviada al cliente exitosamente',
        data: { offer_id: offerId }
      });
    } catch (error) {
      next(error);
    }
  }

  async accept(req, res, next) {
    try {
      const clientId = req.user.id;
      const { id: offerId } = req.params;

      const appointmentId = await OffersService.acceptOffer(clientId, offerId);

      return res.status(200).json({
        success: true,
        message: 'Oferta aceptada, turno y pago creados',
        data: { appointment_id: appointmentId }
      });
    } catch (error) {
      next(error);
    }
  }

  async getPendingProfessionalOffers(req, res, next) {
    try {
      const professionalId = req.user.id;
      const offers = await OffersService.getPendingProfessionalOffers(professionalId);
      
      return res.status(200).json({
        success: true,
        data: offers
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new OffersController();
