Historia de Usuario: Notificaciones de Oferta Aceptada y Detalles del Turno

1. Rol: professional

2. Ruta: /professional/notifications

3. Narrativa:
Como profesional autenticado,
quiero recibir y visualizar notificaciones cuando un cliente acepta mi oferta,
para poder ver los detalles del acuerdo, acceder al turno correspondiente y gestionar mi agenda de trabajo.

4. Criterios de Aceptación:

CA01 — Visualización de la notificación (Componente de Lista)
Dado que el profesional se encuentra en la ruta /professional/notifications,
Cuando el sistema registra que un cliente aceptó una de sus ofertas,
Entonces la interfaz debe renderizar un componente de notificación tipo fila/card horizontal que contenga:
Contenedor: Fondo gris oscuro con bordes redondeados y un chevron (`>`) alineado a la derecha para indicar que el elemento es interactivo.
Ícono: Un avatar circular blanco a la izquierda con un ícono de check (`✓`) verde en el centro.
Título: El texto "¡Tu oferta fue aceptada!" en fuente bold y color blanco/claro.
Etiqueta (Badge): Pegado al título, un badge con borde (outline) y el texto "NUEVO" en fuente pequeña y mayúsculas.
Subtítulo: El texto descriptivo "El cliente confirmó tu oferta." en color gris apagado (muted text).
Timestamp: Un indicador de tiempo relativo en la parte inferior izquierda (ej. "HACE 5 MIN") en fuente pequeña, en mayúsculas y color gris apagado.

CA02 — Navegación a Detalles de la Oferta Aceptada
Dado que el profesional visualiza la notificación "¡Tu oferta fue aceptada!",
Cuando hace clic sobre el área interactiva de la notificación,
Entonces el sistema debe redirigir a una vista de detalles (ej. /professional/offers/{id}/details) que despliegue la información del acuerdo estructurada en dos tarjetas (cards).

CA03 — UI: Tarjeta de Encabezado (Información del Cliente y Estado)
Dado que el profesional ingresó a la vista de detalles,
Entonces la pantalla debe mostrar en la parte superior una primera card gris oscura con bordes redondeados que contenga:
Avatar del cliente: Imagen de perfil del cliente.
Nombre del cliente: "[Nombre del cliente]" alineado a la izquierda junto al avatar, en texto blanco bold.
Estado: Un componente alineado a la derecha estilo badge ancho, con borde gris claro perimetral, un ícono de check y el texto "OFERTA ACEPTADA" en mayúsculas.




CA04 — UI: Tarjeta de Detalles de la Propuesta
Debajo del encabezado, el sistema debe mostrar una segunda card gris oscura que resuma la propuesta hecha por el profesional, incluyendo:
Cabecera Izquierda: Avatar fotográfico del profesional, nombre (ej: "Ricardo Gómez") en blanco bold, calificación en formato estrellas (ej. 4.5 o 5) y debajo la categoría/rubro en mayúsculas y gris apagado (ej: "ELECTRICISTA").
Cabecera Derecha (Precios): El costo total (ej: "$45.000") en tipografía de mayor tamaño, blanco y bold. Inmediatamente debajo, en texto más pequeño y gris, el valor anticipado (ej: "Seña requerida: $9.000").
Cuerpo (Mensaje): Un bloque de texto con el mensaje enviado en la propuesta ("Hola! Puedo pasar mañana mismo..."), utilizando texto gris claro para favorecer el contraste y lectura.
Pie de tarjeta (Disponibilidad y Acción): 
Izquierda: Un ícono de calendario seguido del texto "Disponibilidad:" en gris apagado, y la fecha/hora ("30/07 a las 09:00hs") destacada en blanco bold.
Derecha: Un botón sólido de acción primaria en color naranja, con bordes redondeados y el texto "ir al turno" en minúsculas.

CA05 — Acción: Ir al turno
Dado que el profesional se encuentra en la tarjeta de detalles de la propuesta,
Cuando hace clic en el botón naranja "ir al turno",
Entonces la interfaz debe redirigir a una nueva vista/ruta específica del turno (ej. /professional/appointments/{id}) que muestre mapa, dirección y herramientas para el día del trabajo.

CA06 — Acción: Volver
Dado que el profesional está navegando en las ventanas de detalles de oferta o detalles del turno,
Cuando hace clic en el botón "Volver" (nav-bar o header),
Entonces el sistema debe redirigirlo nuevamente a la ruta de origen /professional/notifications.

CA07 — Regla de Negocio (Backend y Agenda)
Dado que un cliente acepta la oferta (la acción que detona toda esta historia),
Cuando se confirma en la base de datos,
Entonces el sistema (backend) debe registrar automáticamente el turno consolidado para ambas cuentas (cliente y profesional).
Esta acción debe impactar directamente en la disponibilidad del profesional (bloqueando agenda) y habilitar la lógica de envío de recordatorios para ambas partes.
