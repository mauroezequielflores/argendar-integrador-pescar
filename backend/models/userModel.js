import { supabase } from '../config/supabase.js';

/**
 * Obtiene el perfil de un usuario por su ID
 * @param {string} id - UUID del usuario
 * @returns {Promise<Object|null>} Perfil del usuario o null si no existe
 */
export async function getUserProfileById(id) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, apellido, email, created_at')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error en getUserProfileById para el ID ${id}:`, error.message || error);
    throw error;
  }
}

/**
 * Obtiene el perfil de un usuario por su email
 * @param {string} email - Email del usuario
 * @returns {Promise<Object|null>} Perfil del usuario o null si no existe
 */
export async function getUserProfileByEmail(email) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, apellido, email, created_at')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error en getUserProfileByEmail para el email ${email}:`, error.message || error);
    throw error;
  }
}

/**
 * Obtiene la lista de perfiles de todos los usuarios ordenados por fecha de creación descendente
 * @returns {Promise<Array>} Lista de perfiles de usuarios
 */
export async function getAllUserProfiles() {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, apellido, email, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error en getAllUserProfiles:", error.message || error);
    throw error;
  }
}

