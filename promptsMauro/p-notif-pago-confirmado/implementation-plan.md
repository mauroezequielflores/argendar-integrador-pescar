# Plan de Implementación: Detalle de Pago Confirmado

## Resumen
Desarrollo de la pantalla de detalle de **Pago Confirmado** para el profesional (`PaymentConfirmedDetailsPage`) y su mock respectivo, en congruencia visual con las otras vistas de notificaciones (modo oscuro y componentes estandarizados).

## Elementos a Desarrollar

1. **Mock de la Notificación**
   - **Archivo:** `mockProfessionalNotifications.js`
   - Incorporar la notificación "Pago confirmado" con el ID `n6`, empleando `CreditCardIcon` azul, y enrutando la acción principal hacia la ruta de detalles de pagos.

2. **Registro de Ruta en `AppRouter.jsx`**
   - Nueva ruta registrada: `/professional/payments/:id/details`, enlazada al componente a desarrollar.

3. **Construcción de la Vista `PaymentConfirmedDetailsPage.jsx`**
   - **Estructura base:** Reutilización de la matriz arquitectónica (`bg-[#202020]` y contenedor de `Card`).
   - **Encabezado:** Texto explicativo "Se acredito correctamente el pago de su proximo turno".
   - **Tarjeta del Profesional/Servicio:** Tarjeta superior `bg-[#292929]` compartiendo el diseño de Turnos con avatar, nombre, fecha y el botón en estilo "ghost" ("Ver detalle ->").
   - **Tarjeta de Detalles de Pago (Tabla):**
     - Diseño de pares de clave/valor intercalados con divisores en `#323232`.
     - Campo **Estado** resaltado con fondo blanco y texto oscuro ("CONFIRMADO").
     - Campos: Nº de Operación, Método, Fecha y Monto Pagado, todos en paleta de grises `#A8A8AA` y blancos de lectura `#FFFFFF`.
   - **Footer Integrado:** Replicar botones estandarizados "Volver" y "Cancelar" dentro de la misma `Card` principal.

## Verificación a Realizar
- Ingresar a la aplicación en la interfaz de Profesional y visualizar la lista de notificaciones.
- Confirmar el renderizado visual del item en la lista y su funcionalidad al recibir el evento click.
- Validar layout y paddings en la vista detallada de "Pago confirmado".
