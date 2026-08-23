/**
 * Mock data — Mi Perfil (Profesional)
 * Reemplazar con llamadas reales al backend cuando esté disponible.
 */

export const mockProfessionalProfile = {
  firstName: "Carlos",
  lastName: "Martínez",
  titulo: "Electricista matriculado",
  isOnline: true,
  memberSince: "Enero 2021",
  ubicacionBase: "-",
  radioCobertura: "-",
  descripcion: "Descripción pendiente.",
  // CA04: habilidades ocultas si el array está vacío
  habilidades: [],
  // CA06: disponibilidad oculta si es null; mostrada si existe (aunque esté vacía)
  disponibilidad: { horarios: [] },
  certificaciones: [{ nombre: "Matrícula" }],
  rating: 0.0,
  reviewsCount: 0,
  reviews: [],
  // Porcentaje de completitud del perfil (0-100)
  completitudPerfil: 0,
};
