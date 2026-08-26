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
        answer: "Desde Mi Agenda, seleccioná “Crear Nueva Solicitud”. También podés seleccionar “Publicar mi primera solicitud” si todavía no tenés solicitudes. Luego completá los datos requeridos y seleccioná “Continuar”.",
      },
      {
        question: "¿Dónde veo mi historial de turnos?",
        answer: "Desde Mi Agenda, ingresá al panel “Historial”. Allí encontrarás tus solicitudes y turnos cancelados o finalizados.",
      },
      {
        question: "¿Cómo cancelo una solicitud o turno?",
        answer: "Para una solicitud, ingresá a Solicitudes → Ver detalle → Cancelar Solicitud. Para un turno, ingresá a Próximos Turnos → Ver detalle → Cancelar turno y confirmá la cancelación.",
      },
    ],
    "/client/marketplace": [
      {
        question: "¿Cómo busco un profesional?",
        answer: "Entrá a Marketplace → Profesionales. Podés buscar por nombre o apellido y aplicar filtros de categoría, ubicación y orden. Seleccioná “Ver Perfil” para conocer más sobre un profesional.",
      },
      {
        question: "¿Qué significa “Esperando ofertas”?",
        answer: "Significa que tu solicitud todavía no recibió ofertas de profesionales. Cuando recibas ofertas, podrás seleccionarlas desde “Ver ofertas”.",
      },
      {
        question: "¿Cómo veo las solicitudes de otros clientes?",
        answer: "Entrá a Marketplace → Solicitudes publicadas. Podés buscar y filtrar solicitudes. Seleccioná “Ver detalle” para consultar la información de una solicitud. Las solicitudes de otros clientes son solo de consulta.",
      },
    ],
    "/client/notifications": [
      {
        question: "¿Cómo marco una notificación como leída?",
        answer: "Una notificación se marca automáticamente como leída cuando la seleccionás o ingresás a ella. El indicador de “nueva” desaparece y la notificación queda disponible en Historial.",
      },
      {
        question: "¿Qué significan los distintos íconos y colores?",
        answer: "Cada ícono y color representa un tipo de evento: Turno naranja, Pago azul, Recordatorio naranja, Cancelación rojo, Calificación amarillo y Oferta verde.",
      },
      {
        question: "¿Cómo filtro mi historial de notificaciones?",
        answer: "Ingresá a Notificaciones → Historial y utilizá “Ordenar por”. Podés seleccionar “Todos” o “Más antiguos”.",
      },
    ],
    "/client/profile": [
      {
        question: "¿Cómo edito mi perfil público?",
        answer: "Desde Mi perfil, ingresá a Editar perfil. Allí vas a poder modificar tu foto de perfil, imagen de portada y biografía. Cuando termines, seleccioná Guardar y volver a “Mi perfil” para aplicar los cambios.",
      },
      {
        question: "¿Cómo cambio mi foto de perfil?",
        answer: "Desde Mi perfil → Editar perfil, seleccioná el ícono de cámara que aparece sobre tu foto de perfil. Se abrirá el selector de archivos de tu dispositivo para que puedas elegir una nueva imagen. Luego, guardá los cambios para actualizar tu perfil.",
      },
      {
        question: "¿Cómo administro mis permisos de privacidad?",
        answer: "Desde Mi perfil → Información de perfil → Privacidad, ingresá a Administrar permisos. Desde allí podés gestionar tus preferencias de privacidad y controlar los permisos relacionados con el uso de tus datos y contenido personalizado.",
      },
    ],
    "/client/settings": [
      {
        question: "¿Cómo cambio entre modo claro y oscuro?",
        answer: "Para cambiar entre el modo claro y oscuro, utilizá el switch (interruptor) ubicado en la tarjeta “Cambiar a modo claro o nocturno”. Al activarlo o desactivarlo, el tema visual se cambia inmediatamente en toda la plataforma.",
      },
      {
        question: "¿Puedo cambiar el idioma de la plataforma?",
        answer: "Para cambiar el idioma. La plataforma está configurada en Español (Argentina). Se muestra un selector de idioma,donde podes elegir.",
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
        answer: "Si estás en Mi Agenda, puedes ir a la pestaña Ofertas Pendientes. Si aún no tienes ninguna oferta activa, verás la opción \"Explorar solicitudes de clientes\" o \"Publicar mi primera solicitud\". Al hacer clic allí, el sistema te redirigirá automáticamente al marketplace para que puedas buscar solicitudes y enviar tus propuestas.",
      },
      {
        question: "¿Qué significa \"Ofertas Pendientes\"?",
        answer: "Allí podrás ver las tarjetas de las solicitudes en las que participaste (identificadas con la etiqueta \"OFERTA ENVIADA\"). Al ingresar a \"Ver detalle\" o \"Ver mi oferta\", podrás revisar el estado actual de la solicitud del cliente, los detalles del problema y la información exacta de la propuesta que le enviaste (monto, fecha y horario).",
      },
      {
        question: "¿Dónde veo mi historial de turnos?",
        answer: "En la parte superior verás tres paneles de navegación. Simplemente selecciona el panel llamado \"Historial\". Al hacer clic, la pantalla se actualizará para mostrarte todo el registro de tus turnos y ofertas pasadas.",
      },
      {
        question: "¿Cómo cancelo un turno?",
        answer: "Ve a la sección Mi Agenda y asegúrate de estar en la pestaña Próximos Turnos. Busca el turno en cuestión y haz clic en el botón \"Ver detalle →\". Se abrirá una ventana lateral o modal con toda la información del trabajo. En el encabezado de esa misma ventana, junto al botón de cerrar (\"X\"), encontrarás el botón \"Cancelar turno\" para iniciar el proceso.",
      },
    ],
    "/professional/marketplace": [
      {
        question: "¿Cómo busco solicitudes de clientes?",
        answer: "Dirígete a la barra lateral y selecciona \"Marketplace\". Asegúrate de estar en la pestaña \"Solicitudes publicadas\". Utiliza el panel lateral de filtros para afinar tu búsqueda. Una vez que elijas tus preferencias, haz clic en el botón \"Aplicar Filtros\" al final del panel para ver las solicitudes que coinciden con tu búsqueda.",
      },
      {
        question: "¿Por qué no puedo enviar una segunda oferta a la misma solicitud?",
        answer: "Si ya enviaste una propuesta para un trabajo específico, el botón \"Crear una Oferta\" se oculta automáticamente para evitar duplicados. En su lugar, verás el botón naranja \"Ver oferta\". Al hacer clic allí, podrás consultar el detalle completo de la propuesta que ya le enviaste al cliente (incluyendo el precio propuesto, el monto de la seña, la fecha, el horario y la descripción).",
      },
    ],
    "/professional/marketplace/[solicitud-id]/create-offer": [
      {
        question: "¿Cómo propongo una fecha y horario?",
        answer: "Para proponer una fecha y un horario al crear tu oferta, debes utilizar los campos específicos dentro del formulario de la solicitud: Haz clic en el campo \"Proponer una fecha\". Esto abrirá un calendario donde podrás seleccionar el día exacto. Luego dirígete al campo \"Rango horario de la oferta\". A medida que completes estos campos, verás que la información se actualiza automáticamente en tu panel de \"Resumen de tu oferta\" para que puedas revisarla antes de enviarla.",
      },
      {
        question: "¿Qué pasa si mi oferta no se pudo procesar?",
        answer: "Si ocurre algún problema técnico al intentar enviar tu propuesta, el sistema te avisará mostrando un mensaje de error en pantalla. Tendrás dos opciones disponibles “Reintentar” y “Cerrar”",
      },
    ],
    "/professional/notifications": [
      {
        question: "¿Cómo marco una notificación como leída?",
        answer: "¡Es súper fácil! Solo tenés que hacer clic en cualquier parte de la tarjeta de la notificación. Al tocarla, te vamos a llevar directamente a una pantalla con todos los detalles (como el comprobante de tu pago o la información de un turno) y ¡listo!, ya quedará registrada como vista.",
      },
      {
        question: "¿Qué significan los distintos íconos y colores?",
        answer: "Diseñamos los íconos para que puedas saber de qué se trata cada aviso con solo darle un vistazo rápido. Acá te dejo nuestra guía\nCheck verde: ¡Buenas noticias! El cliente aceptó tu oferta.\nCalendario naranja: ¡A prepararse! Es un recordatorio de que tenés un turno próximo.\nAlerta naranja: Hubo un cambio de planes y el cliente canceló el turno que tenían programado.\nTarjeta/dinero azul: ¡Excelente! Te confirma que se acreditó correctamente el pago por tu servicio.",
      },
    ],
    "/professional/profile": [
      {
        question: "¿Cómo edito mi perfil profesional?",
        answer: "Desde Mi perfil, ingresá a Editar perfil. Allí vas a poder modificar tu foto de perfil, imagen de portada y biografía. Cuando termines, seleccioná Guardar y volver a “Mi perfil” para aplicar los cambios.",
      },
      {
        question: "¿Cómo agrego habilidades o etiquetas?",
        answer: "Ve a la pantalla de tu perfil y haz clic en el botón \"Editar perfil público\". Desde allí podrás cargar todas tus habilidades. Una vez que las completes y guardes, aparecerán automáticamente como etiquetas (tags) dentro de la sección \"Sobre mí\" de tu perfil público.",
      },
      {
        question: "¿Cómo configuro mi disponibilidad horaria?",
        answer: "Solo tenés que entrar a tu perfil y tocar el botón \"Editar perfil público\". En esa pantalla de edición podrás completar toda tu disponibilidad horaria. En cuanto la guardes, aparecerá automáticamente una nueva tarjeta llamada \"Disponibilidad\" en tu perfil público con los horarios que elegiste mostrar.",
      },
    ],
    "/professional/settings": [
      {
        question: "¿Cómo cambio entre modo claro y oscuro?",
        answer: "Para cambiar entre el modo claro y oscuro, utilizá el switch (interruptor) ubicado en la tarjeta “Cambiar a modo claro o nocturno”. Al activarlo o desactivarlo, el tema visual se cambia inmediatamente en toda la plataforma.",
      },
      {
        question: "¿Puedo cambiar el idioma de la plataforma?",
        answer: "Para cambiar el idioma. La plataforma está configurada en Español (Argentina). Se muestra un selector de idioma,donde podes elegir.",
      },
    ],
    "/professional/help": [
      {
        question: "¿Cómo contacto a Soporte?",
        answer: "¡Es muy fácil! Para comunicarte con nuestro equipo, solo tenés que ir a la sección de \"Ayuda\" desde el menú lateral. Allí vas a encontrar toda nuestra información de contacto y un formulario rápido para que nos escribas directamente.",
      },
      {
        question: "¿Dónde envío una consulta?",
        answer: "Podés enviarnos tus dudas directamente desde la plataforma. Solo seguí estos pasos:\nIngresá a la sección de \"Ayuda\" en el menú lateral.\nBuscá la sección que dice \"Envíanos una consulta\".\nCompletá los campos de \"Asunto\" y \"Mensaje\" con lo que necesites decirnos.\nHacé clic en el botón \"Enviar consulta\" y ¡listo! El sistema te va a avisar en pantalla en cuanto la recibamos correctamente.",
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
