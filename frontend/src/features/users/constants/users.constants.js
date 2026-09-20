/**
 * users.constants.js — Constantes de la feature de Gestión de Usuarios.
 */

export const USERS_TABS = [
  { id: "profesionales", label: "Profesionales" },
  { id: "clientes", label: "Clientes" },
  { id: "administradores", label: "Administradores" },
];

export const USER_STATES = {
  ACTIVO: "Activo",
  SUSPENDIDO: "Suspendido",
  ELIMINADO: "Eliminado",
};

export const TAB_CONFIG = {
  profesionales: {
    singularLabel: "profesional",
    pluralLabel: "profesionales",
    searchPlaceholder: "Buscar profesional por número de orden...",
    emptyTitle: "No hay profesionales registrados",
    emptyDescription: "No encontramos usuarios para mostrar en este momento.",
  },
  clientes: {
    singularLabel: "cliente",
    pluralLabel: "clientes",
    searchPlaceholder: "Buscar cliente por número de orden...",
    emptyTitle: "No hay clientes registrados",
    emptyDescription: "No encontramos usuarios para mostrar en este momento.",
  },
  administradores: {
    singularLabel: "administrador",
    pluralLabel: "administradores",
    searchPlaceholder: "Buscar administrador por número de orden...",
    emptyTitle: "No hay administradores registrados",
    emptyDescription: "No encontramos usuarios para mostrar en este momento.",
  },
};
