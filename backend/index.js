// 1. Cargar las variables del archivo .env inmediatamente antes de evaluar otros módulos
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import turnoRoutes from './routes/turnoRoutes.js';
import authRoutes from './routes/auth.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rutas de la API v1
app.use('/api/v1/turnos', turnoRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);

// Endpoint base de chequeo
app.get('/', (req, res) => {
  res.json({ message: "Servidor de Argendar activo" });
});

// Endpoint de ejemplo para el equipo
app.get('/api/v1/ejemplo', (req, res) => {
  res.json({
    status: "ok",
    data: {
      proyecto: "Argendar",
      mensaje: "¡Conexión exitosa entre React, Docker y Express!",
      integrantes: 9
    }
  });
});



// Middleware Global de Manejo de Errores (Express Error Handler)
app.use((err, req, res, next) => {
  console.error("[Global Error Handler]:", err.stack || err.message || err);
  
  const status = err.status || 500;
  const message = status === 500 
    ? "Ocurrió un error interno en el servidor." 
    : err.message;

  return res.status(status).json({
    status: "error",
    message
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}

export default app;