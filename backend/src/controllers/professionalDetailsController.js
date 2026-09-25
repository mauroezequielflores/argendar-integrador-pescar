import * as professionalDetailsService from '../services/professionalDetailsService.js';

// ─── GET /professional/offers/:id ─────────────────────────────────────────────
export const getOfferDetail = async (req, res, next) => {
  try {
    const professionalId = req.user.id;
    const { id } = req.params;
    const data = await professionalDetailsService.getOfferById(professionalId, id);
    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

// ─── GET /professional/reminders/:id ──────────────────────────────────────────
// Usa appointments: un recordatorio es un turno con status confirmado/programado.
export const getReminderDetail = async (req, res, next) => {
  try {
    const professionalId = req.user.id;
    const { id } = req.params;
    const data = await professionalDetailsService.getAppointmentById(professionalId, id);
    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

// ─── GET /professional/cancellations/:id ──────────────────────────────────────
// Usa appointments: una cancelación es un turno con status cancelled.
export const getCancellationDetail = async (req, res, next) => {
  try {
    const professionalId = req.user.id;
    const { id } = req.params;
    const data = await professionalDetailsService.getAppointmentById(professionalId, id);
    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

// ─── GET /professional/payments/:id ───────────────────────────────────────────
export const getPaymentDetail = async (req, res, next) => {
  try {
    const professionalId = req.user.id;
    const { id } = req.params;
    const data = await professionalDetailsService.getPaymentById(professionalId, id);
    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

// ─── GET /professional/reviews/:id ────────────────────────────────────────────
export const getReviewDetail = async (req, res, next) => {
  try {
    const professionalId = req.user.id;
    const { id } = req.params;
    const data = await professionalDetailsService.getReviewById(professionalId, id);
    return res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};
