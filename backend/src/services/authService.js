import { supabase } from '../config/supabase.js';
import { AppError, ConflictError, UnauthorizedError } from '../utils/errors.js';
import { ERROR_CODES } from '../utils/constants.js';

export const registerUser = async ({ nombre, apellido, email, password, role }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: nombre,
        last_name: apellido,
        role: role,
      },
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes('already registered')) {
      throw new ConflictError('El correo electrónico ya está en uso.');
    }
    throw new AppError(error.message, error.status || 500, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }

  return {
    id: data.user.id,
    email: data.user.email,
  };
};

export const loginUser = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.toLowerCase().includes('invalid login credentials')) {
      throw new UnauthorizedError('Credenciales incorrectas.');
    }
    throw new AppError(error.message, error.status || 500, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      role: data.user.user_metadata?.role,
    },
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
  };
};
