# Plan de Implementación: Detalle de Turno Cancelado

## Resumen
Se implementará una nueva pantalla (`CancellationDetailsPage`) para visualizar los detalles de un turno que ha sido cancelado, siguiendo las especificaciones visuales de la historia de usuario correspondiente. Esta pantalla se construirá adhiriendo al modo oscuro base (Dark Theme) definido en las reglas de diseño del proyecto.

## Modificaciones a Realizar

1. **Nueva Pantalla: `CancellationDetailsPage.jsx`**
   - **Ruta del archivo:** `frontend/src/features/notifications/pages/CancellationDetailsPage.jsx`
   - **Estructura y diseño:**
     - Utilizar el componente `Card` principal con borde integrado y el color de fondo general `#202020`.
     - Implementar la cabecera superior indicando "Turno cancelado" junto a la fecha y hora extraídas de los datos.
     - Añadir un texto intermedio (*"[Nombre] ha cancelado tu turno."*).
     - Crear la tarjeta de resumen (fondo `#292929` y borde `#323232`) similar a los detalles de recordatorio, mostrando los datos del profesional/cliente, el estado "CANCELADO" e íconos descriptivos (reloj, calendario).
     - Incorporar la sección "Motivo de Cancelación" con una tarjeta oscura que muestre el texto descriptivo proveído en el mock.
     - Añadir el aviso de contacto de soporte mediante una caja de texto informativa.
     - Integrar un footer dentro de la `Card` principal, con los botones "Volver" y "Cancelar" estandarizados a las vistas previas.

2. **Registro de Ruta en `AppRouter.jsx`**
   - Asignar la ruta de acceso estático `/professional/cancellations/:id/details` dentro del scope del Profesional, enrutándola hacia `CancellationDetailsPage`.

3. **Actualización de Mock Data (`mockProfessionalNotifications.js`)**
   - Modificar la notificación identificada con "n2" (Turno cancelado) para que su campo `href` redireccione correctamente a la nueva vista.

## Verificación
- Abrir la interfaz de notificaciones.
- Navegar hacia "Turno cancelado".
- Verificar que el diseño de los bloques, botones y colores coincida exactamente con la referencia visual entregada.
