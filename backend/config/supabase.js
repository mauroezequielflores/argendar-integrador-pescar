import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Nos aseguramos de configurar dotenv si no fue configurado globalmente
dotenv.config();

// Polyfill para WebSocket en entornos de Node sin soporte nativo (ej: Node 20)
// Esto evita errores de inicialización del módulo Realtime de Supabase
if (typeof global.WebSocket === 'undefined') {
  global.WebSocket = class WebSocket {};
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERROR: Falta configurar SUPABASE_URL o SUPABASE_ANON_KEY en backend/.env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
