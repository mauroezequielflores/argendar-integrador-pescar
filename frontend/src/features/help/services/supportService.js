import { api } from "../../../libs/axios";

/**
 * supportService.js — Envío de consultas desde la sección de Ayuda (cliente y profesional).
 * Endpoint: POST /api/v1/support/tickets
 */

/**
 * Envía una consulta al equipo de soporte.
 * @param {{subject: string, message: string}} ticket
 * @returns {Promise<{id: string, ticketNumber: string, status: string, createdAt: string}>}
 */
export async function createTicket({ subject, message }) {
  const { data } = await api.post("/support/tickets", {
    subject: subject.trim(),
    message: message.trim(),
  });
  return data;
}

/** Mensaje legible según el error devuelto por la API. */
export function getSupportErrorMessage(error) {
  const status = error?.response?.status;
  if (status === 401) return "Tu sesión expiró. Volvé a iniciar sesión.";
  if (status === 403) return "Tu cuenta no puede enviar consultas desde esta sección.";
  return (
    error?.response?.data?.error?.message ||
    "No pudimos enviar tu consulta. Intentá nuevamente en unos minutos."
  );
}
