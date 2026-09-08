import dotenv from 'dotenv';

// 1. Cargar variables de entorno lo antes posible
dotenv.config();

// 2. Importar la aplicación de Express (ya configurada)
import app from './src/app.js';

// 3. Definir el puerto y arrancar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor inicializado y corriendo en http://localhost:${PORT}`);
});
