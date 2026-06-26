import { registerUser, loginUser } from '../services/auth.service.js';
import { getUserProfileById } from '../models/userModel.js';

/**
 * Controlador para registrar un nuevo usuario
 */
export async function registrar(req, res) {
  const { nombre, apellido, email, password } = req.body;

  try {
    const result = await registerUser({ nombre, apellido, email, password });

    return res.status(201).json({
      status: "success",
      message: "Usuario registrado con éxito.",
      data: result
    });
  } catch (error) {
    console.error("Error en registrar controller:", error);
    
    let statusCode = 500;
    let message = "Ocurrió un error interno al registrar el usuario.";

    if (error.message.includes("already registered") || error.message.includes("User already exists")) {
      statusCode = 400;
      message = "El correo electrónico ya está registrado.";
    } else if (error.message) {
      statusCode = 400;
      message = error.message;
    }

    return res.status(statusCode).json({
      status: "error",
      message
    });
  }
}

/**
 * Controlador para iniciar sesión
 */
export async function iniciarSesion(req, res) {
  const { email, password } = req.body;

  try {
    const result = await loginUser({ email, password });

    return res.status(200).json({
      status: "success",
      message: "Sesión iniciada con éxito.",
      data: result,
      accessToken: result.session?.accessToken
    });
  } catch (error) {
    console.error("Error en iniciarSesion controller:", error);

    let statusCode = 401;
    let message = "Credenciales incorrectas o inválidas.";

    if (error.message.includes("invalid login credentials") || error.message.includes("Invalid login credentials")) {
      statusCode = 401;
      message = "Email o contraseña incorrectos.";
    } else if (error.message) {
      statusCode = 400;
      message = error.message;
    }

    return res.status(statusCode).json({
      status: "error",
      message
    });
  }
}

/**
 * Controlador para obtener los datos del usuario actual autenticado
 */
export async function obtenerUsuarioActual(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "No autorizado. Sesión de usuario no encontrada."
      });
    }

    const perfil = await getUserProfileById(req.user.id);

    return res.status(200).json({
      status: "success",
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
          nombre: perfil?.nombre || req.user.user_metadata?.nombre || '',
          apellido: perfil?.apellido || req.user.user_metadata?.apellido || '',
          created_at: req.user.created_at || perfil?.created_at
        }
      }
    });
  } catch (error) {
    console.error("Error en obtenerUsuarioActual controller:", error);
    return res.status(500).json({
      status: "error",
      message: "Error al recuperar los datos del usuario.",
      details: error.message || error
    });
  }
}
