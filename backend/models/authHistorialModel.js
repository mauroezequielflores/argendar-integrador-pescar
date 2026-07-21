import { supabase } from "../config/supabase.js";

/**
 * Registra un nuevo evento de inicio de sesión en la tabla de auditoría
 */
export async function registrarHistorialSesion({ usuarioId, ip, dispositivo }) {
  try {
    const { data, error } = await supabase
      .from("historial_sesiones")
      .insert([
        {
          usuario_id: usuarioId,
          ip_address: ip,
          user_agent: dispositivo,
          fecha_login: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      if (error.code === "42P01") {
        console.warn(
          "Tabla 'historial_sesiones' no encontrada. Simulando guardado.",
        );
        return { status: "simulado", usuarioId, ip, dispositivo };
      }
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error(
      "Error al registrar historial de sesión:",
      error.message || error,
    );
    return null;
  }
}

/**
 * Obtiene el historial de inicios de sesión de un usuario
 */
export async function getHistorialByUsuario(usuarioId) {
  try {
    const { data, error } = await supabase
      .from("historial_sesiones")
      .select("*")
      .eq("usuario_id", usuarioId)
      .order("fecha_login", { ascending: false });

    if (error) {
      if (error.code === "42P01") {
        console.warn(
          "Tabla 'historial_sesiones' no encontrada. Retornando datos simulados.",
        );
        return getMockHistorial(usuarioId);
      }
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error al consultar historial:", error.message || error);
    return getMockHistorial(usuarioId);
  }
}

function getMockHistorial(usuarioId) {
  return [
    {
      id: "h1",
      usuario_id: usuarioId,
      ip_address: "192.168.1.15",
      user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      fecha_login: new Date().toISOString(),
    },
  ];
}
