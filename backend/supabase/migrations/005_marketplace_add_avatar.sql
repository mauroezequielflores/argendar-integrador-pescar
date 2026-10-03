-- Eliminar todas las posibles variantes anteriores para evitar conflictos (Postgres overloading)
DROP FUNCTION IF EXISTS public.get_marketplace_requests(uuid, integer, integer, text, text[]);
DROP FUNCTION IF EXISTS public.get_marketplace_requests(uuid, integer, integer, text, text[], boolean);
DROP FUNCTION IF EXISTS public.get_marketplace_requests(uuid, integer, integer, text, text[], boolean, text);

CREATE OR REPLACE FUNCTION public.get_marketplace_requests(
    p_professional_id uuid,
    p_limit int DEFAULT 20,
    p_offset int DEFAULT 0,
    p_search text DEFAULT NULL,
    p_categories text[] DEFAULT NULL,
    p_within_radius boolean DEFAULT false,
    p_sort text DEFAULT 'newest'
)
RETURNS TABLE (
    request_id uuid,
    client_id uuid,
    category_name text,
    title text,
    description text,
    address text,
    neighborhood text,
    city text,
    distance_km numeric,
    is_out_of_range boolean,
    created_at timestamptz,
    client_first_name text,
    client_last_name text,
    client_avatar_url text,
    date_preference text
) 
LANGUAGE plpgsql AS $$
DECLARE
    prof_lat numeric;
    prof_lon numeric;
    prof_radius numeric;
BEGIN
    -- Obtener la ubicación y radio del profesional
    SELECT latitude, longitude, coverage_radius_km 
    INTO prof_lat, prof_lon, prof_radius
    FROM public.professional_profiles
    WHERE profile_id = p_professional_id;

    -- Si el profesional no tiene ubicación, no puede ver el marketplace
    IF prof_lat IS NULL OR prof_lon IS NULL OR prof_radius IS NULL THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT 
        r.id AS request_id,
        r.client_id,
        cat.name AS category_name,
        r.title,
        r.description,
        r.address,
        r.neighborhood,
        r.city,
        public.calculate_distance(prof_lat, prof_lon, r.latitude, r.longitude) AS distance_km,
        (public.calculate_distance(prof_lat, prof_lon, r.latitude, r.longitude) > prof_radius) AS is_out_of_range,
        r.created_at,
        p.first_name AS client_first_name,
        p.last_name AS client_last_name,
        p.avatar_url AS client_avatar_url,
        r.date_preference::text AS date_preference
    FROM public.requests r
    JOIN public.profiles p ON p.id = r.client_id
    JOIN public.service_categories cat ON cat.id = r.category_id
    WHERE r.status = 'open'
      AND r.client_id != p_professional_id 
      AND (p_categories IS NULL OR cat.name = ANY(p_categories))
      AND (p_search IS NULL OR r.title ILIKE '%' || p_search || '%' OR r.description ILIKE '%' || p_search || '%')
      AND r.latitude IS NOT NULL 
      AND r.longitude IS NOT NULL
      AND (
          p_within_radius = false 
          OR public.calculate_distance(prof_lat, prof_lon, r.latitude, r.longitude) <= prof_radius
      )
    ORDER BY 
        CASE WHEN p_sort = 'newest' THEN r.created_at END DESC,
        CASE WHEN p_sort = 'oldest' THEN r.created_at END ASC
    LIMIT p_limit OFFSET p_offset;
END;
$$;
