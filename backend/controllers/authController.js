// Maneja las respuestas HTTP
import {
  guardarRegistroLogin,
  obtenerHistorialUsuario,
} from "../services/authService.js";

/**
 * Controlador para simular/procesar Login y guardar la auditoría
 */
export const loginUsuario = async (req, res) => {
  const { usuarioId, email } = req.body;

  try {
    if (!usuarioId) {
      return res
        .status(400)
        .json({ status: "fail", message: "El usuarioId es requerido" });
    }

    // Guardar el registro de auditoría/historial de inicio de sesión
    await guardarRegistroLogin(usuarioId, req);

    return res.status(200).json({
      status: "success",
      message: "Inicio de sesión exitoso y registrado en auditoría",
      data: { usuarioId, email },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al procesar el inicio de sesión",
      details: error.message,
    });
  }
};

/**
 * Obtener historial de accesos
 */
export const obtenerHistorial = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const historial = await obtenerHistorialUsuario(usuarioId);
    return res.status(200).json({
      status: "success",
      results: historial.length,
      data: { historial },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener historial",
      details: error.message,
    });
  }
};
