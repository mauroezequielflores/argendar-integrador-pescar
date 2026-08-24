-- ============================================================================
-- MIGRACIÓN 02: Perfil Profesional, Ubicación Google Maps, Zonas, Rubros y Reseñas
-- Proyecto: Argendar (Épica de Onboarding Profesional y Perfil Público)
-- Tablas: profiles (ampliación), professional_profiles (ampliación),
--         rubros, professional_rubros, zones, professional_zones, resenas
-- ============================================================================

-- 1. Ampliar tabla public.profiles con campos de contacto, avatar y ubicación
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS telefono TEXT,
    ADD COLUMN IF NOT EXISTS avatar_url TEXT,
    ADD COLUMN IF NOT EXISTS ubicacion JSONB;

-- 2. Ampliar tabla public.professional_profiles
ALTER TABLE public.professional_profiles
    ADD COLUMN IF NOT EXISTS ubicacion_base JSONB,
    ADD COLUMN IF NOT EXISTS radio_cobertura_km NUMERIC(5,2) NOT NULL DEFAULT 10.00,
    ADD COLUMN IF NOT EXISTS etiquetas TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS disponibilidad JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS cuit_cuil TEXT,
    ADD COLUMN IF NOT EXISTS matricula_numero TEXT,
    ADD COLUMN IF NOT EXISTS organismo_emisor TEXT,
    ADD COLUMN IF NOT EXISTS jurisdiccion TEXT,
    ADD COLUMN IF NOT EXISTS categoria TEXT,
    ADD COLUMN IF NOT EXISTS certificado_url TEXT,
    ADD COLUMN IF NOT EXISTS tiene_matricula BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS paso1_completo BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS total_resenas INTEGER NOT NULL DEFAULT 0;

-- Restricciones de integridad
ALTER TABLE public.professional_profiles
    DROP CONSTRAINT IF EXISTS chk_radio_cobertura;
ALTER TABLE public.professional_profiles
    ADD CONSTRAINT chk_radio_cobertura
    CHECK (radio_cobertura_km >= 1 AND radio_cobertura_km <= 50);

ALTER TABLE public.professional_profiles
    DROP CONSTRAINT IF EXISTS chk_descripcion_longitud;
ALTER TABLE public.professional_profiles
    ADD CONSTRAINT chk_descripcion_longitud
    CHECK (descripcion IS NULL OR char_length(descripcion) <= 500);

-- 3. Tabla de Rubros Técnicos
CREATE TABLE IF NOT EXISTS public.rubros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icono_url TEXT,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT true,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Tabla Intermedia: professional_rubros
CREATE TABLE IF NOT EXISTS public.professional_rubros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profesional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    rubro_id UUID NOT NULL REFERENCES public.rubros(id) ON DELETE CASCADE,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(profesional_id, rubro_id)
);

-- 5. Tabla de Zonas Geográficas (Barrios / Localidades)
CREATE TABLE IF NOT EXISTS public.zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(name, city, province)
);

-- 6. Tabla Intermedia: professional_zones
CREATE TABLE IF NOT EXISTS public.professional_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    zone_id UUID NOT NULL REFERENCES public.zones(id) ON DELETE CASCADE,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(professional_id, zone_id)
);

-- 7. Tabla de Reseñas y Calificaciones
CREATE TABLE IF NOT EXISTS public.resenas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profesional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
    cliente_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tarea_id UUID,
    calificacion INTEGER NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Función SQL de Distancia Geodésica (Haversine)
CREATE OR REPLACE FUNCTION public.calcular_distancia_km(
    lat1 NUMERIC, lon1 NUMERIC,
    lat2 NUMERIC, lon2 NUMERIC
) RETURNS NUMERIC AS $$
DECLARE
    r CONSTANT NUMERIC := 6371; -- Radio terrestre en km
    dlat NUMERIC;
    dlon NUMERIC;
    a NUMERIC;
    c NUMERIC;
BEGIN
    IF lat1 IS NULL OR lon1 IS NULL OR lat2 IS NULL OR lon2 IS NULL THEN
        RETURN NULL;
    END IF;
    dlat := radians(lat2 - lat1);
    dlon := radians(lon2 - lon1);
    a := sin(dlat/2)^2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)^2;
    c := 2 * atan2(sqrt(a), sqrt(1 - a));
    RETURN ROUND((r * c)::numeric, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 9. Índices de Alto Rendimiento
CREATE INDEX IF NOT EXISTS idx_professional_rubros_prof ON public.professional_rubros(profesional_id);
CREATE INDEX IF NOT EXISTS idx_professional_rubros_rubro ON public.professional_rubros(rubro_id);
CREATE INDEX IF NOT EXISTS idx_professional_zones_prof ON public.professional_zones(professional_id);
CREATE INDEX IF NOT EXISTS idx_professional_zones_zone ON public.professional_zones(zone_id);
CREATE INDEX IF NOT EXISTS idx_resenas_profesional ON public.resenas(profesional_id);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_onboarding ON public.professional_profiles(onboarding_completo);

-- 10. Políticas RLS (Row Level Security)
ALTER TABLE public.rubros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_rubros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resenas ENABLE ROW LEVEL SECURITY;

-- Políticas de Lectura Pública
DROP POLICY IF EXISTS "Rubros visibles para todos" ON public.rubros;
CREATE POLICY "Rubros visibles para todos" ON public.rubros FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Zones visibles para todos" ON public.zones;
CREATE POLICY "Zones visibles para todos" ON public.zones FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Professional rubros visibles" ON public.professional_rubros;
CREATE POLICY "Professional rubros visibles" ON public.professional_rubros FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Professional zones visibles" ON public.professional_zones;
CREATE POLICY "Professional zones visibles" ON public.professional_zones FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Resenas visibles para todos" ON public.resenas;
CREATE POLICY "Resenas visibles para todos" ON public.resenas FOR SELECT TO authenticated, anon USING (true);

-- Modificación de rubros y zonas solo por el profesional dueño
DROP POLICY IF EXISTS "Profesional actualiza sus rubros" ON public.professional_rubros;
CREATE POLICY "Profesional actualiza sus rubros" ON public.professional_rubros
    FOR ALL TO authenticated
    USING (profesional_id IN (SELECT id FROM public.professional_profiles WHERE usuario_id = auth.uid()))
    WITH CHECK (profesional_id IN (SELECT id FROM public.professional_profiles WHERE usuario_id = auth.uid()));

DROP POLICY IF EXISTS "Profesional actualiza sus zonas" ON public.professional_zones;
CREATE POLICY "Profesional actualiza sus zonas" ON public.professional_zones
    FOR ALL TO authenticated
    USING (professional_id IN (SELECT id FROM public.professional_profiles WHERE usuario_id = auth.uid()))
    WITH CHECK (professional_id IN (SELECT id FROM public.professional_profiles WHERE usuario_id = auth.uid()));

-- Inserción de reseñas por clientes autenticados
DROP POLICY IF EXISTS "Clientes pueden insertar resenas" ON public.resenas;
CREATE POLICY "Clientes pueden insertar resenas" ON public.resenas
    FOR INSERT TO authenticated
    WITH CHECK (cliente_id = auth.uid());

-- 11. Seeds Iniciales (Rubros y Zonas)
INSERT INTO public.rubros (nombre, slug, descripcion) VALUES
    ('Electricista', 'electricista', 'Instalaciones eléctricas residenciales y comerciales, tableros y mantenimiento'),
    ('Plomero', 'plomero', 'Cañerías, sanitarios, destapaciones e instalaciones de gas'),
    ('Frigorista', 'frigorista', 'Instalación, mantenimiento y reparación de aire acondicionado y refrigeración')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.zones (name, city, province) VALUES
    ('Caballito', 'CABA', 'Ciudad Autónoma de Buenos Aires'),
    ('Palermo', 'CABA', 'Ciudad Autónoma de Buenos Aires'),
    ('Belgrano', 'CABA', 'Ciudad Autónoma de Buenos Aires'),
    ('Recoleta', 'CABA', 'Ciudad Autónoma de Buenos Aires'),
    ('Almagro', 'CABA', 'Ciudad Autónoma de Buenos Aires'),
    ('Flores', 'CABA', 'Ciudad Autónoma de Buenos Aires'),
    ('Vicente López', 'GBA Norte', 'Buenos Aires'),
    ('San Isidro', 'GBA Norte', 'Buenos Aires'),
    ('San Martín', 'GBA Norte', 'Buenos Aires'),
    ('Avellaneda', 'GBA Sur', 'Buenos Aires'),
    ('Quilmes', 'GBA Sur', 'Buenos Aires'),
    ('Lanús', 'GBA Sur', 'Buenos Aires'),
    ('Ramos Mejía', 'GBA Oeste', 'Buenos Aires'),
    ('Morón', 'GBA Oeste', 'Buenos Aires')
ON CONFLICT (name, city, province) DO NOTHING;

-- 12. Permisos y Privilegios
GRANT ALL ON TABLE public.rubros TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.zones TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.professional_rubros TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.professional_zones TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.resenas TO anon, authenticated, service_role;
