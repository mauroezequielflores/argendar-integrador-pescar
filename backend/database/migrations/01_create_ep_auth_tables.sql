-- ============================================================================
-- MIGRACIÓN DEFINITIVA Y OPTIMIZADA: Épica de Registro y Autenticación (EP-AUTH)
-- Proyecto: Argendar
-- Tablas canónicas: profiles, professional_profiles (Columnas en Español)
-- Limpieza: Elimina tabla redundante/obsoleta 'usuarios'
-- Tipos: user_role ('client', 'professional', 'admin')
-- Políticas: Row Level Security (RLS)
-- Índices: Índices B-Tree optimizados para consultas y JOINs frecuentes
-- ============================================================================

-- 0. LIMPIEZA DE TABLA REDUNDANTE
-- La tabla 'usuarios' era un prototipo inicial. La arquitectura oficial se basa
-- exclusivamente en 'profiles' vinculada 1:1 con 'auth.users(id)'.
DROP TABLE IF EXISTS public.usuarios CASCADE;

-- 1. Crear tipo ENUM para roles de usuario si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('client', 'professional', 'admin');
    END IF;
END$$;

-- 2. Crear función helper para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Crear tabla public.profiles
-- Vinculada 1:1 con auth.users mediante id (UUID)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    rol user_role NOT NULL DEFAULT 'client',
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    esta_suspendido BOOLEAN NOT NULL DEFAULT false,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- ÍNDICES DE ALTO RENDIMIENTO EN public.profiles
-- ============================================================================
-- 1. Optimización para filtrado por rol (clientes vs profesionales vs admins)
CREATE INDEX IF NOT EXISTS idx_profiles_rol ON public.profiles(rol);

-- 2. Optimización para validación de estado activo en authMiddleware y login
CREATE INDEX IF NOT EXISTS idx_profiles_esta_suspendido ON public.profiles(esta_suspendido);

-- 3. Índice compuesto para consultas combinadas de usuarios activos por rol
CREATE INDEX IF NOT EXISTS idx_profiles_rol_suspendido ON public.profiles(rol, esta_suspendido);

-- 4. Índice para ordenamiento cronológico de usuarios
CREATE INDEX IF NOT EXISTS idx_profiles_fecha_creacion ON public.profiles(fecha_creacion DESC);

-- Trigger de fecha_actualizacion para profiles
DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Crear tabla public.professional_profiles
-- Vinculada 1:1 con public.profiles mediante usuario_id (UUID)
CREATE TABLE IF NOT EXISTS public.professional_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    descripcion TEXT,
    onboarding_completo BOOLEAN NOT NULL DEFAULT false,
    calificacion_promedio NUMERIC(3,2) NOT NULL DEFAULT 0.00 CHECK (calificacion_promedio >= 0 AND calificacion_promedio <= 5),
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- ÍNDICES DE ALTO RENDIMIENTO EN public.professional_profiles
-- ============================================================================
-- 1. Clave foránea indexada para JOINs O(1) ultra-rápidos entre profiles y professional_profiles
CREATE INDEX IF NOT EXISTS idx_professional_profiles_usuario_id ON public.professional_profiles(usuario_id);

-- 2. Optimización para filtrado de profesionales habilitados en el feed y búsquedas
CREATE INDEX IF NOT EXISTS idx_professional_profiles_onboarding ON public.professional_profiles(onboarding_completo);

-- 3. Optimización para ordenamiento por reputación en el marketplace
CREATE INDEX IF NOT EXISTS idx_professional_profiles_calificacion ON public.professional_profiles(calificacion_promedio DESC);

-- Trigger de fecha_actualizacion para professional_profiles
DROP TRIGGER IF EXISTS tr_prof_profiles_updated_at ON public.professional_profiles;
CREATE TRIGGER tr_prof_profiles_updated_at
    BEFORE UPDATE ON public.professional_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 5. POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS en profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios autenticados solo pueden leer su propio perfil (auth.uid() = id)
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

-- Política: Los usuarios autenticados pueden actualizar su propio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Política: Inserción de perfil permitido para el usuario autenticado (auth.uid() = id)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Habilitar RLS en professional_profiles
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;

-- Política: Lectura de perfiles profesionales (pública para profesionales con onboarding o para el dueño)
DROP POLICY IF EXISTS "Professionals or public can view professional profiles" ON public.professional_profiles;
CREATE POLICY "Professionals or public can view professional profiles"
    ON public.professional_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = usuario_id OR onboarding_completo = true);

-- Política: Solo el profesional dueño puede actualizar su registro profesional
DROP POLICY IF EXISTS "Professionals can update own professional profile" ON public.professional_profiles;
CREATE POLICY "Professionals can update own professional profile"
    ON public.professional_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = usuario_id)
    WITH CHECK (auth.uid() = usuario_id);

-- Política: Inserción de perfil profesional para el usuario dueño
DROP POLICY IF EXISTS "Professionals can insert own professional profile" ON public.professional_profiles;
CREATE POLICY "Professionals can insert own professional profile"
    ON public.professional_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = usuario_id);

-- ============================================================================
-- 6. PERMISOS Y PRIVILEGIOS DE ACCESO (GRANTS)
-- ============================================================================
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.professional_profiles TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
