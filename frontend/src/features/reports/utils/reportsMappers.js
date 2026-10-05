import { INQUIRY_STATES } from "../constants/reports.constants";

const TIMEZONE = "America/Argentina/Buenos_Aires";

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

const STATUS_LABELS = {
  open: INQUIRY_STATES.PENDING,
  answered: INQUIRY_STATES.ANSWERED,
};

const ROLE_LABELS = {
  client: "Cliente",
  professional: "Profesional",
  administrator: "Administrador",
};

/** Consulta de la API (listado o detalle) → objeto que usan la tabla y el modal. */
export function mapInquiry(inquiry) {
  const createdAt = new Date(inquiry.createdAt);
  const repliedAt = inquiry.reply?.repliedAt ? new Date(inquiry.reply.repliedAt) : null;

  return {
    id: inquiry.id,
    codigo: inquiry.ticketNumber,
    fecha: dateFormatter.format(createdAt),
    hora: timeFormatter.format(createdAt),
    usuario: inquiry.user?.name ?? "—",
    rol: ROLE_LABELS[inquiry.user?.role] ?? "—",
    email: inquiry.user?.email ?? null,
    asunto: inquiry.subject,
    mensaje: inquiry.message ?? null,
    estado: STATUS_LABELS[inquiry.status] ?? INQUIRY_STATES.PENDING,
    respuesta: inquiry.reply?.message ?? null,
    asuntoRespuesta: inquiry.reply?.subject ?? null,
    fechaRespuesta: repliedAt
      ? `${dateFormatter.format(repliedAt)} ${timeFormatter.format(repliedAt)}`
      : null,
  };
}

/** Mensaje legible según el error devuelto por la API. */
export function getReportsErrorMessage(error, fallback) {
  const status = error?.response?.status;
  if (status === 403) return "No tenés permisos de administrador para realizar esta acción.";
  if (status === 401) return "Tu sesión expiró. Volvé a iniciar sesión.";
  return error?.response?.data?.error?.message || fallback;
}
