import AppointmentsService from '../services/AppointmentsService.js';

class AppointmentsController {
  async list(req, res, next) {
    try {
      const clientId = req.user.id;
      const filters = req.query;

      const result = await AppointmentsService.listAppointments(clientId, filters);

      return res.status(200).json({
        appointments: result.data,
        total: result.total,
        page: result.page,
        limit: result.limit
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const clientId = req.user.id;
      const { id } = req.params;

      const result = await AppointmentsService.getAppointmentById(clientId, id);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async cancel(req, res, next) {
    try {
      const clientId = req.user.id;
      const { id } = req.params;
      const { motivo } = req.body;

      await AppointmentsService.cancelAppointment(clientId, id, motivo);

      return res.status(200).json({
        message: 'El turno ha sido cancelado exitosamente.',
        appointmentId: id,
        nuevoEstado: 'cancelled'
      });
    } catch (error) {
      next(error);
    }
  }

  async confirmCompletion(req, res, next) {
    try {
      const clientId = req.user.id;
      const { id } = req.params;

      await AppointmentsService.confirmCompletion(clientId, id);

      return res.status(200).json({
        message: 'El trabajo ha sido finalizado correctamente.',
        appointmentId: id,
        nuevoEstado: 'completed'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AppointmentsController();
