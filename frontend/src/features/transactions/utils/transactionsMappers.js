const TIMEZONE = "America/Argentina/Buenos_Aires";

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  timeZone: TIMEZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const METHOD_LABELS = {
  cash: "Efectivo",
  mercadopago: "MercadoPago",
  transfer: "Transferencia",
  credit_card: "Tarjeta de crédito",
};

const STATUS_LABELS = {
  paid: { estado: "COMPLETADO", estadoVariant: "success" },
  pending: { estado: "PENDIENTE", estadoVariant: "warning" },
  partial: { estado: "PARCIAL", estadoVariant: "warning" },
  refunded: { estado: "REEMBOLSADO", estadoVariant: "default" },
};

const ROLE_LABELS = {
  client: "Cliente",
  professional: "Profesional",
};

/** Transacción de la API → fila de la tabla. */
export function mapTransaction(transaction) {
  const state = STATUS_LABELS[transaction.status] ?? STATUS_LABELS.pending;
  return {
    id: transaction.id,
    numero: transaction.transactionNumber,
    usuario: transaction.user?.name ?? "—",
    rol: ROLE_LABELS[transaction.user?.role] ?? "—",
    monto: transaction.amount,
    metodo: METHOD_LABELS[transaction.method] ?? transaction.method,
    fecha: dateFormatter.format(new Date(transaction.createdAt)),
    ...state,
  };
}

/** Mensaje legible según el error devuelto por la API. */
export function getTransactionsErrorMessage(error) {
  const status = error?.response?.status;
  if (status === 403) return "No tenés permisos de administrador para ver las transacciones.";
  if (status === 401) return "Tu sesión expiró. Volvé a iniciar sesión.";
  return (
    error?.response?.data?.error?.message ||
    "No se pudieron cargar las transacciones."
  );
}
