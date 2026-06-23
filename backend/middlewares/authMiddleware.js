/**
 * Middleware para simular la validación del token de Supabase
 */
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: "error",
      message: "No autorizado. Token de autenticación faltante o inválido."
    });
  }

  const token = authHeader.split(' ')[1];

  // Simulación: Validamos que el token no esté vacío o sea un token simulado 'argendar-token-valido'
  if (!token || token.length < 10) {
    return res.status(401).json({
      status: "error",
      message: "Token inválido o expirado."
    });
  }

  // Simulación de guardar los datos del usuario decodificados en la request
  req.user = {
    id: "user-simulated-id",
    role: "authenticated"
  };

  next();
};
