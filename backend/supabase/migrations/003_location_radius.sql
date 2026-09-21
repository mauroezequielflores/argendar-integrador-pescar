-- MIGRATION 003: Location & Radius Filtering

-- 1. Agregar latitude y longitude a PROFILES si no existen
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='latitude') THEN
        ALTER TABLE public.profiles ADD COLUMN latitude numeric;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='longitude') THEN
        ALTER TABLE public.profiles ADD COLUMN longitude numeric;
    END IF;
END $$;

-- 2. Asegurarse de que professional_profiles tenga coverage_radius_km y latitude/longitude si hiciera falta.
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='professional_profiles' AND column_name='coverage_radius_km') THEN
        ALTER TABLE public.professional_profiles ADD COLUMN coverage_radius_km numeric DEFAULT 10;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='professional_profiles' AND column_name='latitude') THEN
        ALTER TABLE public.professional_profiles ADD COLUMN latitude numeric;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='professional_profiles' AND column_name='longitude') THEN
        ALTER TABLE public.professional_profiles ADD COLUMN longitude numeric;
    END IF;
END $$;

-- 3. Crear Función de Haversine para calcular distancia (Devuelve KM)
CREATE OR REPLACE FUNCTION public.calculate_distance(
    lat1 numeric, 
    lon1 numeric, 
    lat2 numeric, 
    lon2 numeric
) 
RETURNS numeric 
LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
    radius_earth numeric := 6371; -- Radio de la tierra en KM
    rad_lat1 numeric;
    rad_lat2 numeric;
    delta_lat numeric;
    delta_lon numeric;
    a numeric;
    c numeric;
BEGIN
    IF lat1 IS NULL OR lon1 IS NULL OR lat2 IS NULL OR lon2 IS NULL THEN
        RETURN NULL;
    END IF;

    -- Convertir a radianes
    rad_lat1 := radians(lat1);
    rad_lat2 := radians(lat2);
    delta_lat := radians(lat2 - lat1);
    delta_lon := radians(lon2 - lon1);

    -- Fórmula de Haversine
    a := sin(delta_lat/2.0)^2 + cos(rad_lat1) * cos(rad_lat2) * sin(delta_lon/2.0)^2;
    c := 2.0 * asin(sqrt(a));
    
    RETURN radius_earth * c;
END;
$$;

-- 4. Crear Función RPC para filtrar Requests por distancia (Marketplace)
-- Devuelve las requests que caen dentro del 'coverage_radius_km' del profesional pasado por parámetro
CREATE OR REPLACE FUNCTION public.get_marketplace_requests(
    p_professional_id uuid,
    p_limit int DEFAULT 20,
    p_offset int DEFAULT 0,
    p_search text DEFAULT NULL,
    p_categories text[] DEFAULT NULL
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
    created_at timestamptz,
    client_first_name text,
    client_last_name text
) 
LANGUAGE plpgsql AS $$
DECLARE
    prof_lat numeric;
    prof_lon numeric;
    prof_radius numeric;
BEGIN
    -- Obtener datos del profesional
    SELECT latitude, longitude, coverage_radius_km 
    INTO prof_lat, prof_lon, prof_radius
    FROM public.professional_profiles
    WHERE profile_id = p_professional_id;

    -- Si el profesional no tiene coordenadas o radio, retorna vacio
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
        r.created_at,
        p.first_name AS client_first_name,
        p.last_name AS client_last_name
    FROM public.requests r
    JOIN public.profiles p ON p.id = r.client_id
    JOIN public.service_categories cat ON cat.id = r.category_id
    WHERE r.status = 'published' -- En MarketplaceService se usa REQUEST_STATUS.PUBLISHED que usualmente es 'published' o 'open'. Hay que usar la de la DB.
      AND r.client_id != p_professional_id 
      AND (p_categories IS NULL OR cat.name = ANY(p_categories))
      AND (p_search IS NULL OR r.title ILIKE '%' || p_search || '%' OR r.description ILIKE '%' || p_search || '%')
      AND r.latitude IS NOT NULL 
      AND r.longitude IS NOT NULL
      AND public.calculate_distance(prof_lat, prof_lon, r.latitude, r.longitude) <= prof_radius
    ORDER BY r.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$;
