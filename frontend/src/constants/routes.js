/**
 * Rutas de la aplicación Argendar.
 * Centralizar todas las rutas aquí para facilitar el mantenimiento.
 */
export const ROUTES = {
  // Auth
  LOGIN: "/login",
  ROLE_SELECTION: "/role",
  REGISTER_CLIENT: "/register/client",
  REGISTER_PROFESSIONAL: "/register/professional",

  // Cliente
  CLIENT_HOME: "/client/home",
  CLIENT_AGENDA: "/client/agenda",
  CLIENT_NOTIFICATIONS: "/client/notifications",
  CLIENT_INBOX: "/client/inbox",
  CLIENT_MARKETPLACE: "/client/marketplace",
  CLIENT_PROFILE: "/client/profile",
  CLIENT_SETTINGS: "/client/settings",
  CLIENT_HELP: "/client/help",

  // Profesional
  PROFESSIONAL_HOME: "/professional/home",
  PROFESSIONAL_AGENDA: "/professional/agenda",
  PROFESSIONAL_NOTIFICATIONS: "/professional/notifications",
  PROFESSIONAL_INBOX: "/professional/inbox",
  PROFESSIONAL_MARKETPLACE: "/professional/marketplace",
  PROFESSIONAL_PROFILE: "/professional/profile",
  PROFESSIONAL_SETTINGS: "/professional/settings",
  PROFESSIONAL_HELP: "/professional/help",

  // Administrador
  ADMIN_HOME: "/admin/home",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_TRANSACTIONS: "/admin/transactions",
  ADMIN_MODERATION: "/admin/moderation",
  ADMIN_INBOX: "/admin/inbox",
  ADMIN_PROFESSIONALS: "/admin/professionals",
  ADMIN_CLIENTS: "/admin/clients",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_SETTINGS: "/admin/settings",
};
