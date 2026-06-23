import { getTurnosByUsuario } from '../models/turnoModel.js';
import { ESTADOS_TURNO, ESTADOS_TURNO_LABELS } from '../constants/turnos.js';
import { formatSupabaseDate } from '../utils/dateFormatter.js';

/**
 * Obtiene y procesa los turnos de un usuario específico.
 * @param {string} usuarioId - UUID del usuario
 * @returns {Promise<Array>} Lista de turnos mapeados y formateados
 */
export async function getTurnosProcesados(usuarioId) {
  const turnos = await getTurnosByUsuario(usuarioId);

  // Mapeamos, formateamos fechas y agregamos la etiqueta legible del estado
  return turnos.map(turno => {
    // Validamos el estado contra nuestro enum de constantes o lo dejamos en PENDIENTE por defecto
    const estadoNormalizado = ESTADOS_TURNO[turno.estado] || ESTADOS_TURNO.PENDIENTE;
    
    return {
      id: turno.id,
      usuarioId: turno.usuario_id,
      servicio: turno.servicio,
      fechaOriginal: turno.fecha,
      fechaFormateada: formatSupabaseDate(turno.fecha),
      estado: estadoNormalizado,
      estadoLabel: ESTADOS_TURNO_LABELS[estadoNormalizado],
      creadoEl: formatSupabaseDate(turno.created_at)
    };
  });
}
