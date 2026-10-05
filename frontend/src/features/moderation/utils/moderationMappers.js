import { STATUS_TO_STATE, MODERATION_STATES } from "../constants/moderation.constants";

const ROLE_LABELS = {
  client: "Cliente",
  professional: "Profesional",
  administrator: "Administrador",
};

/** Ítem de la API → tarjeta de moderación. */
export function mapModerationItem(item) {
  return {
    id: item.id,
    codigo: item.orderNumber,
    titulo: item.title,
    descripcion: item.description,
    usuario: item.user?.name ?? "—",
    tipoUsuario: ROLE_LABELS[item.user?.role] ?? "Usuario",
    estado: STATUS_TO_STATE[item.moderationStatus] ?? MODERATION_STATES.ACTIVE,
  };
}

/** Mensaje legible según el error devuelto por la API. */
export function getModerationErrorMessage(error, fallback) {
  const status = error?.response?.status;
  if (status === 403) return "No tenés permisos de administrador para realizar esta acción.";
  if (status === 401) return "Tu sesión expiró. Volvé a iniciar sesión.";
  return error?.response?.data?.error?.message || fallback;
}
