import { ROLES } from "../../../constants/roles";

/**
 * Mock data - Auth
 * Datos estáticos locales para el desarrollo del módulo de autenticación.
 */

export const DEMO_USERS = {
  [ROLES.CLIENTE]: {
    id: 1,
    name: "Lucía",
    lastName: "González",
    email: "lucia@demo.argendar.com",
    role: ROLES.CLIENTE,
    avatar: null,
  },
  [ROLES.PROFESIONAL]: {
    id: 2,
    name: "Carlos",
    lastName: "Martínez",
    email: "carlos@demo.argendar.com",
    role: ROLES.PROFESIONAL,
    avatar: null,
  },
  [ROLES.ADMINISTRADOR]: {
    id: 3,
    name: "Admin",
    lastName: "Argendar",
    email: "admin@argendar.com",
    role: ROLES.ADMINISTRADOR,
    avatar: null,
  },
};
