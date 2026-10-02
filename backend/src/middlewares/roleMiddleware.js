import { AppError } from '../utils/errors.js';

export const requireRole = (allowedRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== allowedRole) {
      console.error(`[ROLE MIDDLEWARE] 403 Forbidden. Expected role: ${allowedRole}. Actual user:`, req.user);
      return next(new AppError('Acceso no autorizado', 403));
    }
    next();
  };
};
