export const CHATBOT_EXCLUDED_ROUTES = [
  "/login",
  "/register",
  "/client/profile/payment-methods",
  "/professional/profile/payment-methods",
  "/client/profile/profile-settings/edit-profile-settings",
  "/professional/profile/profile-settings/edit-profile-settings",
];

export const CHATBOT_EXCLUDED_PATTERNS = [
  /^\/admin(\/.*)?$/,
  /^\/client\/agenda\/[^/]+\/offer-list\/confirm-offer$/,
];

export const CHATBOT_FAQ = {
  client: {
    "/client/agenda": [
      {
        question: "¿Cómo creo una nueva solicitud?",
        answer: "Para crear una solicitud, ve a 'Mi Agenda' y haz clic en el botón 'Crear Solicitud'.",
      },
      {
        question: "¿Dónde veo mi historial de turnos?",
        answer: "Tu historial de turnos se encuentra en la sección 'Mi Agenda', debajo de tus solicitudes activas.",
      },
      {
        question: "¿Cómo cancelo una solicitud o turno?",
        answer: "Puedes cancelar seleccionando la solicitud en 'Mi Agenda' y eligiendo la opción 'Cancelar'.",
      },
    ],
    "/client/marketplace": [
      {
        question: "¿Cómo busco un profesional?",
        answer: "Usa la barra de búsqueda en el Marketplace o filtra por categoría y especialidad.",
      },
      {
        question: "¿Qué significa 'Esperando ofertas'?",
        answer: "Significa que tu solicitud ha sido enviada y estamos esperando que los profesionales propongan fechas.",
      },
      {
        question: "¿Cómo veo las solicitudes de otros clientes?",
        answer: "Las solicitudes de otros clientes no son públicas por cuestiones de privacidad.",
      },
    ],
    "/client/notifications": [
      {
        question: "¿Cómo marco una notificación como leída?",
        answer: "Haz clic en el punto o ícono de la notificación para marcarla como leída.",
      },
      {
        question: "¿Qué significan los distintos íconos y colores?",
        answer: "Cada ícono representa un tipo de notificación (oferta, recordatorio, etc.).",
      },
      {
        question: "¿Cómo filtro mi historial de notificaciones?",
        answer: "Utiliza los botones de filtro en la parte superior de la vista de notificaciones.",
      },
    ],
    "/client/profile": [
      {
        question: "¿Cómo edito mi perfil público?",
        answer: "Ve a 'Mi perfil' y selecciona 'Editar perfil' para cambiar tu información pública.",
      },
      {
        question: "¿Cómo cambio mi foto de perfil?",
        answer: "Desde 'Editar perfil', haz clic en tu foto actual para subir una nueva.",
      },
      {
        question: "¿Cómo administro mis permisos de privacidad?",
        answer: "Ingresa a 'Mi Perfil' -> 'Configuración de privacidad' para gestionar esto.",
      },
    ],
    "/client/settings": [
      {
        question: "¿Cómo cambio entre modo claro y oscuro?",
        answer: "En 'Configuración', busca la opción 'Apariencia' para alternar modos.",
      },
      {
        question: "¿Puedo cambiar el idioma de la plataforma?",
        answer: "Sí, desde 'Configuración' puedes seleccionar tu idioma preferido.",
      },
    ],
    "/client/help": [
      {
        question: "¿Cómo contacto a Soporte?",
        answer: "Puedes enviarnos un mensaje desde esta pantalla de Ayuda o escribirnos a soporte@argendar.com.",
      },
      {
        question: "¿Dónde envío una consulta?",
        answer: "Utiliza el formulario de contacto en esta sección para enviarnos tu consulta.",
      },
    ],
  },
  professional: {
    "/professional/agenda": [
      {
        question: "¿Cómo envío una oferta?",
        answer: "Busca la solicitud en el Marketplace y selecciona 'Enviar Oferta' para proponer fecha.",
      },
      {
        question: "¿Qué significa 'Ofertas Pendientes'?",
        answer: "Son las ofertas que has enviado y el cliente aún no ha aceptado.",
      },
      {
        question: "¿Dónde veo mi historial de turnos?",
        answer: "Tu historial está disponible en 'Mi Agenda', visualizando turnos pasados.",
      },
      {
        question: "¿Cómo cancelo un turno?",
        answer: "Selecciona el turno en tu agenda y elige la opción 'Cancelar turno'.",
      },
    ],
    "/professional/marketplace": [
      {
        question: "¿Cómo busco solicitudes de clientes?",
        answer: "Explora el Marketplace donde verás las solicitudes abiertas en tu área.",
      },
      {
        question: "¿Por qué no puedo enviar una segunda oferta a la misma solicitud?",
        answer: "Solo se permite una oferta activa por solicitud para mantener el proceso simple.",
      },
    ],
    "/professional/marketplace/[solicitud-id]/create-offer": [
      {
        question: "¿Cómo propongo una fecha y horario?",
        answer: "Selecciona la fecha en el calendario y luego escoge un bloque horario disponible.",
      },
      {
        question: "¿Qué pasa si mi oferta no se pudo procesar?",
        answer: "Verifica tu conexión y vuelve a intentar, o contacta a soporte si el problema persiste.",
      },
    ],
    "/professional/notifications": [
      {
        question: "¿Cómo marco una notificación como leída?",
        answer: "Haz clic directamente sobre la notificación para marcarla.",
      },
      {
        question: "¿Qué significan los distintos íconos y colores?",
        answer: "Identifican si es una nueva solicitud, confirmación de cliente o alerta del sistema.",
      },
    ],
    "/professional/profile": [
      {
        question: "¿Cómo edito mi perfil profesional?",
        answer: "Accede a 'Mi perfil' y presiona 'Editar perfil' para actualizar tus datos.",
      },
      {
        question: "¿Cómo agrego habilidades o etiquetas?",
        answer: "Desde la edición de tu perfil, busca la sección de 'Habilidades' y agrégalas.",
      },
      {
        question: "¿Cómo configuro mi disponibilidad horaria?",
        answer: "En la sección de configuración de tu perfil puedes definir tus horarios de atención.",
      },
    ],
    "/professional/settings": [
      {
        question: "¿Cómo cambio entre modo claro y oscuro?",
        answer: "Ve a 'Configuración' y selecciona el modo en 'Apariencia'.",
      },
      {
        question: "¿Puedo cambiar el idioma de la plataforma?",
        answer: "Sí, está disponible en la configuración de tu cuenta.",
      },
    ],
    "/professional/help": [
      {
        question: "¿Cómo contacto a Soporte?",
        answer: "Usa los canales de contacto de esta sección de Ayuda o el correo de soporte.",
      },
      {
        question: "¿Dónde envío una consulta?",
        answer: "Puedes enviarnos tu consulta usando el formulario que ves en esta pantalla.",
      },
    ],
  },
};

export const DEFAULT_CHATBOT_MESSAGE =
  "Lo siento, no puedo resolver esa consulta en este momento. Si necesitas más ayuda, dirígete a la sección de Ayuda para contactar a Soporte.";

export const getChatbotResponse = (route, role) => {
  if (!role || !CHATBOT_FAQ[role]) return [];
  
  // Buscar coincidencia exacta
  if (CHATBOT_FAQ[role][route]) {
    return CHATBOT_FAQ[role][route];
  }
  
  // Buscar subrutas (ej: /client/profile/lo-que-sea debería mostrar FAQs de /client/profile)
  const matchingRoute = Object.keys(CHATBOT_FAQ[role]).find((key) =>
    route.startsWith(key)
  );

  return matchingRoute ? CHATBOT_FAQ[role][matchingRoute] : [];
};
