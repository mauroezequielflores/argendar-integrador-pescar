import { USER_STATES } from "../constants/users.constants";

/** Pestaña de la pantalla → rol que entiende el backend. */
export const TAB_ROLES = {
  profesionales: "professional",
  clientes: "client",
  administradores: "administrator",
};

const STATUS_LABELS = {
  active: USER_STATES.ACTIVO,
  disabled: USER_STATES.SUSPENDIDO,
  deleted: USER_STATES.ELIMINADO,
};

const ROLE_LABELS = {
  client: "Cliente",
  professional: "Profesional",
  administrator: "Administrador",
};

const TIMEZONE = "America/Argentina/Buenos_Aires";
const SHORT_ID_LENGTH = 8;

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  timeZone: TIMEZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("es-AR", {
  timeZone: TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** Usuario de la API → fila de la tabla. */
export function mapUser(user) {
  const createdAt = new Date(user.createdAt);
  return {
    id: user.id,
    displayId: user.id.slice(0, SHORT_ID_LENGTH).toUpperCase(),
    nombre: user.name,
    rol: ROLE_LABELS[user.role] ?? user.role,
    fecha: dateFormatter.format(createdAt),
    hora: timeFormatter.format(createdAt),
    estado: STATUS_LABELS[user.status] ?? USER_STATES.ACTIVO,
  };
}

/** Mensaje legible según el error devuelto por la API. */
export function getUsersErrorMessage(error, fallback) {
  const status = error?.response?.status;
  if (status === 403) return "No tenés permisos de administrador para realizar esta acción.";
  if (status === 401) return "Tu sesión expiró. Volvé a iniciar sesión.";
  return error?.response?.data?.error?.message || fallback;
}
