import { listarUsuarios } from '../services/usuarios.service.js';
import { obtenerHistorialPorUsuario } from '../services/historial.service.js';

/**
 * Controlador para obtener todos los usuarios registrados
 */
export async function obtenerUsuarios(req, res, next) {
  try {
    const data = await listarUsuarios();
    
    return res.status(200).json({
      status: "success",
      data: data
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controlador para obtener el historial de dispositivos del usuario autenticado
 */
export async function obtenerMiHistorialDispositivos(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: "error",
        message: "No autorizado. Sesión inválida."
      });
    }

    const data = await obtenerHistorialPorUsuario(req.user.id);

    return res.status(200).json({
      status: "success",
      data
    });
  } catch (error) {
    next(error);
  }
}
