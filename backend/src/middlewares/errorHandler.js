import { ERROR_CODES } from '../utils/constants.js';

export const errorHandler = (err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message
      }
    });
  }

  console.error('🔥 [Unhandled Error]:', err);

  return res.status(500).json({
    error: {
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: 'Ocurrió un error inesperado en el servidor.'
    }
  });
};
