import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';
import { REQUEST_STATUS } from '../utils/constants.js';

class JobRequestsService {
  async createJobRequest(clientId, data) {
    const {
      categoryId,
      title,
      description,
      datePreference,
      estimatedBudget,
      isEmergency,
      hasMaterials,
      address,
      neighborhood,
      city,
      latitude,
      longitude,
      photos,
      timePreference,
      installationAge
    } = data;

    // Inserción en la tabla requests
    const { data: newRequest, error } = await supabase
      .from('requests')
      .insert({
        client_id: clientId,
        category_id: categoryId,
        title,
        description,
        date_preference: datePreference,
        estimated_budget: estimatedBudget,
        address,
        neighborhood,
        city,
        latitude,
        longitude,
        is_emergency: isEmergency,
        has_materials: hasMaterials,
        time_preference: timePreference,
        installation_age: installationAge,
        status: REQUEST_STATUS.PUBLISHED
      })
      .select('id')
      .single();

    if (error) {
      throw new AppError(`Error al crear la solicitud: ${error.message}`, 500, 'DB_ERROR');
    }

    // Inserción de fotos si existen
    if (photos && photos.length > 0) {
      const photosData = photos.map((photoPath, index) => ({
        request_id: newRequest.id,
        storage_path: photoPath,
        position: index
      }));

      const { error: photosError } = await supabase
        .from('request_photos')
        .insert(photosData);

      if (photosError) {
        // En un entorno de producción estricto podríamos requerir RPC para rollback,
        // pero dado que si falla la foto, la request ya existe, podemos dejarla o intentar rollback manual.
        // Optamos por un rollback manual (eliminación) en caso de fallo crítico de imágenes para emular atomicidad.
        await supabase.from('requests').delete().eq('id', newRequest.id);
        throw new AppError(`Error al guardar las fotos de la solicitud: ${photosError.message}`, 500, 'DB_ERROR');
      }
    }

    return newRequest;
  }

  async getClientRequests(clientId) {
    const { data, error } = await supabase
      .from('requests')
      .select(`
        id,
        title,
        description,
        status,
        date_preference,
        time_preference,
        is_emergency,
        has_materials,
        installation_age,
        estimated_budget,
        address,
        neighborhood,
        city,
        created_at,
        category:service_categories(id, name, icon),
        photos:request_photos(storage_path),
        offers:offers(id, status)
      `)
      .eq('client_id', clientId)
      .in('status', [REQUEST_STATUS.PUBLISHED, REQUEST_STATUS.OFFERED])
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Error al obtener solicitudes: ${error.message}`, 500, 'DB_ERROR');
    }

    return data;
  }

  async getRequestOffers(clientId, requestId) {
    // 1. Verify the request belongs to the client
    const { data: request, error: reqError } = await supabase
      .from('requests')
      .select('client_id')
      .eq('id', requestId)
      .single();

    if (reqError || !request) {
      throw new AppError('La solicitud no existe', 404, 'NOT_FOUND');
    }

    if (request.client_id !== clientId) {
      throw new AppError('No tienes permiso para ver estas ofertas', 403, 'FORBIDDEN');
    }

    // 2. Fetch the offers with professional details
    const { data: offers, error: offersError } = await supabase
      .from('offers')
      .select(`
        id,
        amount,
        proposed_deposit,
        proposed_date,
        proposed_time,
        message,
        status,
        created_at,
        professional:profiles!professional_id (
          id,
          first_name,
          last_name,
          avatar_url,
          professional_profiles (
            rating_avg,
            reviews_count
          )
        )
      `)
      .eq('request_id', requestId)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (offersError) {
      throw new AppError(`Error al obtener ofertas: ${offersError.message}`, 500, 'DB_ERROR');
    }

    // Format the response for the frontend
    return offers.map(offer => {
      let profProfile = null;
      if (offer.professional.professional_profiles) {
        profProfile = Array.isArray(offer.professional.professional_profiles)
          ? offer.professional.professional_profiles[0]
          : offer.professional.professional_profiles;
      }
      
      return {
        id: offer.id,
        amount: offer.amount,
        proposed_deposit: offer.proposed_deposit,
        proposed_date: offer.proposed_date,
        proposed_time: offer.proposed_time,
        message: offer.message,
        status: offer.status,
        created_at: offer.created_at,
        professional: {
          id: offer.professional.id,
          name: `${offer.professional.first_name || ''} ${offer.professional.last_name || ''}`.trim(),
          avatar_url: offer.professional.avatar_url,
          rating_avg: profProfile?.rating_avg || 0,
          reviews_count: profProfile?.reviews_count || 0
        }
      };
    });
  }
}

export default new JobRequestsService();
