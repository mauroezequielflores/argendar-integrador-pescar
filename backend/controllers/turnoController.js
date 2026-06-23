import { getTurnosProcesados } from '../services/turnoService.js';

/**
 * Obtener los turnos de un usuario
 */
export const obtenerTurnosUsuario = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const turnos = await getTurnosProcesados(usuarioId);

    return res.status(200).json({
      status: "success",
      results: turnos.length,
      data: {
        turnos
      }
    });
  } catch (error) {
    console.error(`Error en obtenerTurnosUsuario para el usuario ${usuarioId}:`, error);
    
    return res.status(500).json({
      status: "error",
      message: "Ocurrió un error interno al procesar la solicitud de turnos.",
      details: error.message || error
    });
  }
};
