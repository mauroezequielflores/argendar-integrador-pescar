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
  {
    id: "cn-reminder-1",
    tipo: "reminder",
    titulo: "Recordatorio",
    descripcion: "Tenés un turno programado para mañana.",
    fecha: "AYER",
    timestamp: 1713900000000,
    icon: CalendarDaysIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#F78736]",
    isNew: false,
    href: "/client/agenda",
    professionalName: "Ricardo Gómez",
    professionalInitials: "RG",
    serviceName: "Instalación eléctrica",
    status: "PENDIENTE",
    date: "28/07/2026 15:30 hs",
    timeAgo: "hace 2 días",
  },
  {
    id: "cn-offer-1",
    tipo: "new_offer",
    titulo: "¡Tenés una oferta nueva!",
    descripcion: "Un profesional publicó una nueva oferta a tu solicitud.",
    fecha: "HACE 5 MIN",
    timestamp: 1714000000000,
    icon: CheckCircleIcon,
    iconBgColor: "bg-white",
    iconColor: "text-[#4CAF50]",
    isNew: true,
    href: "/client/agenda",
    professionalName: "Ricardo Gómez",
    professionalInitials: "RG",
    specialty: "ELECTRICISTA",
    rating: 4.5,
    price: "$45.000",
    deposit: "$9.000",
    requestTitle: "Cambio de tablero [...]",
    message: '"Hola! Puedo pasar mañana mismo por la mañana. Cuento con todos los instrumentos para detectar la fuga eléctrica y reparar el tablero. El presupuesto incluye materiales de primera calidad (Sica/Schneider)."',
    availability: "30/07 a las 09:00hs",
  },
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
