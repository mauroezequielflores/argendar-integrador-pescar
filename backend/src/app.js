import express from 'express';
import cors from 'cors';
import { supabase } from './config/supabase.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// --- Middlewares Globales ---
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// --- Rutas de la API ---
app.use('/api/v1/auth', authRoutes);

// --- Rutas de Diagnóstico (Pruebas iniciales) ---
// NOTA: Más adelante, las rutas de la aplicación se separarán en la carpeta src/routes/
// y la lógica irá a controllers/ y services/ respetando la arquitectura de 3 capas.

// 1. Verificar que el servidor funciona
app.get('/', (req, res) => {
  res.status(200).json({ message: '¡El backend de Argendar está corriendo perfectamente!' });
});

// 2. Verificar la conexión a Supabase
app.get('/test-db', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);

    if (error) {
       // Si el error es de que la tabla no existe, significa que logramos conectar.
       return res.status(200).json({ 
         message: '¡Conectado a Supabase exitosamente! (La tabla "users" no existe aún, lo cual es normal)',
         details: error.message
       });
    }

    res.status(200).json({ message: '¡Conectado a Supabase exitosamente y se encontró la tabla!', data });
  } catch (err) {
    console.error('Error al conectar a Supabase:', err.message);
    res.status(500).json({ error: 'Hubo un problema de conexión con Supabase', details: err.message });
  }
});

// --- Middleware Global de Errores ---
app.use(errorHandler);

export default app;
