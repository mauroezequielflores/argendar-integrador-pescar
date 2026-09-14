import * as clientService from '../services/clientService.js';

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
