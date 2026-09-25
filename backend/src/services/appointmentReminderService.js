import { supabase } from '../config/supabase.js';

/**
 * Formatea una fecha a cadena legible (ej: "28/07/2026 15:30 hs")
 */
const formatDateStr = (d) => {
  if (!d) return 'Fecha a convenir';
  const dateObj = new Date(d);
  if (isNaN(dateObj.getTime())) return String(d);
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes} hs`;
};

/**
 * Helper para obtener iniciales
 */
const getInitials = (fullName) => {
  if (!fullName) return 'U';
  const parts = fullName.split(' ').filter(Boolean);
  return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : fullName.slice(0, 2).toUpperCase();
};

/**
 * Procesa y genera las notificaciones de recordatorio para turnos que ocurren
 * en las próximas 36 horas (un día antes / hoy), tanto para el profesional como para el cliente.
 * 
 * Regla de negocio:
 * - Turno confirmado (status = 'confirmed').
 * - Evita duplicados: Si ya existe una notificación para ese appointment y ese usuario, no la repite.
 * 
 * @param {string|Object|null} options - Si es string: targetProfessionalId. Si es object: { targetProfessionalId, targetClientId }.
 * @returns {Promise<Object>} { success: true, processedCount, createdCount }
 */
export const processUpcomingReminders = async (options = null) => {
  let targetProfessionalId = null;
  let targetClientId = null;

  if (typeof options === 'string') {
    targetProfessionalId = options;
  } else if (options && typeof options === 'object') {
    targetProfessionalId = options.targetProfessionalId || null;
    targetClientId = options.targetClientId || null;
  }

  const now = new Date();
  const upcomingWindow = new Date(now.getTime() + 36 * 60 * 60 * 1000); // Próximas 36 horas

  console.log(`[processUpcomingReminders] Buscando turnos entre ${now.toISOString()} y ${upcomingWindow.toISOString()}`);

  // Usamos consultas desacopladas y seguras para evitar errores de alias de PostgREST
  const { data: appointments, error: apptError } = await supabase
    .from('appointments')
    .select('id, offer_id, scheduled_at, status, notes')
    .eq('status', 'confirmed')
    .gte('scheduled_at', now.toISOString())
    .lte('scheduled_at', upcomingWindow.toISOString());

  if (apptError) {
    console.error('[processUpcomingReminders] Error al consultar turnos:', apptError);
    return { success: false, error: apptError.message, processedCount: 0, createdCount: 0 };
  }

  if (!appointments || appointments.length === 0) {
    return { success: true, processedCount: 0, createdCount: 0 };
  }

  let createdCount = 0;

  for (const appt of appointments) {
    // 1. Obtener la oferta
    const { data: offer } = await supabase
      .from('offers')
      .select('id, professional_id, request_id')
      .eq('id', appt.offer_id)
      .maybeSingle();

    if (!offer) continue;

    const profId = offer.professional_id;

    // 2. Obtener la solicitud asociada
    const { data: request } = await supabase
      .from('requests')
      .select('id, title, client_id')
      .eq('id', offer.request_id)
      .maybeSingle();

    const clientId = request?.client_id;
    const serviceName = request?.title || 'Servicio acordado';
    const formattedDate = formatDateStr(appt.scheduled_at);

    // 3. Obtener perfiles de ambos (profesional y cliente)
    const userIdsToFetch = [profId, clientId].filter(Boolean);
    let profProfile = null;
    let clientProfile = null;

    if (userIdsToFetch.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', userIdsToFetch);

      profProfile = profiles?.find((p) => p.id === profId) || null;
      clientProfile = profiles?.find((p) => p.id === clientId) || null;
    }

    const profName = profProfile ? `${profProfile.first_name || ''} ${profProfile.last_name || ''}`.trim() : 'Profesional';
    const profInitials = getInitials(profName);

    const clientName = clientProfile ? `${clientProfile.first_name || ''} ${clientProfile.last_name || ''}`.trim() : 'Cliente';
    const clientInitials = getInitials(clientName);

    // ─── 4. Generar recordatorio para el PROFESIONAL ─────────────────────────────
    const shouldProcessProf = profId && (!targetProfessionalId || profId === targetProfessionalId);
    if (shouldProcessProf) {
      const { data: existingProfNotif } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', profId)
        .eq('related_entity_id', appt.id)
        .eq('type', 'appointment_reminder')
        .maybeSingle();

      if (!existingProfNotif) {
        const profPayload = {
          user_id: profId,
          type: 'appointment_reminder',
          title: 'Recordatorio',
          description: `Hoy tenés un turno con ${clientName}.`,
          href: `/professional/reminders/${appt.id}/details`,
          related_entity_id: appt.id,
          related_entity_type: 'appointment',
          is_read: false,
          metadata: {
            clientName,
            clientInitials,
            clientAvatarUrl: clientProfile?.avatar_url || null,
            serviceName,
            status: 'CONFIRMADO',
            date: formattedDate,
            timeAgo: 'Hoy',
          },
        };

        const { error: insProfErr } = await supabase.from('notifications').insert(profPayload);
        if (insProfErr) {
          console.error(`[processUpcomingReminders] Error al insertar recordatorio profesional (turno ${appt.id}):`, insProfErr);
        } else {
          console.log(`[processUpcomingReminders] Recordatorio creado para profesional ${profId} (turno ${appt.id})`);
          createdCount++;
        }
      }
    }

    // ─── 5. Generar recordatorio para el CLIENTE ─────────────────────────────────
    const shouldProcessClient = clientId && (!targetClientId || clientId === targetClientId);
    if (shouldProcessClient) {
      const { data: existingClientNotif } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', clientId)
        .eq('related_entity_id', appt.id)
        .in('type', ['reminder', 'appointment_reminder'])
        .maybeSingle();

      if (!existingClientNotif) {
        const clientPayload = {
          user_id: clientId,
          type: 'reminder',
          title: 'Recordatorio',
          description: `Hoy tenés un turno con ${profName}.`,
          href: '/client/agenda',
          related_entity_id: appt.id,
          related_entity_type: 'appointment',
          is_read: false,
          metadata: {
            professionalName: profName,
            professionalInitials: profInitials,
            avatarUrl: profProfile?.avatar_url || null,
            professionalAvatarUrl: profProfile?.avatar_url || null,
            serviceName,
            status: 'CONFIRMADO',
            date: formattedDate,
            timeAgo: 'Hoy',
          },
        };

        const { error: insCliErr } = await supabase.from('notifications').insert(clientPayload);
        if (insCliErr) {
          console.error(`[processUpcomingReminders] Error al insertar recordatorio cliente (turno ${appt.id}):`, insCliErr);
        } else {
          console.log(`[processUpcomingReminders] Recordatorio creado para cliente ${clientId} (turno ${appt.id})`);
          createdCount++;
        }
      }
    }
  }

  return {
    success: true,
    processedCount: appointments.length,
    createdCount,
  };
};
