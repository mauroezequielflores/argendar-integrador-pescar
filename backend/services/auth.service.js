import { supabase } from '../config/supabase.js';
import { getUserProfileById } from '../models/userModel.js';

/**
 * Registra un nuevo usuario en Supabase Auth y su perfil se sincroniza mediante disparador de base de datos
 * @param {string} nombre - Nombre del usuario
 * @param {string} apellido - Apellido del usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @returns {Promise<Object>} Datos del usuario creado y sesión opcional
 */
export async function registerUser({ nombre, apellido, email, password }) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          apellido
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    // Esperar a que el trigger inserte en public.usuarios y retornar el perfil
    let perfil = null;
    if (data.user) {
      try {
        perfil = await getUserProfileById(data.user.id);
      } catch (profileError) {
        console.warn("No se pudo obtener el perfil inmediatamente:", profileError.message);
      }
    }

    return {
      user: {
        id: data.user?.id,
        email: data.user?.email,
        nombre: perfil?.nombre || nombre,
        apellido: perfil?.apellido || apellido,
        created_at: data.user?.created_at
      },
      session: data.session ? {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in
      } : null
    };
  } catch (error) {
    console.error("Error en registerUser service:", error.message || error);
    throw error;
  }
}

/**
 * Autentica un usuario con email y contraseña en Supabase Auth
 * @param {string} email - Email
 * @param {string} password - Contraseña
 * @returns {Promise<Object>} Datos del usuario y sesión
 */
export async function loginUser({ email, password }) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    // Obtener el perfil público del usuario
    const perfil = await getUserProfileById(data.user.id);

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        nombre: perfil?.nombre || '',
        apellido: perfil?.apellido || '',
        created_at: data.user.created_at
      },
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in
      }
    };
  } catch (error) {
    console.error("Error en loginUser service:", error.message || error);
    throw error;
  }
}
