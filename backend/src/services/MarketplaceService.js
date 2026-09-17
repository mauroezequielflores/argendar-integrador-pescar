import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';
import { REQUEST_STATUS } from '../utils/constants.js';

class MarketplaceService {
  async getRequests(professionalId, filters) {
    const { search, categories, page = 1, limit = 20, lat, lng } = filters;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('requests')
      .select('*, profiles(first_name, last_name)', { count: 'exact' })
      .eq('status', REQUEST_STATUS.PUBLISHED)
      .neq('client_id', professionalId) // Excluir solicitudes propias
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (categories) {
      const categoriesArray = categories.split(',').map(c => c.trim());
      // Supongamos que categories son nombres y usamos inner join o subqueries.
      // O si categories en request es UUID, este filtro variará. 
      // Si la UI pasa strings de categorias (nombres), necesitamos unir category_id.
      // Asumimos que categories trae un ID o manejamos el filtro según el esquema.
      // Para simplificar, si el query string trae IDs (o si requests guarda el string):
      query = query.in('category_id', categoriesArray);
    }

    const { data, count, error } = await query;

    if (error) {
      throw new AppError(`Error al obtener solicitudes: ${error.message}`, 500, 'DB_ERROR');
    }

    // Calcular distancias simuladas o reales aquí (mock por ahora)
    const processedData = data.map(req => {
      let distanceKm = null;
      if (lat && lng && req.latitude && req.longitude) {
        // Cálculo básico Haversine como fallback o mock
        const R = 6371; 
        const dLat = (req.latitude - lat) * (Math.PI / 180);
        const dLon = (req.longitude - lng) * (Math.PI / 180);
        const a = 
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat * (Math.PI / 180)) * Math.cos(req.latitude * (Math.PI / 180)) * 
          Math.sin(dLon / 2) * Math.sin(dLon / 2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        distanceKm = Number((R * c).toFixed(1));
      }

      return {
        id: req.id,
        titulo: req.title,
        descripcion: req.description,
        categoria: req.category_id,
        ubicacion: req.address ? `${req.neighborhood || ''}, ${req.city || ''}` : '',
        distanciaKm: distanceKm,
        fecha: req.created_at,
        cliente: req.profiles ? `${req.profiles.first_name} ${req.profiles.last_name.charAt(0)}.` : 'Cliente'
      };
    });

    return {
      data: processedData,
      meta: {
        totalCount: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async getRequestById(professionalId, id) {
    // Para el detalle también podríamos validar que el cliente no sea el mismo, 
    // pero la UI lo oculta.
    const { data, error } = await supabase
      .from('requests')
      .select('*, profiles(first_name, last_name), request_photos(storage_path)')
      .eq('id', id)
      .eq('status', REQUEST_STATUS.PUBLISHED)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new AppError('Solicitud no encontrada o no disponible', 404, 'NOT_FOUND');
      }
      throw new AppError(`Error al obtener detalle de la solicitud: ${error.message}`, 500, 'DB_ERROR');
    }

    return {
      id: data.id,
      cliente: {
        nombre: data.profiles?.first_name || '',
        inicial: data.profiles?.last_name ? data.profiles.last_name.charAt(0) + '.' : ''
      },
      categoria: data.category_id,
      titulo: data.title,
      descripcion: data.description,
      cuestionario: {
        tieneMateriales: data.has_materials,
        esUrgencia: data.is_emergency,
        cuandoLoNecesita: data.date_preference
      },
      ubicacion: data.address ? `${data.neighborhood || ''}, ${data.city || ''}` : '',
      horarioPreferencia: data.time_preference, // O de algun metadata
      imagenesUrl: data.request_photos?.map(p => p.storage_path) || []
    };
  }
}

export default new MarketplaceService();
