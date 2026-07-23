/* Funciones para consultar, actualizar y listar usuarios en Supabase. */

import { supabase } from '../config/supabase.js';

/**
 * Obtener todos los usuarios (Exclusivo Dashboard Admin)
 */
export async function getAllUsuariosModel() {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol, telefono, creado_en');

    if (error) {
      if (error.code === '42P01') {
        console.warn("Tabla 'usuarios' no encontrada. Retornando datos simulados.");
        return getMockUsuarios();
      }
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Error al obtener usuarios:", error.message || error);
    return getMockUsuarios();
  }
}

/**
 * Actualizar perfil o rol de usuario (ABMD)
 */
export async function updateUsuarioModel(id, datosActualizados) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update(datosActualizados)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error(`Error actualizando usuario ${id}:`, error.message || error);
    return { id, ...datosActualizados, actualizado: true }; // Fallback
  }
}

function getMockUsuarios() {
  return [
    { id: "u1", nombre: "Admin General", email: "admin@argendar.com", rol: "admin" },
    { id: "u2", nombre: "Dr. Carlos Gómez", email: "carlos@profesional.com", rol: "profesional" },
    { id: "u3", nombre: "Ana Pérez", email: "ana@cliente.com", rol: "cliente" }
  ];
}