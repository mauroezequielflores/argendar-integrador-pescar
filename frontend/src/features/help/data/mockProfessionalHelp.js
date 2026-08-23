/**
 * Mock data — Ayuda (Profesional)
 */

export const FAQ_ITEMS = [
  {
    id: 1,
    pregunta: "¿Cómo crear una Oferta?",
    respuesta:
      "Para crear una oferta, dirigite a la sección 'Marketplace' en el menú lateral. Hacé click en la Solicitud de interés y seleccioná el botón 'Crear oferta': completá con la fecha, horario, seña, precio final y descripción. Finalmente hacé click en 'Enviar oferta'.",
  },
  {
    id: 2,
    pregunta: "¿Cómo cancelar un turno correctamente?",
    respuesta:
      "Ingresá a 'Mi Agenda' desde el menú lateral, buscá el turno que querés cancelar y seleccioná la opción 'Cancelar turno'. Vas a poder ingresar un motivo opcional. La cancelación se notifica automáticamente al cliente.",
  },
  {
    id: 3,
    pregunta: "¿Cuál es el tiempo de acreditación de los pagos?",
    respuesta:
      "Los pagos se acreditan dentro de las 48 horas hábiles posteriores a la confirmación del servicio. En caso de demoras podés contactar a soporte desde esta sección.",
  },
  {
    id: 4,
    pregunta: "¿Cómo actualizar mi perfil profesional?",
    respuesta:
      "Dirigite a 'Mi perfil' en el menú lateral y seleccioná 'Configurar Perfil'. Ahí podés editar tus datos personales, foto, descripción y especialidades.",
  },
  {
    id: 5,
    pregunta: "¿Cómo gestionar mi disponibilidad?",
    respuesta:
      "Desde 'Mi Agenda' podés configurar tus horarios disponibles para que los clientes puedan reservar turnos. Seleccioná 'Administrar disponibilidad' y elegí los días y horarios que preferís.",
  },
  {
    id: 6,
    pregunta: "¿Cómo recibo las notificaciones de nuevas solicitudes?",
    respuesta:
      "Las notificaciones llegan automáticamente a la sección 'Notificaciones' del menú lateral. También podés configurar alertas desde 'Configuración' para recibir avisos por email.",
  },
  {
    id: 7,
    pregunta: "¿Qué hago si un cliente no se presenta al turno?",
    respuesta:
      "Si el cliente no se presenta, podés marcar el turno como 'No asistió' desde 'Mi Agenda'. Esto queda registrado en el historial y puede afectar la calificación del cliente.",
  },
  {
    id: 8,
    pregunta: "¿Cómo calificar a un cliente?",
    respuesta:
      "Una vez finalizado el servicio, vas a recibir una notificación para calificar al cliente. También podés hacerlo desde el detalle del turno en 'Mi Agenda' > 'Historial'.",
  },
  {
    id: 9,
    pregunta: "¿Cómo cambiar mi método de cobro?",
    respuesta:
      "Ingresá a 'Mi perfil' y luego a 'Métodos de pago'. Desde ahí podés agregar, editar o eliminar tus métodos de cobro disponibles.",
  },
  {
    id: 10,
    pregunta: "¿Cómo contactar al soporte de Argendar?",
    respuesta:
      "Podés contactarnos completando el formulario de consulta en esta pantalla, o escribiéndonos directamente a soporte@argendar.com. Nuestro horario de atención es de Lunes a Viernes de 09:00 a 18:00.",
  },
];

export const CONTACT_INFO = {
  email: "soporte@argendar.com",
  horario: "Lunes a Viernes, 09:00 - 18:00",
  tiempoRespuesta: "< 2 horas",
  estadoServicio: "Operativo",
};

export const SHORTCUTS = [
  {
    id: "perfil",
    label: "Configurar Perfil",
    description: "Datos personales de tu cuenta",
    to: "/professional/profile/profile-settings",
  },
  {
    id: "privacidad",
    label: "Privacidad",
    description: "Preferencias y control sobre el uso de tus datos.",
    to: "/professional/profile/profile-privacy",
  },
  {
    id: "pagos",
    label: "Métodos de pago",
    description: "Administrá tus métodos de pago guardados en la plataforma.",
    to: "/professional/profile/payment-methods",
  },
  {
    id: "oferta",
    label: "Crear oferta",
    description: "Crea una oferta para una solicitud desde nuestro marketplace.",
    to: "/professional/marketplace",
  },
  {
    id: "turnos",
    label: "Administrar Turnos",
    description: "Gestión de agenda y citas confirmadas.",
    to: "/professional/agenda",
  },
];
