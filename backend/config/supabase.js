import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Nos aseguramos de configurar dotenv si no fue configurado globalmente
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "CRITICAL CONFIGURATION ERROR: SUPABASE_URL or SUPABASE_ANON_KEY is missing in the environment variables."
  );
}

// Polyfill para WebSocket en entornos de Node sin soporte nativo (ej: Node 20)
// Esto evita errores de inicialización del módulo Realtime de Supabase
if (typeof global.WebSocket === 'undefined') {
  global.WebSocket = class WebSocket {};
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
