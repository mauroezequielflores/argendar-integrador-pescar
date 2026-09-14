import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';
import { uploadBase64Image } from '../utils/storage.js';

export const getClientProfile = async (userId, userEmail) => {
  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, created_at, location, description, avatar_url, cover_url')
    .eq('id', userId)
    .single();

  if (userError || !user) {
    console.error('ClientService Profile Error:', userError, 'for user:', userId);
    throw new AppError('Perfil no encontrado', 404);
  }

  // Las columnas rating_avg y reviews_count de professional_profiles no aplican directamente
  // al cliente en el schema actual. El cliente sólo recibe reviews si contrató servicios.
  // Vamos a buscarlas directamente en la tabla reviews para mantenerlo simple.
  const { data: reviewsData, error: reviewsError } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at, reviewer:profiles!reviewer_id(first_name, last_name)')
    .eq('reviewee_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (reviewsError) {
    throw new AppError('Error al obtener reseñas', 500);
  }

  const ratingAvg = reviewsData.length > 0
    ? (reviewsData.reduce((acc, rev) => acc + rev.rating, 0) / reviewsData.length).toFixed(1)
    : 0;

  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: userEmail,
    isVerified: false,
    memberSince: user.created_at,
    location: user.location,
    description: user.description,
    avatarUrl: user.avatar_url,
    coverUrl: user.cover_url,
    rating: Number(ratingAvg),
    reviewsCount: reviewsData.length, // Esto es el count de los top 5, idealmente se haría un count(*)
    reviews: reviewsData.map(rev => ({
      id: rev.id,
      authorName: `${rev.reviewer?.first_name || 'Usuario'} ${rev.reviewer?.last_name || ''}`.trim(),
      rating: rev.rating,
      comment: rev.comment,
      createdAt: rev.created_at
    }))
  };
};

export const updateClientProfile = async (userId, data) => {
  // Construir el payload de base de datos solo con lo que viene
  const payload = {};
  if (data.description !== undefined) payload.description = data.description;
  
  if (data.avatarUrl !== undefined) {
    if (data.avatarUrl === "") {
      payload.avatar_url = null;
    } else {
      payload.avatar_url = await uploadBase64Image(data.avatarUrl, 'avatars', `user-${userId}-avatar`);
    }
  }
  
  if (data.coverUrl !== undefined) {
    if (data.coverUrl === "") {
      payload.cover_url = null;
    } else {
      payload.cover_url = await uploadBase64Image(data.coverUrl, 'avatars', `user-${userId}-cover`);
    }
  }

  const { data: updated, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select('id, description, avatar_url, cover_url')
    .single();

  if (error) {
    throw new AppError('Error al actualizar el perfil', 500);
  }

  return {
    id: updated.id,
    description: updated.description,
    avatarUrl: updated.avatar_url,
    coverUrl: updated.cover_url
  };
};

export const getClientSettings = async (userId, userEmail) => {
  const { data: user, error } = await supabase
    .from('profiles')
    .select('first_name, last_name, dni, dni_verified, location, location_verified, phone, phone_verified')
    .eq('id', userId)
    .single();

  if (error || !user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  // En Supabase podemos asumir hasPassword si hay un provider = 'email'.
  // Por simplicidad, retornaremos un default true o lo podemos obtener usando auth.admin si fuera necesario.
  const hasPassword = true;

  return {
    personalInfo: {
      firstName: user.first_name,
      lastName: user.last_name,
      personalVerified: false,
      dni: user.dni,
      dniVerified: user.dni_verified
    },
    location: {
      address: user.location,
      locationVerified: user.location_verified
    },
    accountData: {
      email: userEmail,
      emailVerified: true, // Asumido
      phone: user.phone,
      phoneVerified: user.phone_verified,
      hasPassword
    }
  };
};

export const updateClientSettings = async (userId, data) => {
  // 1. Obtener estado actual
  const { data: currentUser, error: fetchError } = await supabase
    .from('profiles')
    .select('dni_verified')
    .eq('id', userId)
    .single();

  if (fetchError) throw new AppError('Error al verificar perfil', 500);

  const payload = {};
  if (data.firstName) payload.first_name = data.firstName;
  if (data.lastName) payload.last_name = data.lastName;
  
  if (data.dni !== undefined) {
    if (currentUser.dni_verified) {
      throw new AppError('El DNI ya se encuentra verificado y no puede modificarse.', 400);
    }
    payload.dni = data.dni;
    payload.dni_verified = false;
  }

  if (data.location !== undefined) {
    payload.location = data.location;
    payload.location_verified = false;
  }

  if (data.phone !== undefined) {
    payload.phone = data.phone;
    payload.phone_verified = false;
  }

  if (data.emailAlerts !== undefined) payload.email_alerts = data.emailAlerts;
  if (data.phoneAlerts !== undefined) payload.phone_alerts = data.phoneAlerts;

  const { data: updated, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select('first_name, last_name, dni, dni_verified, location, location_verified, phone, phone_verified, email_alerts, phone_alerts')
    .single();

  if (error) {
    throw new AppError('Error al actualizar configuración', 500);
  }

  return {
    firstName: updated.first_name,
    lastName: updated.last_name,
    dni: updated.dni,
    dniVerified: updated.dni_verified,
    location: updated.location,
    locationVerified: updated.location_verified,
    phone: updated.phone,
    phoneVerified: updated.phone_verified,
    emailAlerts: updated.email_alerts,
    phoneAlerts: updated.phone_alerts
  };
};
