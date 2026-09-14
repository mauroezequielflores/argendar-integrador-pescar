import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltan las variables de entorno de Supabase (URL o SERVICE_ROLE_KEY). Revisa tu archivo .env.');
}

// Crear una única instancia de Supabase para reutilizar en todos los servicios
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  realtime: {
    transport: ws,
  },
});

/**
 * Crea un cliente temporal de Supabase.
 * Útil EXCLUSIVAMENTE para métodos de Auth (signUp, signInWithPassword, getUser)
 * que mutan el estado interno de sesión del cliente, evitando contaminar el singleton global.
 */
export const createThrowawayClient = () => {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    realtime: { transport: ws }
  });
};
