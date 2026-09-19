/**
 * reportsService.js — Capa de servicios para la gestión de consultas de soporte.
 * En esta etapa utiliza mocks locales; preparado para futura conexión HTTP.
 */

import { mockInquiries } from "../data/mockReportsData";

/**
 * Obtiene el listado de consultas.
 */
export async function fetchInquiries() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockInquiries]);
    }, 150);
  });
}

/**
 * Envía una respuesta a una consulta.
 */
export async function replyInquiry(inquiryId, replyData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, inquiryId, replyData });
    }, 150);
  });
}
