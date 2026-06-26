import { supabase } from '../config/supabase.js';

/**
 * Middleware para validar el token de Supabase (JWT)
 */
export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: "error",
      message: "No autorizado. Token de autenticación faltante o inválido."
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        status: "error",
        message: "Token inválido o expirado."
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error en authMiddleware:", error);
    return res.status(500).json({
      status: "error",
      message: "Error interno al verificar la autenticación."
    });
  }
};
