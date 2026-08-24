/**
 * Middleware para autorización basada en roles (RBAC).
 * Verifica que el rol del usuario autenticado coincida con alguno de los roles permitidos.
 */
export const requireRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    const userRole = req.profile?.role;

    if (!userRole || !rolesPermitidos.includes(userRole)) {
      return res.status(403).json({
        status: "error",
        message: `Acceso restringido. Se requiere uno de los siguientes roles: ${rolesPermitidos.join(', ')}.`
      });
    }

    next();
  };
};
