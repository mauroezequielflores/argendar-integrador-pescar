import * as professionalService from '../services/professionalService.js';

export const getProfile = async (req, res, next) => {
  try {
    const data = await professionalService.getProfessionalProfile(req.user.id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const data = await professionalService.updateProfessionalProfile(req.user.id, req.body);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    const data = await professionalService.getProfessionalSettings(req.user.id, req.user.email);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const data = await professionalService.updateProfessionalSettings(req.user.id, req.body);
    res.status(200).json({ message: "Configuración actualizada exitosamente", data });
  } catch (error) {
    next(error);
  }
};
