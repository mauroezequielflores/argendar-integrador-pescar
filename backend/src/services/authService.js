import { supabase, createThrowawayClient } from '../config/supabase.js';
import { AppError, ConflictError, UnauthorizedError } from '../utils/errors.js';
import { ERROR_CODES } from '../utils/constants.js';

export const registerUser = async ({ nombre, apellido, email, password, role }) => {
  // We MUST create a throwaway client here because signUp mutates the client's internal auth state,
  // which poisons the global singleton for all future requests (causing RLS to apply instead of SERVICE_ROLE).
  const tempSupabase = createThrowawayClient();

  const { data, error } = await tempSupabase.auth.signUp({
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
  // We MUST create a throwaway client here because signInWithPassword mutates the client's internal auth state,
  // which poisons the global singleton for all future requests (causing RLS to apply instead of SERVICE_ROLE).
  const tempSupabase = createThrowawayClient();

  const { data, error } = await tempSupabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.toLowerCase().includes('invalid login credentials')) {
      throw new UnauthorizedError('Credenciales incorrectas.');
    }
    throw new AppError(error.message, error.status || 500, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }

  // Fetch the user's profile to get their name and avatar
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, avatar_url')
    .eq('id', data.user.id)
    .single();

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      role: data.user.user_metadata?.role,
      name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : null,
      first_name: profile?.first_name,
      last_name: profile?.last_name,
      avatar_url: profile?.avatar_url,
    },
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
  };
};

export const changePassword = async ({ userId, password }) => {
  // Utilizamos el cliente con SERVICE_ROLE_KEY para poder actualizar 
  // la contraseña del usuario sin necesidad de tener su sesión activa.
  const { data, error } = await supabase.auth.admin.updateUserById(
    userId,
    { password }
  );

  if (error) {
    throw new AppError(error.message, error.status || 500, ERROR_CODES.INTERNAL_SERVER_ERROR);
  }

  return { success: true };
};
