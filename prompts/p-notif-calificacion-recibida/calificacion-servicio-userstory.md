Historia de Usuario: Notificación y Detalles de Calificación del Servicio

1. Rol: professional

2. Ruta: /professional/notifications

3. Narrativa:
Como profesional autenticado,
quiero recibir una notificación detallada cada vez que un cliente califique el trabajo que le realicé,
para poder leer su opinión, conocer mi puntaje obtenido y tener la opción de reportar a soporte cualquier valoración que incumpla las políticas de la plataforma.

4. Criterios de Aceptación:

CA01 — Renderizado de Notificación en la Lista
Dado que el profesional se encuentra en la ruta /professional/notifications,
Cuando el sistema (backend) emite o registra una nueva reseña (disponible a través de `GET /api/v1/professionals/{id}/notifications`),
Entonces el frontend debe iterar y renderizar una tarjeta de notificación interactiva con el siguiente esquema:
Ícono (Izquierda): Un avatar circular blanco que contiene un ícono de estrella sólida en color amarillo/dorado.
Título: "Un cliente calificó tu servicio." en fuente blanca y bold.
Subtítulo/Cuerpo: "Recibiste una nueva valoración sobre un turno finalizado." en color gris claro.
Timestamp: El tiempo relativo (ej. "HACE 2 DÍAS") en tamaño pequeño, mayúsculas y gris apagado.
Navegación: Ícono de chevron derecho (`>`).

CA02 — Navegación a la Vista de Detalles (Consumo Backend)
Dado que el profesional hace clic en la notificación de calificación,
Entonces el sistema debe redirigir a la vista de detalles y ejecutar una petición asíncrona (ej. `GET /api/v1/reviews/{reviewId}` o `GET /api/v1/appointments/{appointmentId}/review`) para popular la interfaz con los datos reales enviados por el cliente.

CA03 — UI: Tarjeta de Reseña (Valoración Recibida)
En la ventana de detalles, debajo de un encabezado principal ("Un cliente calificó tu servicio"), se debe mostrar una primera tarjeta gris oscura (con bordes redondeados) que estructure la reseña:
Cabecera Izquierda: Avatar del cliente, nombre ("Luna Rivas") en bold blanco, y debajo un identificador en gris mayúsculas ("CLIENTE VERIFICADO").
Cabecera Derecha (Rating): Representación visual del puntaje mediante estrellas dinámicas (ej. 5 estrellas color naranja). Debajo, el texto aclaratorio "puntaje: X de 5 estrellas" en fuente pequeña.
Contexto del Turno: El texto dinámico "Valoración recibida para turno “{titulo_del_turno}…”" en color blanco.
Caja de Comentarios: Un contenedor interno (box con borde sutil, sin fondo de relleno) que contenga la cita textual del cliente (ej. *"Excelente servicio..."*) renderizada en tipografía itálica y color gris claro.
Pie de Tarjeta: 
A la izquierda: Ícono de calendario y la fecha de la calificación ("Calificado el 05/08/2026 a las 14:30").
A la derecha: El botón interactivo outline (solo borde) con el texto "Ver detalle ->".

CA04 — UI: Tarjeta de Apelación y Soporte
Debajo de la tarjeta de la reseña, el sistema debe renderizar una segunda tarjeta orientada a la seguridad:
Iconografía: A la izquierda, un círculo oscuro con un ícono de interrogación (`?`) blanco.
Textos: Título "¿Considerás que esta valoración incumple las políticas?" en bold blanco, seguido de un párrafo descriptivo en gris claro que explica los motivos válidos de revisión (ofensivo, falso, spam).
Llamado a la Acción (CTA): Un botón primario y sólido, con fondo blanco y texto oscuro/negro que diga "Contactar a soporte".

CA05 — Flujos de Navegación (Routing de Botones)
La interfaz debe respetar los siguientes comportamientos de navegación al interactuar con los botones de las vistas renderizadas:
Acción "Ver detalle ->" (Tarjeta 1): Al hacer clic, el sistema redirige a la vista íntegra del turno (`/professional/appointments/{appointmentId}`) para que el profesional repase los detalles operativos del trabajo.
Acción "Contactar a soporte" (Tarjeta 2): Al hacer clic, redirige de forma directa a la ruta de ayuda de la plataforma (`/professional/help`), opcionalmente pasando por parámetro el ID de la review para agilizar el reclamo.
Acción "Volver" (Footer inferior gris): Al hacer clic en el botón izquierdo del nav-bar inferior, el sistema redirige al profesional a su bandeja de origen (`/professional/notifications`).

