import { ValidationError } from '../utils/errors.js';

export const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    const errorMessage = error.errors ? error.errors[0].message : 'Error de validación';
    return next(new ValidationError(errorMessage));
  }
};
