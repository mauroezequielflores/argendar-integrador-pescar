/**
 * Validador para el registro de usuarios
 */
export const validarRegistro = (req, res, next) => {
  const { nombre, apellido, email, password } = req.body;

  if (!nombre || nombre.trim().length === 0) {
    return res.status(400).json({
      status: "error",
      message: "El campo 'nombre' es obligatorio."
    });
  }

  if (!apellido || apellido.trim().length === 0) {
    return res.status(400).json({
      status: "error",
      message: "El campo 'apellido' es obligatorio."
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      status: "error",
      message: "El campo 'email' debe ser una dirección de correo válida."
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      status: "error",
      message: "El campo 'password' debe tener al menos 6 caracteres."
    });
  }

  next();
};

/**
 * Validador para el inicio de sesión
 */
export const validarLogin = (req, res, next) => {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      status: "error",
      message: "Debe proporcionar una dirección de correo válida para iniciar sesión."
    });
  }

  if (!password || password.trim().length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Debe proporcionar su contraseña para iniciar sesión."
    });
  }

  next();
};

/**
 * Validador para solicitar recuperación de contraseña
 */
export const validarForgotPassword = (req, res, next) => {
  const { email } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      status: "error",
      message: "Debe proporcionar una dirección de correo válida."
    });
  }

  next();
};

/**
 * Validador para restablecer contraseña con token
 */
export const validarResetPassword = (req, res, next) => {
  const { token, password, confirmPassword } = req.body;

  if (!token || token.trim().length === 0) {
    return res.status(400).json({
      status: "error",
      message: "El token de recuperación es obligatorio."
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      status: "error",
      message: "La nueva contraseña debe tener al menos 6 caracteres."
    });
  }

  if (!confirmPassword || confirmPassword !== password) {
    return res.status(400).json({
      status: "error",
      message: "Las contraseñas no coinciden."
    });
  }

  next();
};
