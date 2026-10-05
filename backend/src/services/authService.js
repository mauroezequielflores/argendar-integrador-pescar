import { supabase, createThrowawayClient } from '../config/supabase.js';
import { AppError, ConflictError, UnauthorizedError } from '../utils/errors.js';
import { ERROR_CODES, ROLES } from '../utils/constants.js';

export const registerUser = async ({ nombre, apellido, email, password, role, location, latitude, longitude, coverageRadiusKm }) => {
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

  // Actualizar perfiles con datos geográficos y ubicación usando el cliente con service_role (supabase)
  if (location || latitude || longitude) {
    const updateData = {};
    if (location) updateData.location = location;
    if (latitude !== undefined && latitude !== null) updateData.latitude = latitude;
    if (longitude !== undefined && longitude !== null) updateData.longitude = longitude;
    
    await supabase.from('profiles').update(updateData).eq('id', data.user.id);
  }

  if (role === ROLES.PROFESSIONAL) {
    // Buscar una categoría por defecto para no violar la restricción NOT NULL de category_id
    const { data: categoryData } = await supabase
      .from('service_categories')
      .select('id')
      .limit(1);

    const categoryId = (categoryData && categoryData.length > 0) ? categoryData[0].id : null;

    // Si es profesional, nos aseguramos de que su registro en professional_profiles exista 
    // y tenga el radio configurado.
    const { error: profError } = await supabase.from('professional_profiles').upsert({
      profile_id: data.user.id,
      category_id: categoryId, // Necesario para la restricción NOT NULL
      coverage_radius_km: coverageRadiusKm || 10,
      latitude,
      longitude,
      service_area: location
    }, { onConflict: 'profile_id' });
    
    if (profError) {
      console.error("Error upserting professional_profiles:", profError);
      throw new AppError('Error al guardar datos profesionales: ' + profError.message, 500);
    }
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

  // Fetch the user's profile to get their role, name, avatar and location.
  // profiles.role es la fuente de verdad (la misma que usa authMiddleware).
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, first_name, last_name, avatar_url, location, latitude, longitude')
    .eq('id', data.user.id)
    .single();

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      role: profile?.role ?? data.user.user_metadata?.role,
      name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : null,
      first_name: profile?.first_name,
      last_name: profile?.last_name,
      avatar_url: profile?.avatar_url,
      location: profile?.location,
      latitude: profile?.latitude,
      longitude: profile?.longitude,
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
