# Plan de Implementación: Pantallas de Oferta Aceptada y Recordatorio

## Resumen
Se crearon y refactorizaron las pantallas de detalle de notificaciones para los flujos de "Oferta Aceptada" y "Recordatorio" en el módulo del profesional, aplicando estrictamente las reglas del Dark Theme del proyecto.

## Modificaciones Principales

1. **`frontend/src/features/notifications/pages/OfferDetailsPage.jsx`**
   - Se ajustó el fondo del contenedor principal a `#202020`.
   - Se agregaron las tarjetas contenedoras con fondo `#292929` y bordes sutiles `#323232` para los datos del cliente y los detalles de la oferta.
   - El footer de acciones (Volver y Cancelar) se integró a la tarjeta principal, usando `<button>` HTML puro para mantener consistencia de tamaños (`px-4 py-2`).
   - El botón principal "ir al turno" se redujo de tamaño (`size="sm"` convertido a `<button>` con `px-4 py-2` para igualar proporción al resto de los botones).

2. **`frontend/src/features/notifications/pages/ReminderDetailsPage.jsx`**
   - Se transformó la maqueta inicial clara para usar la paleta oscura: fondo general `#202020` y tarjetas `#292929`.
   - Se incluyó la cabecera "Un profesional envio una oferta a tu solicitud." tal cual aparece en la referencia visual.
   - Se implementó la vista horizontal compacta con el avatar a la izquierda, el badge de estado "PENDIENTE" y el botón "Ver detalle" junto con el icono de calendario en la parte inferior.
   - El footer se igualó arquitectónicamente al de Oferta Aceptada y Settings, anidado dentro de la tarjeta principal.

3. **`frontend/src/features/notifications/data/mockProfessionalNotifications.js`**
   - Se enrutó el clic de la notificación con ID "n3" hacia `/professional/offers/3/details`.
   - Se enrutó el clic de la notificación con ID "n4" hacia `/professional/reminders/4/details`.
