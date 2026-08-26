Historia de Usuario: Notificación y Detalles de Turno Cancelado

1. Rol: professional

2. Ruta: /professional/notifications

3. Narrativa:
Como profesional autenticado en la plataforma,
quiero recibir una notificación detallada cuando un cliente cancela un turno previamente acordado,
para poder conocer los motivos de la cancelación, liberar mi disponibilidad en la agenda y comunicarme con soporte si ocurriera un inconveniente.

4. Criterios de Aceptación:

CA01 — Visualización de la Notificación en Lista (Componente Base)
Dado que el profesional se encuentra en la ruta /professional/notifications,
Cuando el backend emite un evento de cancelación (ej. mediante webhooks o tras consultar `GET /api/v1/professionals/{id}/notifications`),
Entonces la interfaz debe renderizar la tarjeta de notificación con el siguiente esquema:
Ícono (Izquierda): Un avatar circular de fondo blanco conteniendo un ícono de alerta (triángulo con signo de exclamación `!`) en color naranja.
Título: El texto "Turno cancelado" en blanco bold.
Subtítulo/Cuerpo: El mensaje descriptivo "El cliente canceló tu turno programado para el [Fecha] a las [Hora]." en color gris claro.
Timestamp: Tiempo relativo (ej. "HACE 2 DÍAS") en fuente pequeña, mayúsculas y gris apagado.
Chevron derecho (`>`) para indicar navegación.

CA02 — Navegación y Consumo de Datos de la Cancelación
Dado que el profesional hace clic en la tarjeta de notificación "Turno cancelado",
Entonces el frontend debe redirigir a la ventana de detalles y ejecutar una petición al backend (ej.: `GET /api/v1/appointments/{appointmentId}/cancellation-details`) para hidratar la vista con los motivos exactos de la anulación.

CA03 — UI: Encabezado y Tarjeta Central de la Ventana de Detalles
Dado que el usuario ingresó a la vista de detalles de cancelación,
Entonces el sistema debe renderizar el siguiente layout (sobre fondo oscuro/gris muy oscuro):
Header de la página: Título grande "Turno cancelado" y debajo el texto "El cliente canceló tu turno programado para el [Fecha] a las [Hora]."
Mensaje de confirmación: Un texto en blanco indicando "[Nombre del Cliente] ha cancelado tu turno."
Tarjeta de Resumen (Card central): Fondo gris oscuro con bordes redondeados que incluya:
Avatar fotográfico a la izquierda.
Título del servicio ("Instalación eléctrica") y a su lado un badge (etiqueta con borde perimetral) con el texto "CANCELADO" en mayúsculas.
Nombre asociado ("Ricardo Gómez").
Abajo a la izquierda: Ícono de calendario naranja con fecha y hora en gris claro.
Arriba a la derecha: Ícono de reloj con tiempo relativo ("hace 2 días") en gris apagado.
Abajo a la derecha: Un botón outline interactivo con el texto "Ver detalle ->".

CA04 — UI: Sección de Motivo y Contacto con Soporte
Inmediatamente debajo de la tarjeta de resumen, la interfaz debe mostrar dos bloques de información clave:
Bloque "Motivo de Cancelación": Título en blanco seguido de un contenedor (box tipo text-area inhabilitado) con fondo gris oscuro y bordes sutiles. En su interior debe mostrarse, entre comillas, el mensaje textual que el cliente escribió al cancelar (ej. "Tuve complicaciones en estos días...").
Bloque "Ayuda/Soporte": Un contenedor horizontal con fondo gris que contenga un ícono de información (`i`) a la izquierda, y a su derecha el texto: "Si sentís que hubo un error, no dudes en comunicarte con soporte en argendarsoporte@gmail.com". El correo electrónico debe estar renderizado como un hipervínculo subrayado (`mailto:`).

CA05 — Acciones y Navegación (Routing)
El sistema debe asegurar que los botones respondan a las siguientes redirecciones:
Acción "Ver detalle ->" (dentro de la tarjeta): Redirige a la vista completa del turno (`/professional/appointments/{appointmentId}`) para ver el historial o facturación.
Acción "Volver" (Botón izquierdo en el footer fijado abajo): Redirige a la lista de notificaciones (`/professional/notifications`).
