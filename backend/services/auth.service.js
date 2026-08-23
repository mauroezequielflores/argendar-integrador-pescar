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
      throw error;
    }

    // Esperar a que el trigger inserte en public.usuarios y retornar el perfil
    let perfil = null;
    if (data.user) {
      try {
        perfil = await getUserProfileById(data.user.id);
      } catch (profileError) {
        console.warn("[Register Service] No se pudo obtener el perfil inmediatamente:", profileError.message);
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
    console.error("[Register Service Error]:", error.message || error);
    throw error;
  }
}

/**
 * Autentica un usuario con email y contraseña en Supabase Auth de forma resiliente
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
      throw error;
    }

    // Resiliencia al obtener el perfil: si falla la base de datos de perfiles, no bloqueamos la autenticación
    let perfil = null;
    try {
      perfil = await getUserProfileById(data.user.id);
    } catch (profileError) {
      console.warn("[Login Service] No se pudo obtener el perfil de la base de datos:", profileError.message);
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        nombre: perfil?.nombre || data.user.user_metadata?.nombre || '',
        apellido: perfil?.apellido || data.user.user_metadata?.apellido || '',
        created_at: data.user.created_at
      },
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in
      }
    };
  } catch (error) {
    console.error("[Login Service Error]:", error.message || error);
    throw error;
  }
}

/**
 * Obtiene el perfil del usuario actual llamando al modelo
 * @param {string} userId - UUID del usuario
 * @returns {Promise<Object>} Perfil de usuario
 */
export async function getCurrentUserProfile(userId) {
  try {
    return await getUserProfileById(userId);
  } catch (error) {
    console.error("[Auth Service Error]: Fallo al recuperar perfil por ID:", error.message || error);
    throw error;
  }
}

/**
 * Solicita el envío de un enlace de recuperación de contraseña al email indicado.
 *
 * Flujo:
 * 1. Llama a supabase.auth.resetPasswordForEmail() con el email del usuario.
 * 2. Supabase verifica internamente si el email existe en auth.users.
 * 3. Si existe, genera un token temporal y envía un email con un enlace de recuperación.
 * 4. El enlace redirige al usuario a la URL definida en redirectTo (frontend).
 *
 * Notas de seguridad:
 * - No lanza error si el email no existe (Supabase simplemente no envía el mail).
 * - El controller siempre responde con el mismo mensaje para no revelar si el email está registrado.
 * - La URL de redirección debe estar habilitada en Supabase Dashboard > Authentication > URL Configuration.
 *
 * @param {string} email - Email del usuario que quiere recuperar su contraseña
 * @throws {Error} Si Supabase falla al procesar la solicitud (error de red, config, etc.)
 */
export async function forgotPassword(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password`
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("[Forgot Password Service Error]:", error.message || error);
    throw error;
  }
}

/**
 * Restablece la contraseña de un usuario usando el token de recuperación recibido por email.
 *
 * Flujo:
 * 1. El usuario hizo click en el enlace del email y llegó al frontend con un access_token en la URL.
 * 2. El frontend extrae ese token y lo envía al backend junto con la nueva contraseña.
 * 3. Se establece una sesión temporal con setSession() usando el token de recuperación.
 * 4. Una vez autenticado con esa sesión, se actualiza la contraseña con updateUser().
 *
 * Notas:
 * - setSession() valida que el token sea legítimo y no haya expirado.
 * - Si el token es inválido o expiró, Supabase lanza un error automáticamente.
 * - updateUser() cambia la contraseña del usuario asociado a la sesión activa.
 * - No se necesita tabla adicional, Supabase maneja todo internamente en auth.users.
 *
 * @param {string} token - Token de recuperación (access_token del enlace del email)
 * @param {string} password - Nueva contraseña elegida por el usuario
 * @throws {Error} Si el token es inválido/expirado o si falla la actualización de contraseña
 */
export async function resetPassword(token, password) {
  try {
    // Paso 1: Establecer sesión temporal con el token de recuperación
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: token
    });

    if (sessionError) {
      throw sessionError;
    }

    // Paso 2: Actualizar la contraseña del usuario autenticado en la sesión temporal
    const { error: updateError } = await supabase.auth.updateUser({
      password
    });

    if (updateError) {
      throw updateError;
    }
  } catch (error) {
    console.error("[Reset Password Service Error]:", error.message || error);
    throw error;
  }
}
