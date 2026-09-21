import * as clientService from '../services/clientService.js';
import * as professionalService from '../services/professionalService.js';

export const getProfessionalPublicProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await professionalService.getProfessionalProfile(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const data = await clientService.getClientProfile(req.user.id, req.user.email);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const data = await clientService.updateClientProfile(req.user.id, req.body);
    res.status(200).json({ message: "Perfil actualizado exitosamente", data });
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    const data = await clientService.getClientSettings(req.user.id, req.user.email);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const data = await clientService.updateClientSettings(req.user.id, req.body);
    res.status(200).json({ message: "Configuración actualizada exitosamente", data });
  } catch (error) {
    next(error);
  }
};
