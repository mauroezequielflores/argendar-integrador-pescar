import { api } from "../../../libs/axios";

/**
 * usersService.js — Capa de servicios para gestión de usuarios (rol administrador).
 * Endpoints: /api/v1/admin/users
 */

/**
 * Lista paginada de usuarios de un rol.
 * @param {object} params
 * @param {"client"|"professional"|"administrator"} params.role
 * @param {string} [params.search] - Nombre/apellido o UUID completo.
 * @param {number} [params.page=1]
 * @param {number} [params.limit=10]
 * @returns {Promise<{items: Array, meta: {totalCount: number, page: number, limit: number, hasMore: boolean}}>}
 */
export async function fetchUsers({ role, search, page = 1, limit = 10 }) {
  const { data } = await api.get("/admin/users", {
    params: { role, search: search?.trim() || undefined, page, limit },
  });
  return data;
}

/**
 * Bloquea (disabled) o desbloquea (active) un usuario.
 */
export async function updateUserStatus(userId, status) {
  const { data } = await api.patch(`/admin/users/${userId}/status`, { status });
  return data;
}

/**
 * Elimina un usuario (borrado lógico en el backend).
 */
export async function deleteUser(userId) {
  const { data } = await api.delete(`/admin/users/${userId}`);
  return data;
}
