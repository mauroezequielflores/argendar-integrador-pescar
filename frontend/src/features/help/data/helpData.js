import {
  UserIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  PlusIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

export const QUICK_SHORTCUTS = [
  {
    id: "profile",
    title: "Configurar Perfil",
    description: "Datos personales de tu cuenta",
    icon: UserIcon,
    to: "/client/profile",
  },
  {
    id: "privacy",
    title: "Privacidad",
    description: "Preferencias y control sobre el uso de tus datos.",
    icon: ShieldCheckIcon,
    to: "/client/profile",
  },
  {
    id: "payment",
    title: "Métodos de pago",
    description: "Administrá tus metodos de pago guardados en la plataforma.",
    icon: CreditCardIcon,
    to: "/client/profile",
  },
  {
    id: "create-request",
    title: "Crear solicitud",
    description: "Crea una solicitud que detalle tu problema y contactá a un profesional.",
    icon: PlusIcon,
    to: "/client/agenda",
  },
  {
    id: "manage-appointments",
    title: "Administrar Turnos",
    description: "Gestión de agenda y citas confirmadas.",
    icon: CalendarDaysIcon,
    to: "/client/agenda",
  },
];

export const FAQ_ITEMS = [
  {
    id: "create-solicitud",
    question: "¿Cómo crear una solicitud?",
    answer:
      "Ingresá mi agenda y selecciona el boton de 'Crear solicitud' donde vas a tener que completar 3 pasos: ingresar los detalles necesarios para que el profesional analice tu situación (categoría, problema, urgencia, horario preferido y fotos), ingresar ubicación y revisa el resumen de tu solicitud y enviala.",
    defaultOpen: true,
  },
  {
    id: "cancel-turno",
    question: "¿Cómo cancelar un turno correctamente?",
    answer:
      "Para cancelar un turno, dirigite a Mi Agenda, seleccioná el turno correspondiente en la pestaña 'Turnos confirmados' y hacé clic en la opción 'Cancelar turno'. Recordá hacerlo con al menos 24 horas de anticipación.",
    defaultOpen: false,
  },
  {
    id: "payment-accreditation",
    question: "¿Cuál es el tiempo de acreditación de los pagos?",
    answer:
      "Los pagos realizados con tarjeta de crédito o débito se acreditan de forma inmediata. Si utilizás transferencias bancarias o dinero en cuenta, la acreditación puede demorar entre 24 y 48 horas hábiles.",
    defaultOpen: false,
  },
];

export const CHATBOT_EXAMPLES = [
  '"Olvidé mi contraseña"',
  '"Problemas con Mercado Pago"',
];

export const CONTACT_INFO = {
  email: "soporte@argendar.com",
  schedule: "Lunes a Viernes, 09:00 - 18:00",
  responseTime: "< 2 horas",
  status: "Operativo",
};
