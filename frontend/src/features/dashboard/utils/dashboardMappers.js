/**
 * Adaptadores entre las respuestas de /api/v1/admin/dashboard/* y lo que esperan
 * los componentes del dashboard (StatCard, LineChart, ActivityTable).
 */

const BAR_MIN_HEIGHT = 3;
const BAR_MAX_HEIGHT = 16;
const BAR_COLOR_EMPTY = "#3a3a3a";
const BAR_COLOR_BASE = "#4a4a4a";
const BAR_COLOR_CURRENT = "#F78736";

const EVENT_LABELS = {
  NUEVO_USUARIO: "Registro de usuario",
  SOLICITUD_PUBLICADA: "Nueva solicitud de servicio",
  OFERTA_ENVIADA: "Nueva oferta",
  PAGO_REGISTRADO: "Pago registrado",
};

const ROLE_LABELS = {
  client: "Cliente",
  professional: "Profesional",
  administrator: "Administrador",
};

const PAYMENT_STATES = {
  paid: { estado: "Pagado", estadoVariant: "success" },
  partial: { estado: "Parcial", estadoVariant: "warning" },
  pending: { estado: "Pendiente", estadoVariant: "warning" },
  refunded: { estado: "Reembolsado", estadoVariant: "error" },
};

const EVENT_STATES = {
  NUEVO_USUARIO: { estado: "Confirmado", estadoVariant: "success" },
  SOLICITUD_PUBLICADA: { estado: "Publicado/activo", estadoVariant: "orange" },
  OFERTA_ENVIADA: { estado: "Pendiente", estadoVariant: "warning" },
};

/** Convierte [n, n, n, n] en barras {height, color}. La última (más reciente) resalta en naranja. */
export function trendToBars(trend = []) {
  const max = Math.max(...trend, 1);
  return trend.map((value, index) => {
    const isCurrent = index === trend.length - 1;
    const height = BAR_MIN_HEIGHT + Math.round((value / max) * (BAR_MAX_HEIGHT - BAR_MIN_HEIGHT));
    let color = value > 0 ? BAR_COLOR_BASE : BAR_COLOR_EMPTY;
    if (isCurrent && value > 0) color = BAR_COLOR_CURRENT;
    return { height, color };
  });
}

const EMPTY_METRIC = { value: 0, trend: [0, 0, 0, 0] };

/** Respuesta de /metrics → props de las 4 tarjetas KPI. */
export function mapMetrics(data = {}) {
  const {
    totalUsers = EMPTY_METRIC,
    activeRequests = EMPTY_METRIC,
    totalOffers = EMPTY_METRIC,
    totalTransactions = EMPTY_METRIC,
  } = data;

  return {
    usuarios: totalUsers.value,
    usuariosTrend: trendToBars(totalUsers.trend),
    solicitudesActivas: activeRequests.value,
    solicitudesTrend: trendToBars(activeRequests.trend),
    ofertasRealizadas: totalOffers.value,
    ofertasTrend: trendToBars(totalOffers.trend),
    transacciones: totalTransactions.value,
    transaccionesTrend: trendToBars(totalTransactions.trend),
  };
}

/** Respuesta de /activity-chart → puntos {x: nº de día, y: operaciones}. */
export function mapChartPoints(data) {
  return (data?.points ?? []).map((point, index) => ({ x: index + 1, y: point.total }));
}

/** "Hace 5 min", "Hace 2 horas", "Hace 3 días" o la fecha si pasó más de un mes. */
export function timeAgo(isoDate, now = Date.now()) {
  const minutes = Math.floor((now - new Date(isoDate).getTime()) / 60000);
  if (minutes < 1) return "Hace un momento";
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `Hace ${days} ${days === 1 ? "día" : "días"}`;
  return new Date(isoDate).toLocaleDateString("es-AR");
}

/** Evento de /recent-activity → fila de ActivityTable. */
export function mapActivity(event) {
  const state =
    event.action === "PAGO_REGISTRADO"
      ? PAYMENT_STATES[event.status] ?? PAYMENT_STATES.pending
      : EVENT_STATES[event.action] ?? EVENT_STATES.OFERTA_ENVIADA;

  return {
    id: `${event.action}-${event.id}`,
    usuario: event.actor?.name ?? "Sistema",
    evento: EVENT_LABELS[event.action] ?? event.description,
    rol: ROLE_LABELS[event.actor?.role] ?? "—",
    tiempo: timeAgo(event.createdAt),
    ...state,
  };
}

/** Mensaje legible para el usuario según el error devuelto por la API. */
export function getDashboardErrorMessage(error) {
  const status = error?.response?.status;
  if (status === 403) return "No tenés permisos de administrador para ver este panel.";
  if (status === 401) return "Tu sesión expiró. Volvé a iniciar sesión.";
  return (
    error?.response?.data?.error?.message ||
    "No se pudieron cargar los datos del dashboard."
  );
}
