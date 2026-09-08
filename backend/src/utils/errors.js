import { ERROR_CODES } from './constants.js';

export class AppError extends Error {
  constructor(message, statusCode, code = ERROR_CODES.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, ERROR_CODES.VALIDATION_ERROR);
  }
}

export class ConflictError extends AppError {
  constructor(message, code = ERROR_CODES.USER_ALREADY_EXISTS) {
    super(message, 409, code);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado') {
    super(message, 401, ERROR_CODES.UNAUTHORIZED);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404, ERROR_CODES.NOT_FOUND);
  }
}
