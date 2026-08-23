/**
 * Mock data — Marketplace (Profesional)
 * Reemplazar con llamadas reales al backend cuando esté disponible.
 */

export const mockSolicitudes = [
  {
    id: 1,
    titulo: "Reparación de cañería rota",
    descripcion: "Se rompió una cañería debajo de la pileta de la cocina. Necesito solución urgente.",
    categoria: "Plomería",
    ubicacion: "Av. Corrientes 1234, CABA",
    fecha: "2026-08-20",
    cliente: "Lucía M.",
  },
  {
    id: 2,
    titulo: "Instalación eléctrica en living",
    descripcion: "Necesito instalar 3 tomas corriente nuevas y un interruptor en el living.",
    categoria: "Electricidad",
    ubicacion: "Calle Florida 456, CABA",
    fecha: "2026-08-21",
    cliente: "Roberto S.",
  },
  {
    id: 3,
    titulo: "Mantenimiento de aire acondicionado",
    descripcion: "El equipo de frío no enfría bien, necesita limpieza y carga de gas.",
    categoria: "Frigorista",
    ubicacion: "Av. Santa Fe 789, CABA",
    fecha: "2026-08-22",
    cliente: "Ana G.",
  },
];

export const CATEGORIAS = ["Plomería", "Electricidad", "Frigorista"];

export const UBICACION_ACTUAL = "Av. Corrientes 1234, CABA";
