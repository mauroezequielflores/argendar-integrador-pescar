import { api } from "../../../libs/axios";

/**
 * reportsService.js — Capa de servicios de la Bandeja de consultas (rol administrador).
 * Endpoints: /api/v1/admin/inquiries
 */

/**
 * Lista paginada de consultas.
 * @param {object} [params]
 * @param {string} [params.search] - Número de consulta (101, CON-000101), UUID completo o texto del asunto.
 * @param {"open"|"answered"} [params.status]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=10]
 */
export async function fetchInquiries({ search, status, page = 1, limit = 10 } = {}) {
  const { data } = await api.get("/admin/inquiries", {
    params: { search: search?.trim() || undefined, status, page, limit },
  });
  return data;
}

/**
 * Detalle de una consulta (incluye el email del usuario y la respuesta, si existe).
 */
export async function fetchInquiry(inquiryId) {
  const { data } = await api.get(`/admin/inquiries/${inquiryId}`);
  return data;
}

/**
 * Responde una consulta. Pasa a "answered" y se avisa al usuario dentro de la app.
 * @param {string} inquiryId
 * @param {{subject: string, message: string}} reply
 */
export async function replyInquiry(inquiryId, { subject, message }) {
  const { data } = await api.post(`/admin/inquiries/${inquiryId}/reply`, { subject, message });
  return data;
}
