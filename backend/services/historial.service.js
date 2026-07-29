import { supabaseAdmin } from '../config/supabase.js';

/**
 * Registra un intento de inicio de sesión exitoso en public.historial_dispositivos
 * Utiliza el Service Role Key del backend (hace bypass de RLS para escritura)
 */
export async function registrarHistorialDispositivo({ userId, ipAddress, userAgent }) {
  if (!userId) return null;

  try {
    const { data, error } = await supabaseAdmin
      .from('historial_dispositivos')
      .insert({
        user_id: userId,
        ip_address: ipAddress || 'IP desconocida',
        user_agent: userAgent || 'Navegador/Dispositivo desconocido',
        login_time: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("[Historial Dispositivos Error]:", error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error("[Historial Dispositivos Excepción]:", error.message || error);
    return null;
  }
}

/**
 * Obtiene los registros de dispositivos del usuario
 */
export async function obtenerHistorialPorUsuario(userId) {
  try {
    const { data, error } = await supabaseAdmin
      .from('historial_dispositivos')
      .select('*')
      .eq('user_id', userId)
      .order('login_time', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("[Obtener Historial Error]:", error.message || error);
    throw error;
  }
}
