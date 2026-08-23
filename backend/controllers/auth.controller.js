import { registerUser, loginUser, getCurrentUserProfile, forgotPassword, resetPassword } from '../services/auth.service.js';

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

    const errMsg = error.message || "";
    if (errMsg.includes("already registered") || errMsg.includes("User already exists") || errMsg.includes("registered")) {
      statusCode = 409; // 409 Conflict
      message = "El correo electrónico ya está registrado.";
    } else if (error.status && error.status < 500) {
      statusCode = error.status;
      message = error.message;
    } else if (errMsg.includes("weak_password") || errMsg.includes("password")) {
      statusCode = 400;
      message = "La contraseña proporcionada es muy débil o inválida.";
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
    let message = "Email o contraseña incorrectos.";

    const errMsg = error.message || "";
    if (errMsg.includes("invalid") || errMsg.includes("credentials") || error.status === 400) {
      statusCode = 401;
      message = "Email o contraseña incorrectos.";
    } else if (error.status && error.status >= 500) {
      statusCode = 500;
      message = "Ocurrió un error interno del servidor al iniciar sesión.";
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

    // Cumplimos con la arquitectura de capas llamando a la capa de servicio
    const perfil = await getCurrentUserProfile(req.user.id);

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
      message: "Error interno al recuperar los datos del usuario."
    });
  }
}

/**
 * Controlador para solicitar recuperación de contraseña.
 *
 * Recibe el email del usuario y solicita a Supabase el envío del enlace de recuperación.
 * Por seguridad, SIEMPRE responde con el mismo mensaje 200, sin importar si el email
 * existe o no en la base de datos. Esto evita que un atacante pueda enumerar emails.
 *
 * Solo devuelve 500 si hay un error interno real de Supabase (problemas de red, config, etc.).
 */
export async function solicitarRecuperacion(req, res) {
  const { email } = req.body;

  try {
    await forgotPassword(email);

    return res.status(200).json({
      status: "success",
      message: "Si existe una cuenta asociada al correo, se enviará un enlace de recuperación."
    });
  } catch (error) {
    console.error("Error en solicitarRecuperacion controller:", error);

    return res.status(500).json({
      status: "error",
      message: "Ocurrió un error interno al procesar la solicitud."
    });
  }
}

/**
 * Controlador para restablecer la contraseña usando el token de recuperación.
 *
 * Recibe el token (que el usuario obtuvo del enlace en su email), la nueva contraseña
 * y la confirmación. La validación de que ambas contraseñas coincidan ya se hizo
 * en el middleware validarResetPassword.
 *
 * Errores posibles:
 * - 401: token inválido o expirado (Supabase rechaza la sesión temporal)
 * - 500: error interno del servidor
 */
export async function restablecerPassword(req, res) {
  const { token, password } = req.body;

  try {
    await resetPassword(token, password);

    return res.status(200).json({
      status: "success",
      message: "La contraseña fue actualizada correctamente."
    });
  } catch (error) {
    console.error("Error en restablecerPassword controller:", error);

    const errMsg = error.message || "";

    // Token inválido, expirado o sesión no válida
    if (errMsg.includes("invalid") || errMsg.includes("expired") || errMsg.includes("session") || error.status === 401 || error.status === 403) {
      return res.status(401).json({
        status: "error",
        message: "El enlace de recuperación es inválido o ha expirado. Solicitá uno nuevo."
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Ocurrió un error interno al restablecer la contraseña."
    });
  }
}
