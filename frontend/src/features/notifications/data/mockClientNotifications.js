import {
  BellIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  StarIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

/**
 * Mock data — Notificaciones (Cliente)
 *
 * Los arrays están vacíos por defecto para reflejar el estado inicial y vacío (Empty State)
 * descrito en los criterios de aceptación CA04, CA05 y las capturas de referencia.
 */

export const mockClientNotificaciones = [
  // Dejar vacío por defecto para visualizar el Empty State: "No tenés notificaciones"
  // Ejemplo de estructura para cuando existan notificaciones activas:
  /*
  {
    id: "cn-1",
    titulo: "¡Turno confirmado!",
    descripcion: "El profesional aceptó tu solicitud de servicio.",
    fecha: "HACE 10 MIN",
    timestamp: 1714000000000,
    icon: CheckCircleIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#4CAF50]",
    isNew: true,
    href: "/client/agenda",
  },
  {
    id: "cn-2",
    titulo: "Recordatorio de turno",
    descripcion: "Tenés un turno programado para mañana a las 14:00 hs.",
    fecha: "AYER",
    timestamp: 1713900000000,
    icon: CalendarDaysIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#F78736]",
    isNew: false,
    href: "/client/agenda",
  },
  {
    id: "cn-3",
    titulo: "Pago procesado",
    descripcion: "Se acreditó correctamente el pago de tu servicio.",
    fecha: "HACE 2 DÍAS",
    timestamp: 1713800000000,
    icon: CreditCardIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#3B82F6]",
    isNew: false,
    href: "/client/profile/payment-methods",
  },
  */
];

export const mockClientHeaderNotifications = [
  {
    id: "header-1",
    titulo: "¡Tenés una oferta nueva!",
    descripcion: "Un profesional publicó una nueva oferta a tu solicitud.",
    fecha: "HACE 5 MIN",
    icon: CheckCircleIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#4CAF50]",
    isNew: true,
    href: "/client/agenda",
  },
  {
    id: "header-2",
    titulo: "Pago confirmado",
    descripcion: "Se acreditó correctamente el pago.",
    fecha: "HACE 1 HORA",
    icon: CreditCardIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#3B82F6]",
    isNew: false,
    href: "/client/agenda",
  },
  {
    id: "header-3",
    titulo: "Recordatorio",
    descripcion: "Tenés un turno programado para mañana.",
    fecha: "AYER",
    icon: CalendarDaysIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#F78736]",
    isNew: false,
    href: "/client/agenda",
  },
  {
    id: "header-4",
    titulo: "Turno cancelado",
    descripcion: "El profesional canceló tu turno programado para...",
    fecha: "HACE 2 DÍAS",
    icon: ExclamationTriangleIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#F78736]",
    isNew: false,
    href: "/client/agenda",
  },
  {
    id: "header-5",
    titulo: "¡Ya podés calificar tu turno “Repara...”!",
    descripcion: "Calificá el turno y contanos un poco sobre tu experiencia.",
    fecha: "HACE 5 MIN",
    icon: StarIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#EAB308]",
    isNew: true,
    href: "/client/agenda",
  },
];

export const mockClientHistorial = [
  // Dejar vacío por defecto para visualizar el Empty State: "No tenés notificaciones leidas"
  /*
  {
    id: "ch-1",
    titulo: "Servicio finalizado",
    descripcion: "Por favor califica la atención recibida por el profesional.",
    fecha: "HACE 1 SEMANA",
    timestamp: 1713000000000,
    icon: StarIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#EAB308]",
    isNew: false,
    href: "/client/agenda",
  },
  */
];
