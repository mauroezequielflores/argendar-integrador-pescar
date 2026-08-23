/**
 * Clase base para errores operativos de la aplicación
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error 400 - Solicitud Incorrecta / Validación fallida
 */
export class ValidationError extends AppError {
  constructor(message, errors = null) {
    super(message, 400);
    this.errors = errors;
  }
}

/**
 * Error 401 - No Autorizado (Falta de token o credenciales inválidas)
 */
export class UnauthorizedError extends AppError {
  constructor(message = "No autorizado. Inicie sesión para continuar.") {
    super(message, 401);
  }
}

/**
 * Error 403 - Prohibido (Falta de permisos o rol inapropiado)
 */
export class ForbiddenError extends AppError {
  constructor(message = "Acceso denegado. No tiene permisos para esta acción.") {
    super(message, 403);
  }
}

/**
 * Error 404 - Recurso No Encontrado
 */
export class NotFoundError extends AppError {
  constructor(message = "El recurso solicitado no fue encontrado.") {
    super(message, 404);
  }
}

/**
 * Error 409 - Conflicto (Datos duplicados o estado incompatible)
 */
export class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
  }
}
