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
      photos
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
        estimated_budget,
        address,
        neighborhood,
        city,
        created_at,
        category:service_categories(id, name, icon),
        photos:request_photos(storage_path)
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Error al obtener solicitudes: ${error.message}`, 500, 'DB_ERROR');
    }

    return data;
  }
}

export default new JobRequestsService();
