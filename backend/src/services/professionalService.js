import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';
import { uploadBase64Image } from '../utils/storage.js';

export const getProfessionalProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      first_name,
      last_name,
      avatar_url,
      cover_url,
      created_at,
      description,
      professional_profiles (
        category:service_categories (name),
        skills,
        service_area,
        coverage_radius_km,
        rating_avg,
        reviews_count,
        certifications:professional_certifications (name),
        availability:professional_availability (day, time_range)
      )
    `)
    .eq('id', userId)
    .single();



  if (error || !data) {
    throw new AppError('Perfil profesional no encontrado', 404);
  }

  const profData = data.professional_profiles || {};

  // Fetch reviews to get tags and recent opinions
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select(`
      rating,
      comment,
      tags,
      created_at,
      reviewer:profiles!reviewer_id(first_name, last_name)
    `)
    .eq('reviewee_id', userId)
    .order('created_at', { ascending: false });

  const tagsCount = {};
  const recentReviews = [];

  if (reviewsData) {
    reviewsData.forEach((rev, index) => {
      // Tags aggregation
      if (rev.tags && Array.isArray(rev.tags)) {
        rev.tags.forEach(tag => {
          tagsCount[tag] = (tagsCount[tag] || 0) + 1;
        });
      }
      // Top 5 recent reviews
      if (index < 5) {
        recentReviews.push({
          authorName: `${rev.reviewer?.first_name || 'Usuario'} ${rev.reviewer?.last_name || ''}`.trim(),
          rating: rev.rating,
          comment: rev.comment,
          createdAt: rev.created_at
        });
      }
    });
  }
  
  return {
    firstName: data.first_name,
    lastName: data.last_name,
    title: profData.category?.name || 'PROFESIONAL',
    avatarUrl: data.avatar_url,
    coverUrl: data.cover_url,
    isOnline: true,
    memberSince: data.created_at,
    description: data.description,
    skills: profData.skills || [],
    baseLocation: profData.service_area,
    coverageRadiusKm: profData.coverage_radius_km,
    certifications: (profData.certifications || []).map(c => ({
      name: c.name,
      issuer: c.issuer,
      filePath: c.file_path
    })),
    availability: {
      schedule: (profData.availability || []).map(a => ({
        day: a.day,
        timeRange: a.time_range
      }))
    },
    ratingAvg: Number(profData.rating_avg || 0),
    reviewsCount: profData.reviews_count || 0,
    tagsCount,
    recentReviews
  };
};

export const updateProfessionalProfile = async (userId, data) => {
  // Update profiles table (description, avatar, cover)
  const profilePayload = {};
  if (data.description !== undefined) profilePayload.description = data.description;
  
  if (data.avatarUrl !== undefined) {
    if (data.avatarUrl === "") {
      profilePayload.avatar_url = null;
    } else {
      profilePayload.avatar_url = await uploadBase64Image(data.avatarUrl, 'avatars', `user-${userId}-avatar`);
    }
  }
  
  if (data.coverUrl !== undefined) {
    if (data.coverUrl === "") {
      profilePayload.cover_url = null;
    } else {
      profilePayload.cover_url = await uploadBase64Image(data.coverUrl, 'avatars', `user-${userId}-cover`);
    }
  }

  if (Object.keys(profilePayload).length > 0) {
    const { error: profileError } = await supabase
      .from('profiles')
      .update(profilePayload)
      .eq('id', userId);
    
    if (profileError) throw new AppError('Error al actualizar tabla profiles', 500);
  }

  // Update professional_profiles (skills, service_area, coverage_radius_km)
  const profPayload = {};
  if (data.skills !== undefined) profPayload.skills = data.skills;
  if (data.baseLocation !== undefined) profPayload.service_area = data.baseLocation;
  if (data.coverageRadiusKm !== undefined) profPayload.coverage_radius_km = data.coverageRadiusKm;

  if (Object.keys(profPayload).length > 0) {
    const { error: profError } = await supabase
      .from('professional_profiles')
      .update(profPayload)
      .eq('profile_id', userId);
    
    if (profError) throw new AppError('Error al actualizar datos profesionales', 500);
  }

  // Update certifications
  if (data.certifications !== undefined) {
    await supabase.from('professional_certifications').delete().eq('profile_id', userId);
    if (data.certifications.length > 0) {
      const certsToInsert = data.certifications.map(c => ({
        profile_id: userId,
        name: c.name,
        issuer: c.issuer,
        file_path: c.filePath
      }));
      await supabase.from('professional_certifications').insert(certsToInsert);
    }
  }

  // Update availability
  if (data.availability?.schedule !== undefined) {
    await supabase.from('professional_availability').delete().eq('profile_id', userId);
    if (data.availability.schedule.length > 0) {
      const availToInsert = data.availability.schedule.map(s => ({
        profile_id: userId,
        day: s.day,
        time_range: s.timeRange
      }));
      await supabase.from('professional_availability').insert(availToInsert);
    }
  }

  // Retornar el perfil actualizado completo
  return await getProfessionalProfile(userId);
};

export const getProfessionalSettings = async (userId, userEmail) => {
  const { data: user, error } = await supabase
    .from('profiles')
    .select(`
      first_name,
      last_name,
      dni,
      dni_verified,
      location,
      location_verified,
      latitude,
      longitude,
      phone,
      phone_verified,
      professional_profiles(is_verified, coverage_radius_km)
    `)
    .eq('id', userId)
    .single();

  if (error || !user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  const isVerified = user.professional_profiles?.is_verified || false;
  const coverageRadiusKm = user.professional_profiles?.coverage_radius_km || 10;

  return {
    personalInfo: {
      firstName: user.first_name,
      lastName: user.last_name,
      personalVerified: isVerified,
      dni: user.dni,
      dniVerified: user.dni_verified
    },
    location: {
      address: user.location,
      latitude: user.latitude,
      longitude: user.longitude,
      locationVerified: user.location_verified,
      coverageRadiusKm
    },
    accountData: {
      email: userEmail,
      emailVerified: true,
      phone: user.phone,
      phoneVerified: user.phone_verified,
      hasPassword: true
    }
  };
};

export const updateProfessionalSettings = async (userId, data) => {
  const { data: currentUser, error: fetchError } = await supabase
    .from('profiles')
    .select('dni_verified')
    .eq('id', userId)
    .single();

  if (fetchError) throw new AppError('Error al verificar perfil', 500);

  const payload = {};
  if (data.firstName !== undefined) payload.first_name = data.firstName;
  if (data.lastName !== undefined) payload.last_name = data.lastName;
  
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
  
  if (data.latitude !== undefined) payload.latitude = data.latitude;
  if (data.longitude !== undefined) payload.longitude = data.longitude;

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
    .select('first_name, last_name, dni, dni_verified, location, location_verified, latitude, longitude, phone, phone_verified, email_alerts, phone_alerts')
    .single();

  if (error) {
    throw new AppError('Error al actualizar configuración general', 500);
  }

  // Update professional_profiles for radius and coordinates
  const profPayload = {};
  if (data.coverageRadiusKm !== undefined) profPayload.coverage_radius_km = data.coverageRadiusKm;
  if (data.latitude !== undefined) profPayload.latitude = data.latitude;
  if (data.longitude !== undefined) profPayload.longitude = data.longitude;

  if (Object.keys(profPayload).length > 0) {
    const { error: profError } = await supabase
      .from('professional_profiles')
      .update(profPayload)
      .eq('profile_id', userId);
      
    if (profError) throw new AppError('Error al actualizar configuración profesional (radio/ubicación)', 500);
  }

  return {
    firstName: updated.first_name,
    lastName: updated.last_name,
    dni: updated.dni,
    dniVerified: updated.dni_verified,
    location: updated.location,
    latitude: updated.latitude,
    longitude: updated.longitude,
    locationVerified: updated.location_verified,
    coverageRadiusKm: data.coverageRadiusKm !== undefined ? data.coverageRadiusKm : undefined,
    phone: updated.phone,
    phoneVerified: updated.phone_verified,
    emailAlerts: updated.email_alerts,
    phoneAlerts: updated.phone_alerts
  };
};
