/**
 * Formatea una cadena de fecha ISO (ej: 2026-06-23T18:00:00Z) a formato amigable "DD/MM/YYYY HH:mm"
 * @param {string} isoString - La cadena de fecha en formato ISO
 * @returns {string} Fecha formateada o "Fecha Inválida"
 */
export function formatSupabaseDate(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return 'Fecha Inválida';
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    return 'Fecha Inválida';
  }
}
