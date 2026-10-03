import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';
import { REQUEST_STATUS } from '../utils/constants.js';

class MarketplaceService {
  async getRequests(professionalId, filters) {
    const { search, categories, withinRadius, page = 1, limit = 20 } = filters;
    const offset = (page - 1) * limit;
    
    const categoriesArray = categories ? categories.split(',').map(c => c.trim()) : null;
    const isWithinRadius = withinRadius === 'true' || withinRadius === true;

    // Usar la función RPC para filtrar por radio usando la fórmula de Haversine en la base de datos
    const { data, count, error } = await supabase.rpc('get_marketplace_requests', {
      p_professional_id: professionalId,
      p_limit: limit,
      p_offset: offset,
      p_search: search || null,
      p_categories: categoriesArray,
      p_within_radius: isWithinRadius,
      p_sort: filters.sort || 'newest'
    }, { count: 'exact' });

    if (error) {
      throw new AppError(`Error al obtener solicitudes: ${error.message}`, 500, 'DB_ERROR');
    }

    const processedData = (data || []).map(req => ({
      id: req.request_id,
      titulo: req.title,
      descripcion: req.description,
      categoria: req.category_name || 'General',
      ubicacion: [req.neighborhood, req.city].filter(Boolean).join(', '),
      distanciaKm: req.distance_km ? Number(req.distance_km).toFixed(1) : null,
      isOutOfRange: req.is_out_of_range || false,
      fecha: req.created_at,
      foto: req.client_avatar_url || null,
      cliente: `${req.client_first_name} ${req.client_last_name ? req.client_last_name.charAt(0) + '.' : ''}`.trim() || 'Cliente',
      cuestionario: {
        cuandoLoNecesita: req.date_preference || 'flexible'
      }
    }));

    return {
      data: processedData,
      meta: {
        totalCount: count || processedData.length, // Si la BD no soporta exact count en este RPC, mandamos longitud
        page: Number(page),
        limit: Number(limit),
        totalPages: count ? Math.ceil(count / limit) : (processedData.length === limit ? Number(page) + 1 : Number(page))
      }
    };
  }

  async getRequestById(professionalId, id) {
    // Para el detalle también podríamos validar que el cliente no sea el mismo, 
    // pero la UI lo oculta.
    const { data, error } = await supabase
      .from('requests')
      .select('*, profiles(first_name, last_name, avatar_url), request_photos(storage_path), service_categories!inner(name)')
      .eq('id', id)
      .eq('status', REQUEST_STATUS.PUBLISHED)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new AppError('Solicitud no encontrada o no disponible', 404, 'NOT_FOUND');
      }
      throw new AppError(`Error al obtener detalle de la solicitud: ${error.message}`, 500, 'DB_ERROR');
    }

    // Verificar si el profesional ya hizo una oferta para esta solicitud
    const { data: existingOffer } = await supabase
      .from('offers')
      .select('id')
      .eq('request_id', id)
      .eq('professional_id', professionalId)
      .maybeSingle();

    return {
      id: data.id,
      hasOffer: !!existingOffer,
      cliente: {
        nombre: data.profiles?.first_name || '',
        inicial: data.profiles?.last_name ? data.profiles.last_name.charAt(0) + '.' : '',
        foto: data.profiles?.avatar_url || null
      },
      categoria: data.service_categories?.name || 'General',
      titulo: data.title,
      descripcion: data.description,
      cuestionario: {
        tieneMateriales: data.has_materials,
        esUrgencia: data.is_emergency,
        cuandoLoNecesita: data.date_preference,
        antiguedad: data.installation_age
      },
      ubicacion: [data.neighborhood, data.city].filter(Boolean).join(', '),
      horarioPreferencia: data.time_preference, // O de algun metadata
      imagenesUrl: data.request_photos?.map(p => p.storage_path) || []
    };
  }
}

export default new MarketplaceService();
