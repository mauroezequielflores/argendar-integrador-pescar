/**
 * Mock data para el Dashboard General del Administrador.
 * Contiene métricas globales, actividad del marketplace y actividades recientes.
 */

export const mockDashboardMetrics = {
  usuarios: 0,
  usuariosTrend: [
    { height: 8, color: "#3a3a3a" },
    { height: 16, color: "#4a4a4a" },
    { height: 12, color: "#4a4a4a" },
    { height: 6, color: "#F78736" },
  ],
  solicitudesActivas: 0,
  solicitudesTrend: [
    { height: 3, color: "#3a3a3a" },
    { height: 3, color: "#3a3a3a" },
    { height: 3, color: "#3a3a3a" },
    { height: 4, color: "#4a4a4a" },
  ],
  ofertasRealizadas: 0,
  ofertasTrend: [
    { height: 3, color: "#3a3a3a" },
    { height: 3, color: "#3a3a3a" },
    { height: 3, color: "#3a3a3a" },
    { height: 4, color: "#4a4a4a" },
  ],
  transacciones: 0,
  transaccionesTrend: [
    { height: 3, color: "#3a3a3a" },
    { height: 3, color: "#3a3a3a" },
    { height: 3, color: "#3a3a3a" },
    { height: 4, color: "#4a4a4a" },
  ],
};

export const mockMarketplaceActivity = [
  { x: 0, y: 460 },
  { x: 5, y: 520 },
  { x: 10, y: 490 },
  { x: 15, y: 610 },
  { x: 20, y: 590 },
  { x: 25, y: 720 },
  { x: 30, y: 840 },
];

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
