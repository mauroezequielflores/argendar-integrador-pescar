import rateLimit from 'express-rate-limit';

/**
 * Limitador de solicitudes para proteger endpoints de autenticación (fuerza bruta / spam)
 * Permite un máximo de 10 peticiones por IP cada 15 minutos.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Límite de 10 peticiones por IP
  message: {
    status: "error",
    message: "Demasiados intentos de autenticación desde esta IP. Por favor, intente de nuevo en 15 minutos."
  },
  standardHeaders: true, // Retorna info del límite en las cabeceras `RateLimit-*`
  legacyHeaders: false, // Deshabilita las cabeceras `X-RateLimit-*`
});
