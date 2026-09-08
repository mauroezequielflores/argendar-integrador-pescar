import * as authService from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password, role } = req.body;
    
    const user = await authService.registerUser({ nombre, apellido, email, password, role });

    // Respuesta pelada (sin envoltorio `data`) como indica la regla
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const loginData = await authService.loginUser({ email, password });

    return res.status(200).json(loginData);
  } catch (error) {
    next(error);
  }
};
