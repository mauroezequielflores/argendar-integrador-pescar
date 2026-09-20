/**
 * reports.constants.js — Constantes de la feature de Consultas / Bandeja de Consultas.
 */

export const INQUIRY_STATES = {
  PENDING: "PENDIENTE",
  ANSWERED: "RESPONDIDA",
};

export const TABLE_COLUMNS = [
  { key: "fecha", label: "FECHA", className: "w-32" },
  { key: "usuario", label: "USUARIO", className: "w-56" },
  { key: "rol", label: "ROL", className: "w-28" },
  { key: "asunto", label: "ASUNTO" },
  { key: "estado", label: "ESTADO", className: "w-32 text-right" },
];
