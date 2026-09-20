/**
 * usersService.js — Capa de servicios para gestión de usuarios.
 * En esta etapa utiliza mocks locales; preparado para futura conexión HTTP.
 */

import {
  mockProfesionales,
  mockClientes,
  mockAdministradores,
} from "../data/mockUsersData";

/**
 * Obtiene todos los usuarios agrupados o iniciales.
 */
export async function fetchAllUsers() {
  // Simulación de latencia de red mínima
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        profesionales: [...mockProfesionales],
        clientes: [...mockClientes],
        administradores: [...mockAdministradores],
      });
    }, 150);
  });
}

/**
 * Actualiza el estado de un usuario.
 */
export async function updateUserStatus(userId, newStatus) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, userId, newStatus });
    }, 100);
  });
}

/**
 * Elimina un usuario.
 */
export async function deleteUser(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, userId });
    }, 100);
  });
}
