import { getAllUserProfiles } from '../models/userModel.js';

/**
 * Servicio para listar todos los usuarios
 * @returns {Promise<Array>} Lista de usuarios
 */
export async function listarUsuarios() {
  return await getAllUserProfiles();
}
