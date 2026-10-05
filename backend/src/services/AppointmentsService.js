import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';
import { REQUEST_STATUS, APPOINTMENT_STATUS, PAYMENT_STATUS } from '../utils/constants.js';

class AppointmentsService {
  async listAppointments(userId, role, filters) {
    const { tab = 'solicitudes', sort = 'newest', page = 1, limit = 20 } = filters;
    const offset = (Number(page) - 1) * Number(limit);
    const ascending = sort === 'oldest';

    if (tab === 'solicitudes') {
      if (role === 'professional') {
        throw new AppError('Tab de solicitudes no válido para este rol', 400, 'VALIDATION_ERROR');
      }

      // Devolver solicitudes del cliente en estado PUBLISHED u OFFERED
      const { data, count, error } = await supabase
        .from('requests')
        .select('*, offers(id), service_categories(name)', { count: 'exact' })
        .eq('client_id', userId)
        .in('status', [REQUEST_STATUS.PUBLISHED, REQUEST_STATUS.OFFERED])
        .order('created_at', { ascending })
        .range(offset, offset + Number(limit) - 1);

      if (error) throw new AppError(`Error al obtener solicitudes: ${error.message}`, 500, 'DB_ERROR');

      return {
        data: data.map(req => ({
          id: req.id,
          tipo: 'solicitud',
          estado: req.status,
          titulo: req.title,
          descripcion: req.description,
          ubicacion: req.address ? `${req.neighborhood || ''}, ${req.city || ''}` : '',
          categoria: req.service_categories?.name || req.category_id,
          ofertasCount: req.offers ? req.offers.length : 0,
          fecha: req.created_at,
          preferenciaTemporal: req.date_preference
        })),
        total: count,
        page: Number(page),
        limit: Number(limit)
      };
    } 
    
    if (tab === 'proximos' || tab === 'historial') {
      // Necesitamos unir appointments -> offers -> requests
      // y appointments -> offers -> professional_profiles o profiles
      let query = supabase
        .from('appointments')
        .select(`
          id,
          status,
          scheduled_at,
          offers!inner (
            id,
            amount,
            professional_id,
            profiles:professional_id (first_name, last_name, avatar_url),
            requests!inner (
              id,
              client_id,
              title,
              category_id,
              address,
              neighborhood,
              city,
              service_categories(name),
              profiles:client_id (first_name, last_name, avatar_url)
            )
          )
        `, { count: 'exact' });

      if (role === 'professional') {
        query = query.eq('offers.professional_id', userId);
      } else {
        const { data: clientRequests, error: crError } = await supabase
          .from('requests')
          .select('id')
          .eq('client_id', userId);
          
        if (crError) throw new AppError(`Error al obtener solicitudes del cliente: ${crError.message}`, 500, 'DB_ERROR');
        
        const requestIds = clientRequests.map(r => r.id);
        
        if (requestIds.length === 0) {
          return { data: [], total: 0, page: Number(page), limit: Number(limit) };
        }

        const { data: clientOffers, error: coError } = await supabase
          .from('offers')
          .select('id')
          .in('request_id', requestIds);
          
        if (coError) throw new AppError(`Error al obtener ofertas del cliente: ${coError.message}`, 500, 'DB_ERROR');
        
        const offerIds = clientOffers.map(o => o.id);
        if (offerIds.length === 0) {
          return { data: [], total: 0, page: Number(page), limit: Number(limit) };
        }
        query = query.in('offer_id', offerIds);
      }

      if (tab === 'proximos') {
        query = query.in('status', [APPOINTMENT_STATUS.CONFIRMED, APPOINTMENT_STATUS.RESCHEDULED]);
      } else {
        query = query.in('status', [APPOINTMENT_STATUS.COMPLETED, APPOINTMENT_STATUS.CANCELLED]);
      }

      query = query.order('scheduled_at', { ascending }).range(offset, offset + Number(limit) - 1);

      const { data, count, error } = await query;
      if (error) throw new AppError(`Error al obtener turnos: ${error.message}`, 500, 'DB_ERROR');

      return {
        data: data.map(app => {
          const offer = app.offers;
          const req = offer?.requests;
          
          let persona = null;
          if (role === 'professional') {
            const clientProf = req?.profiles;
            persona = {
              nombre: clientProf ? `${clientProf.first_name} ${clientProf.last_name}` : 'Cliente',
              foto: clientProf?.avatar_url || null,
              calificacion: 5.0
            };
          } else {
            const prof = offer?.profiles;
            persona = {
              nombre: prof ? `${prof.first_name} ${prof.last_name}` : 'Profesional',
              foto: prof?.avatar_url || null,
              calificacion: 5.0
            };
          }

          return {
            id: app.id,
            tipo: 'turno',
            estado: app.status,
            ubicacion: req?.address ? `${req.neighborhood || ''}, ${req.city || ''}` : '',
            titulo: req?.title,
            fecha: app.scheduled_at,
            categoria: req?.service_categories?.name || req?.category_id,
            persona: persona
          };
        }),
        total: count,
        page: Number(page),
        limit: Number(limit)
      };
    }

    throw new AppError('Tab inválido', 400, 'VALIDATION_ERROR');
  }

  async getAppointmentById(userId, appointmentId, userRole = 'client') {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        status,
        scheduled_at,
        offers!inner (
          id,
          amount,
          proposed_deposit,
          professional_id,
          profiles:professional_id (
            first_name, 
            last_name, 
            phone, 
            avatar_url,
            professional_profiles (category_id, headline)
          ),
          requests!inner (
            id,
            client_id,
            title,
            description,
            category_id,
            address,
            neighborhood,
            city,
            date_preference,
            time_preference,
            is_emergency,
            has_materials,
            installation_age,
            request_photos (storage_path),
            service_categories (name),
            profiles:client_id (first_name, last_name, phone, avatar_url)
          )
        ),
        payments (
          status,
          method,
          deposit_amount,
          total_amount
        )
      `)
      .eq('id', appointmentId)
      .single();

    if (error || !data) {
      if (error?.code === 'PGRST116') throw new AppError('Turno no encontrado', 404, 'RECURSO_NO_ENCONTRADO');
      throw new AppError(`Error DB: ${error?.message}`, 500, 'ERROR_INTERNO');
    }

    // Validar ownership
    if (userRole === 'professional' && data.offers.professional_id !== userId) {
      throw new AppError('Turno no encontrado', 404, 'RECURSO_NO_ENCONTRADO');
    } else if (userRole === 'client' && data.offers.requests.client_id !== userId) {
      throw new AppError('Turno no encontrado', 404, 'RECURSO_NO_ENCONTRADO');
    }

    const offer = data.offers;
    const req = offer.requests;
    const prof = offer.profiles;
    const client = req.profiles;
    const payment = Array.isArray(data.payments) 
      ? (data.payments.length > 0 ? data.payments[0] : null) 
      : (data.payments || null);

    let persona = null;
    if (userRole === 'professional') {
      persona = {
        nombre: `${client.first_name} ${client.last_name}`,
        telefono: client.phone || '',
        foto: client.avatar_url || null,
        calificacion: 5.0
      };
    } else {
      const profProfile = Array.isArray(prof.professional_profiles) 
        ? prof.professional_profiles[0] 
        : prof.professional_profiles;
        
      persona = {
        nombre: `${prof.first_name} ${prof.last_name}`,
        telefono: prof.phone || '',
        foto: prof.avatar_url || null,
        profesion: profProfile?.headline || '',
        calificacion: 5.0
      };
    }

    return {
      id: data.id,
      estado: data.status,
      ubicacion: req.city ? `${req.neighborhood || ''}, ${req.city}` : '',
      direccionExacta: req.address,
      titulo: req.title,
      fecha: data.scheduled_at,
      categoria: req.category_id,
      preferencia: req.date_preference,
      persona: persona,
      solicitud: {
        id: req.id,
        titulo: req.title,
        descripcion: req.description,
        categoria: req.service_categories?.name || 'General',
        cuestionario: {
          tieneMateriales: req.has_materials,
          esUrgencia: req.is_emergency,
          cuandoLoNecesita: req.date_preference,
          antiguedad: req.installation_age
        },
        ubicacion: [req.neighborhood, req.city].filter(Boolean).join(', '),
        horarioPreferencia: req.time_preference,
        imagenesUrl: req.request_photos?.map(p => p.storage_path) || []
      },
      pago: payment ? {
        estado: payment.status,
        metodo: payment.method,
        senia: payment.deposit_amount,
        saldo: payment.total_amount - payment.deposit_amount,
        total: payment.total_amount
      } : {
        estado: 'PENDIENTE',
        metodo: 'Acordar con profesional',
        senia: offer.proposed_deposit || 0,
        saldo: (offer.amount || 0) - (offer.proposed_deposit || 0),
        total: offer.amount || 0
      }
    };
  }

  async cancelAppointment(clientId, appointmentId, reason) {
    // 1. Validar turno
    const { data: app, error } = await supabase
      .from('appointments')
      .select('id, status, offers!inner(professional_id, requests!inner(client_id, id))')
      .eq('id', appointmentId)
      .single();

    if (error || !app || app.offers.requests.client_id !== clientId) {
      throw new AppError('Turno no encontrado', 404, 'RECURSO_NO_ENCONTRADO');
    }

    if (app.status === APPOINTMENT_STATUS.COMPLETED || app.status === APPOINTMENT_STATUS.CANCELLED) {
      throw new AppError('El turno ya no puede ser cancelado', 403, 'ACCION_NO_PERMITIDA');
    }

    // 2. Actualizar estado (Idealmente RPC para rollback)
    const { error: updateError } = await supabase
      .from('appointments')
      .update({ status: APPOINTMENT_STATUS.CANCELLED })
      .eq('id', appointmentId);

    if (updateError) throw new AppError('Error al cancelar', 500, 'ERROR_INTERNO');

    // 3. Update requests to CANCELLED as well
    await supabase.from('requests').update({ status: REQUEST_STATUS.CANCELLED }).eq('id', app.offers.requests.id);

    // 4. Notificar
    await supabase.from('notifications').insert({
      user_id: app.offers.professional_id,
      type: 'appointment_cancelled',
      title: 'Turno Cancelado',
      description: `El cliente ha cancelado el turno. Motivo: ${reason || 'N/A'}`,
      related_entity_id: appointmentId,
      related_entity_type: 'appointment'
    });

    return appointmentId;
  }

  async confirmPayment(userId, appointmentId) {
    // 1. Validar turno
    const { data: app, error } = await supabase
      .from('appointments')
      .select('id, status, offers!inner(professional_id, requests!inner(client_id, id))')
      .eq('id', appointmentId)
      .single();

    if (error || !app || app.offers.professional_id !== userId) {
      throw new AppError('Turno no encontrado o sin permisos', 404, 'RECURSO_NO_ENCONTRADO');
    }

    // 2. Buscar el pago
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('id, status')
      .eq('appointment_id', appointmentId)
      .single();

    if (paymentError || !payment) {
      throw new AppError('Pago no encontrado', 404, 'RECURSO_NO_ENCONTRADO');
    }

    if (payment.status === 'paid' || payment.status === 'PAID') {
      throw new AppError('El pago ya ha sido confirmado anteriormente', 400, 'ACCION_NO_PERMITIDA');
    }

    // 3. Actualizar estado del pago
    const { error: updateError } = await supabase
      .from('payments')
      .update({ status: 'paid', method: 'cash' })
      .eq('id', payment.id);

    if (updateError) throw new AppError(`Error al confirmar pago: ${updateError.message}`, 500, 'ERROR_INTERNO');

    // 4. Notificar al cliente
    await supabase.from('notifications').insert({
      user_id: app.offers.requests.client_id,
      type: 'payment_confirmed',
      title: 'Pago Confirmado',
      description: 'El profesional ha confirmado la recepción del pago.',
      related_entity_id: appointmentId,
      related_entity_type: 'appointment'
    });

    return appointmentId;
  }

  async confirmCompletion(userId, appointmentId) {
    // 1. Validar turno
    const { data: app, error } = await supabase
      .from('appointments')
      .select('id, status, offers!inner(professional_id, requests!inner(client_id, id))')
      .eq('id', appointmentId)
      .single();

    if (error || !app || (app.offers.requests.client_id !== userId && app.offers.professional_id !== userId)) {
      throw new AppError('Turno no encontrado', 404, 'RECURSO_NO_ENCONTRADO');
    }

    // Permitir completado si está confirmado o scheduled
    if (app.status !== APPOINTMENT_STATUS.CONFIRMED && app.status !== 'IN_PROGRESS' && app.status !== 'scheduled') {
      throw new AppError('El turno no está en estado válido para finalizar', 403, 'ACCION_NO_PERMITIDA');
    }

    // 2. Actualizar estado
    const { error: updateError } = await supabase
      .from('appointments')
      .update({ status: APPOINTMENT_STATUS.COMPLETED })
      .eq('id', appointmentId);

    if (updateError) throw new AppError('Error al finalizar', 500, 'ERROR_INTERNO');

    await supabase.from('requests').update({ status: REQUEST_STATUS.COMPLETED }).eq('id', app.offers.requests.id);

    // 3. Notificar
    const isProfessional = userId === app.offers.professional_id;
    const targetUserId = isProfessional ? app.offers.requests.client_id : app.offers.professional_id;
    
    await supabase.from('notifications').insert({
      user_id: targetUserId,
      type: 'appointment_completed',
      title: 'Trabajo Finalizado',
      description: isProfessional 
        ? 'El profesional ha finalizado el trabajo. ¡Por favor deja una reseña!' 
        : 'El cliente ha confirmado la finalización del trabajo.',
      related_entity_id: appointmentId,
      related_entity_type: 'appointment'
    });

    return appointmentId;
  }
}

export default new AppointmentsService();
