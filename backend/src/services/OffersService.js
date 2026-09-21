import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';
import { REQUEST_STATUS } from '../utils/constants.js';

class OffersService {
  async createOffer(professionalId, data) {
    const { requestId, proposedDate, proposedTime, amount, proposedDeposit, message } = data;

    // Verificar estado de la solicitud y que no sea propia
    const { data: request, error: reqError } = await supabase
      .from('requests')
      .select('status, client_id')
      .eq('id', requestId)
      .single();

    if (reqError || !request) {
      throw new AppError('La solicitud no existe', 404, 'NOT_FOUND');
    }

    if (request.status !== REQUEST_STATUS.PUBLISHED) {
      throw new AppError('La solicitud ya no está disponible para ofertas', 409, 'CONFLICT');
    }

    if (request.client_id === professionalId) {
      throw new AppError('No puedes ofertar en tu propia solicitud', 409, 'CONFLICT');
    }

    // Verificar que no tenga oferta activa
    const { data: existingOffer, error: offerCheckError } = await supabase
      .from('offers')
      .select('id')
      .eq('request_id', requestId)
      .eq('professional_id', professionalId)
      .maybeSingle();

    if (existingOffer) {
      throw new AppError('Ya tienes una oferta para esta solicitud', 409, 'CONFLICT');
    }

    // Usar RPC para garantizar atomicidad al insertar la oferta y la notificación
    const { data: offerId, error: rpcError } = await supabase.rpc('create_offer_and_notify', {
      p_request_id: requestId,
      p_professional_id: professionalId,
      p_proposed_date: proposedDate,
      p_proposed_time: proposedTime,
      p_amount: amount,
      p_proposed_deposit: proposedDeposit,
      p_message: message || ''
    });

    if (rpcError) {
      throw new AppError(`Error al crear la oferta: ${rpcError.message}`, 500, 'DB_ERROR');
    }

    return offerId;
  }

  async acceptOffer(clientId, offerId) {
    // 1. Validar que la oferta exista
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select('request_id, status')
      .eq('id', offerId)
      .single();

    if (offerError || !offer) {
      throw new AppError('La oferta no existe', 404, 'NOT_FOUND');
    }

    if (offer.status !== 'pending') {
      throw new AppError('La oferta no está en estado pendiente', 409, 'CONFLICT');
    }

    // 2. Validar que el request pertenezca al cliente que acepta
    const { data: request, error: reqError } = await supabase
      .from('requests')
      .select('client_id, status')
      .eq('id', offer.request_id)
      .single();

    if (reqError || !request) {
      throw new AppError('La solicitud original no existe', 404, 'NOT_FOUND');
    }

    if (request.client_id !== clientId) {
      // Regla inquebrantable de privacidad (404 en lugar de 403 para no exponer)
      throw new AppError('Oferta no encontrada', 404, 'NOT_FOUND');
    }

    if (request.status !== REQUEST_STATUS.PUBLISHED && request.status !== REQUEST_STATUS.OFFERED) {
      throw new AppError('La solicitud ya fue asignada o cancelada', 409, 'CONFLICT');
    }

    // 3. Ejecutar el flujo atómico (RPC)
    const { data: appointmentId, error: rpcError } = await supabase.rpc('accept_offer_and_schedule', {
      p_offer_id: offerId
    });

    if (rpcError) {
      throw new AppError(`Error al procesar la aceptación: ${rpcError.message}`, 500, 'DB_ERROR');
    }

    return appointmentId;
  }

  async getPendingProfessionalOffers(professionalId) {
    const { data, error } = await supabase
      .from('offers')
      .select(`
        *,
        requests!inner(
          title, description, address, neighborhood, city, created_at,
          has_materials, is_emergency, installation_age, date_preference, time_preference,
          profiles(first_name, last_name, avatar_url),
          service_categories(name)
        )
      `)
      .eq('professional_id', professionalId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Error al obtener ofertas pendientes: ${error.message}`, 500, 'DB_ERROR');
    }

    return data.map(offer => ({
      id: offer.id,
      request_id: offer.request_id,
      titulo: offer.requests.title,
      servicio: offer.requests.service_categories?.name || 'General',
      descripcion: offer.requests.description,
      fecha: offer.proposed_date,
      hora: offer.proposed_time,
      monto: offer.amount,
      mensajeOferta: offer.message,
      estado: 'Pendiente',
      ubicacion: offer.requests.address ? `${offer.requests.neighborhood || ''}, ${offer.requests.city || ''}` : '',
      fechaPublicacion: offer.requests.created_at,
      cuestionario: {
        tieneMateriales: offer.requests.has_materials,
        esUrgencia: offer.requests.is_emergency,
        antiguedad: offer.requests.installation_age,
        cuandoLoNecesita: offer.requests.date_preference,
        horarioPreferencia: offer.requests.time_preference,
      },
      cliente: {
        nombre: offer.requests.profiles?.first_name || '',
        inicial: offer.requests.profiles?.last_name ? offer.requests.profiles.last_name.charAt(0) + '.' : '',
        avatar_url: offer.requests.profiles?.avatar_url || null
      }
    }));
  }
}

export default new OffersService();
