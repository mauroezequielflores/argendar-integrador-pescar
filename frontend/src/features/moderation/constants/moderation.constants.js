/**
 * moderation.constants.js — Constantes de la feature de Moderación.
 */

/** Estados de moderación tal como se muestran en las tarjetas. */
export const MODERATION_STATES = {
  ACTIVE: "Activo",
  DISABLED: "Desactivado",
  DELETED: "Eliminado",
};

/** Pestaña de la pantalla → entidad que entiende el backend. */
export const PANEL_ENTITIES = {
  solicitudes: "requests",
  ofertas: "offers",
  calificaciones: "reviews",
  turnos: "appointments",
};

/** Estado del backend → estado mostrado, y viceversa. */
export const STATUS_TO_STATE = {
  active: MODERATION_STATES.ACTIVE,
  disabled: MODERATION_STATES.DISABLED,
  deleted: MODERATION_STATES.DELETED,
};
