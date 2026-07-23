/*verificar que el usuario tenga el rol permitido (admin, profesional, cliente) antes de ejecutar una acción*/

/**
 * Middleware para restringir el acceso a rutas según el rol del usuario
 * @param {Array<string>} rolesPermitidos - Lista de roles autorizados (ej: ['admin', 'profesional'])
 */
export const permitRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    // req.usuario es inyectado previamente por authMiddleware
    const usuarioRole = req.usuario?.rol || req.headers['x-user-role']; 

    if (!usuarioRole) {
      return res.status(401).json({
        status: "fail",
        message: "Acceso no autorizado: No se identificó el rol del usuario."
      });
    }

    if (!rolesPermitidos.includes(usuarioRole)) {
      return res.status(403).json({
        status: "fail",
        message: `Acceso denegado: Se requiere uno de los siguientes roles [${rolesPermitidos.join(', ')}]`
      });
    }

    next();
  };
};