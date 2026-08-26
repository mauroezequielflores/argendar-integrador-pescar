# Plan de Implementación: Detalle de Calificación de Servicio

## Resumen
Desarrollo de la vista interactiva (`ReviewDetailsPage`) encargada de renderizar la calificación o reseña que un cliente le deja al profesional. Esta vista será construida manteniendo el *Dark Theme* uniforme del panel de notificaciones y presentará tanto la información de la reseña como un mecanismo de apelación para seguridad.

## Tareas a Ejecutar

1. **Routing (`AppRouter.jsx`)**
   - Importar el nuevo componente `ReviewDetailsPage`.
   - Definir la ruta dinámica en el módulo del profesional: `/professional/reviews/:id/details`.

2. **Mocking (`mockProfessionalNotifications.js`)**
   - Actualizar el evento estático `n5` ("Un cliente calificó tu servicio") para que su prop `href` redireccione correctamente al detalle de la reseña recién configurada.

3. **Construcción de la Pantalla Principal (`ReviewDetailsPage.jsx`)**
   - Utilizar el patrón estándar de contenedor `Card` oscuro.
   - **Tarjeta de Reseña (Principal):**
     - Desarrollar la cabecera del cliente con el nombre, avatar y el tag "CLIENTE VERIFICADO".
     - Construir el sistema de *rating* utilizando íconos de estrellas (Heroicons) en color `#F78736` (Naranja).
     - Incorporar la caja de comentario de la reseña (*quote box*) con estilo itálico.
     - Botón de "Ver detalle" apuntando a la reserva (`/professional/appointments/:id`).
   - **Tarjeta de Soporte (Secundaria):**
     - Añadir un apartado enfocado a políticas de revisión con ícono de interrogante y un botón primario sólido blanco "Contactar a soporte" que dispare la navegación hacia `/professional/help`.
   - **Footer:**
     - Botones clásicos de retorno integrados de forma transparente ("Volver", "Cancelar").

## Verificación Esperada
La renderización de la tarjeta de Calificación debe ser completamente fiel al mock visual, permitiendo leer el contenido sin distracciones visuales gracias al correcto balance del espaciado (margins y paddings) y la paleta de colores implementada.
