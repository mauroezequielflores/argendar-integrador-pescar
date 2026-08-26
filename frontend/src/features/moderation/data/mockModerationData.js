/**
 * Mock de datos para la pantalla de Moderación del Administrador.
 *
 * Cada panel (solicitudes, ofertas, calificaciones, turnos) tiene su propio array.
 * Estado inicial vacío para reflejar la captura de diseño (empty state).
 * Descomenta los items de ejemplo para probar la vista con tarjetas.
 */

export const MODERATION_STATES = {
  ACTIVE: "Activo",
  DISABLED: "Desactivado",
  DELETED: "Eliminado",
};

// ---------- Solicitudes ----------
export const mockSolicitudes = [
  {
    id: "ORD-00125",
    titulo: "Solicitud de reparación de instalación eléctrica",
    descripcion: "El cliente solicita revisión y reparación de una instalación eléctrica domiciliaria.",
    usuario: "Juan Pérez",
    tipoUsuario: "Cliente",
    estado: MODERATION_STATES.ACTIVE,
  },
  {
    id: "ORD-00130",
    titulo: "Plomería urgente - pérdida de agua",
    descripcion: "El cliente reporta una pérdida de agua en la cocina que requiere atención inmediata.",
    usuario: "María González",
    tipoUsuario: "Cliente",
    estado: MODERATION_STATES.ACTIVE,
  },
];

// ---------- Ofertas ----------
export const mockOfertas = [
  {
    id: "ORD-00080",
    titulo: "Oferta de servicio de electricidad residencial",
    descripcion: "Profesional ofrece instalaciones eléctricas, revisiones y certificaciones.",
    usuario: "Carlos Martínez",
    tipoUsuario: "Profesional",
    estado: MODERATION_STATES.ACTIVE,
  },
];

// ---------- Calificaciones ----------
export const mockCalificaciones = [
  {
    id: "ORD-00045",
    titulo: "Calificación 5 estrellas - Plomería",
    descripcion: "Excelente trabajo, puntual y muy prolijo. Lo recomiendo totalmente.",
    usuario: "Lucía Fernández",
    tipoUsuario: "Cliente",
    estado: MODERATION_STATES.ACTIVE,
  },
];

// ---------- Turnos ----------
export const mockTurnos = [
  {
    id: "ORD-00210",
    titulo: "Turno confirmado - Gasista matriculado",
    descripcion: "Revisión de instalación de gas natural en departamento.",
    usuario: "Pedro Álvarez",
    tipoUsuario: "Profesional",
    estado: MODERATION_STATES.ACTIVE,
  },
];
