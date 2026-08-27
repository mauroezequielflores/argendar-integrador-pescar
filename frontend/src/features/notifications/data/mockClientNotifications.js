import {
  CalendarDaysIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

/**
 * Mock data — Notificaciones (Cliente)
 *
 * Los arrays están vacíos por defecto para reflejar el estado inicial y vacío (Empty State)
 * descrito en los criterios de aceptación CA04, CA05 y las capturas de referencia.
 */

export const mockClientNotificaciones = [
  {
    id: "cn-offer-1",
    tipo: "offer",
    titulo: "¡Tenés una oferta nueva!",
    descripcion: "Un profesional publicó una nueva oferta a tu solicitud.",
    fecha: "HACE 5 MIN",
    timestamp: 1714000000000,
    icon: CheckCircleIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#4A8F3A]",
    isNew: true,
    href: "/client/agenda",
  },
  {
    id: "cn-payment-1",
    tipo: "payment",
    titulo: "Pago confirmado",
    descripcion: "Se acreditó correctamente el pago.",
    fecha: "HACE 1 HORA",
    timestamp: 1713900000000,
    icon: CreditCardIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#3B82F6]",
    isNew: false,
    href: "/client/agenda",
  },
  {
    id: "cn-reminder-1",
    tipo: "reminder",
    titulo: "Recordatorio",
    descripcion: "Tenés un turno programado para mañana.",
    fecha: "AYER",
    timestamp: 1713800000000,
    icon: CalendarDaysIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#F78736]",
    isNew: false,
    href: "/client/agenda",
  },
  {
    id: "cn-cancelled-1",
    tipo: "cancellation",
    titulo: "Turno cancelado",
    descripcion: "El profesional canceló tu turno programado.",
    fecha: "HACE 2 DÍAS",
    timestamp: 1713800000000,
    icon: ExclamationTriangleIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#EF4444]",
    isNew: false,
    href: "/client/agenda",
  },
  {
    id: "cn-rating-1",
    tipo: "rating",
    titulo: "Calificá tu turno",
    descripcion: "El servicio finalizó, contanos cómo fue tu experiencia.",
    fecha: "HACE 3 DÍAS",
    timestamp: 1713700000000,
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
