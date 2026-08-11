/**
 * Mensajes reutilizables en toda la aplicación.
 */
export const MESSAGES = {
  // Validaciones generales
  REQUIRED: "Este campo es obligatorio.",
  INVALID_EMAIL: "Por favor, ingresá un correo electrónico válido.",
  INVALID_PASSWORD:
    "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.",
  PASSWORDS_DO_NOT_MATCH: "Las contraseñas no coinciden.",
  ACCEPT_TERMS: "Debés aceptar los términos y condiciones.",
  MIN_LENGTH: (n) => `Debe tener al menos ${n} caracteres.`,
  MAX_LENGTH: (n) => `No puede superar los ${n} caracteres.`,

  // Auth
  LOGIN_ERROR: "El correo electrónico o la contraseña son incorrectos.",
  EMAIL_ALREADY_REGISTERED:
    "Este correo electrónico ya está registrado. ¿Deseás iniciar sesión?",
  UNAUTHORIZED: "No tenés permiso para acceder a esta sección.",

  // Éxito
  LOGIN_SUCCESS: "¡Bienvenido de vuelta!",
  REGISTER_SUCCESS: "¡Tu cuenta fue creada exitosamente!",
};
