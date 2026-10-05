import { api } from "../../../libs/axios";

/**
 * transactionsService.js — Capa de servicios de transacciones (rol administrador).
 * Endpoint: /api/v1/admin/transactions (solo lectura).
 */

/**
 * Lista paginada de transacciones.
 * @param {object} [params]
 * @param {string} [params.search] - Número de transacción (126, TRX-000126) o UUID completo.
 * @param {number} [params.page=1]
 * @param {number} [params.limit=10]
 * @returns {Promise<{items: Array, meta: {totalCount: number, page: number, limit: number, hasMore: boolean}}>}
 */
export async function fetchTransactions({ search, page = 1, limit = 10 } = {}) {
  const { data } = await api.get("/admin/transactions", {
    params: { search: search?.trim() || undefined, page, limit },
  });
  return data;
}
