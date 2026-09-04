import {
  XCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  StarIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid";

/**
 * Mock data — Notificaciones (Profesional)
 * Reemplazar con llamadas reales al backend cuando esté disponible.
 */

export const mockNotificaciones = [
  {
    id: "n1",
    titulo: "Oferta no seleccionada",
    descripcion: "El trabajo fue adjudicado a otro profesional.",
    fecha: "HACE 30 MIN",
    icon: XCircleIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#4CAF50]", // Círculo verde con X blanca (transparente por el svg)
    isNew: false,
    href: "/professional/notifications/1",
  },
  {
    id: "n2",
    titulo: "Turno cancelado",
    descripcion: "El cliente canceló el turno.",
    fecha: "HACE 2 DÍAS",
    icon: ExclamationTriangleIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#F78736]", // Triángulo naranja
    isNew: false,
    href: "/professional/cancellations/2/details",
  },
  {
    id: "n3",
    titulo: "¡Tu oferta fue aceptada!",
    descripcion: "El cliente confirmó tu oferta.",
    fecha: "HACE 5 MIN",
    icon: CheckCircleIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#4CAF50]", // Círculo verde con tilde blanca
    isNew: true, // "NUEVO" tag
    href: "/professional/offers/3/details",
  },
  {
    id: "n4",
    titulo: "Recordatorio",
    descripcion: "Tenés un turno programado para mañana.",
    fecha: "AYER",
    icon: CalendarDaysIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#F78736]", // Calendario naranja
    isNew: false,
    href: "/professional/reminders/4/details",
    // Nuevos campos para ReminderSummary
    clientName: "Juan Pérez",
    clientInitials: "JP",
    serviceName: "Instalación eléctrica",
    status: "PENDIENTE",
    date: "28/07/2026 15:30 hs",
    timeAgo: "hace 2 días",
  },
  {
    id: "n5",
    titulo: "Un cliente calificó tu servicio.",
    descripcion: "Recibiste una nueva valoración sobre un turno finalizado.",
    fecha: "HACE 2 DÍAS",
    icon: StarIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#EAB308]", // Estrella dorada
    isNew: false,
    href: "/professional/reviews/5/details",
  },
  {
    id: "n6",
    titulo: "Pago confirmado",
    descripcion: "Se acreditó correctamente el pago.",
    fecha: "HACE 1 HORA",
    icon: CreditCardIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#3B82F6]", // Icono azul
    isNew: true,
    href: "/professional/payments/6/details",
  },
];

export const mockHistorialNotificaciones = [
  // Puedes agregar notificaciones leídas si es necesario
];

