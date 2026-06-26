import { AppError } from '../utils/errors.js';

/**
 * Middleware global para el manejo centralizado de errores en Express
 */
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Registrar errores inesperados del sistema
  if (!err.isOperational) {
    console.error("ERROR INESPERADO 💥:", err);
  }

  // Responder con formato estandarizado
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(err.errors && { errors: err.errors }), // Inyectar errores de validación si existen
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Mostrar pila en desarrollo
  });
};

/**
 * Envolvedor de funciones asíncronas para evitar bloques try-catch repetitivos
 * @param {Function} fn - Función del controlador asíncrono
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
