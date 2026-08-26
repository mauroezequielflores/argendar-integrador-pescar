/**
 * Mock data para el Dashboard General del Administrador.
 * Contiene métricas globales y lista de actividades recientes de usuarios y profesionales.
 */

export const mockDashboardMetrics = {
  usuarios: 0,
  solicitudesActivas: 0,
  ofertasRealizadas: 0,
  transacciones: 0,
};

export const mockRecentActivity = [
  {
    id: 1,
    usuario: "Juan Pérez",
    evento: "Registro de usuario",
    rol: "Cliente",
    tiempo: "Hace 10 min",
    estado: "Confirmado",
    estadoVariant: "success",
  },
  {
    id: 2,
    usuario: "María González",
    evento: "Nueva solicitud de servicio",
    rol: "Cliente",
    tiempo: "Hace 25 min",
    estado: "Publicado/activo",
    estadoVariant: "orange",
  },
  {
    id: 3,
    usuario: "Carlos Martínez",
    evento: "Nuevo turno",
    rol: "Profesional",
    tiempo: "Hace 1 hora",
    estado: "Pendiente",
    estadoVariant: "warning",
  },
  {
    id: 4,
    usuario: "Lucía Fernández",
    evento: "Certificación matriculada",
    rol: "Profesional",
    tiempo: "Hace 3 horas",
    estado: "Confirmado",
    estadoVariant: "success",
  },
  {
    id: 5,
    usuario: "Esteban Quito",
    evento: "Cancelación de servicio",
    rol: "Cliente",
    tiempo: "Hace 5 horas",
    estado: "Rechazado",
    estadoVariant: "error",
  },
];
