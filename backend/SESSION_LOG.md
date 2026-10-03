## [06/09/2026]
**Hecho:** Implementación de endpoints de Autenticación (POST `/api/v1/auth/register` y POST `/api/v1/auth/login`) correspondientes a HU-01 y HU-02. Se crearon tests unitarios con Jest y colección de Postman. Se documentó todo en `context/reportesImplementacion/Auth_Implementation_Report.md`.
**Pendiente:** Confirmar variables de entorno en producción. Enlazar frontend real cuando estén listos los formularios axios.
**Decisiones:** Se decidió usar `first_name` y `last_name` en el meta_data de Supabase para disparar correctamente el trigger `handle_new_user`, respetando las variables `nombre` y `apellido` del body esperado de frontend. Se corrigió la estructura de respuesta para que devuelva los datos sin el envoltorio "data", cumpliendo estrictamente con la regla 5 del prompt.

## [13/09/2026]
**Hecho:** Endpoints creados para los perfiles de cliente y profesional (GET y PATCH para `/profile` y `/profile/settings`), correspondientes a las Historias de Usuario de los perfiles públicos y configuraciones.
Se implementó la arquitectura de 3 capas (`routes`, `controllers`, `services`) junto a la validación con Zod en los middlewares.
**Pendiente:** Agregar endpoints de notificaciones y métodos de pago correspondientes a historias de usuario futuras. 
**Decisiones:** 
- En el servicio de profesional, la actualización de disponibilidades y certificaciones funciona mediante un borrado y re-inserción atómica simplificada para evitar inconsistencias de datos, sin usar un ORM (como establece el prompt, usando `supabase.from()`).
- Los PII settings (ej. DNI) comparten la misma lógica de negocio e inmutabilidad tras verificación tanto para clientes como para profesionales.
- Se ha generado la documentación respectiva sobre la interrelación de APIs en `documentacion/information/api_architecture.md`.

## [16/09/2026]
**Hecho:** Endpoints creados para la feature Marketplace (JobRequests, Marketplace, Offers) correspondientes a las HU US-client-create-request, US-Marketplace-Profesional, US-Crear-Oferta y US-Detalle-Solicitud. Se crearon los esquemas de validación con Zod, controladores, servicios y rutas de acuerdo a la arquitectura en 3 capas. Se generó un script SQL para funciones RPC (transaccionalidad). Se ejecutó el script SQL (002_marketplace_rpcs.sql) en Supabase para habilitar la creación atómica de ofertas y su aceptación.
**Pendiente:** Conectar el Frontend restante.
**Decisiones:** Se usaron RPCs de Postgres para realizar las escrituras multi-tabla garantizando atomicidad y consistencia en el backend. Las distancias (Google Maps) se envían de forma simulada/mock matemática hasta que se provea una API KEY oficial.
- (Añadido) Se implementaron los endpoints correspondientes a la historia de usuario `US-client-agenda.md` bajo la ruta `/api/v1/appointments`, manejando las solapas de "solicitudes", "próximos" e "historial".

## [18/09/2026]
**Hecho:** Implementación de endpoints de Listado y Gestión de Notificaciones del Cliente (HU Listado de Notificaciones). Se crearon el servicio (clientNotificationService.js), el controlador (clientNotificationController.js), el enrutador (clientNotificationRoutes.js) y las validaciones de schema Zod (notificationSchemas.js). Se montó la ruta en app.js bajo /api/v1/client/notifications.
**Pendiente:** Agregar la funcionalidad de Calificación de Servicio Finalizado (Review).
**Decisiones:** Se montaron las rutas de notificaciones del cliente en app.js importando `clientNotificationRoutes` bajo el prefijo general del cliente.

## [19/09/2026]
**Hecho:** Implementación del endpoint de Calificación de Servicio (Reviews) desde Notificaciones. Se crearon los esquemas de validación Zod, el controlador `clientReviewController`, el servicio `clientReviewService` y el enrutador `clientReviewRoutes`.
**Pendiente:** Ejecutar el script SQL en Supabase para añadir `appointment_id` y `tags` a la tabla `reviews`.
**Decisiones:** Se decidió usar un nuevo endpoint `POST /api/v1/client/reviews` que recibe `notificationId` en lugar del `appointmentId` directo, cruzando la información de las notificaciones y los turnos internamente para garantizar seguridad e integridad.

## [21/09/2026]
**Hecho:** Implementación del servicio de creación automática de notificaciones (`notificationCreatorService.js`) correspondiente a la historia de usuario 'Creación Automática de Notificaciones para el Cliente'.
**Pendiente:** Llamar a este servicio desde los flujos de creación de ofertas, confirmación de pagos y finalización/cancelación de turnos (cuando estos endpoints sean desarrollados).
**Decisiones:** Se ha diseñado la función `createNotification` como "fire-and-forget" capturando internamente los errores para no interrumpir el flujo principal de negocio.

## [21/09/2026] (Parte 2)
**Hecho:** Implementación de endpoints de Listado y Gestión de Notificaciones del Profesional (HU Notificaciones del Profesional). Se crearon `professionalNotificationService.js`, `professionalNotificationController.js` y `professionalNotificationRoutes.js`. Se montó la ruta en `app.js` bajo `/api/v1/professional/notifications`.
**Pendiente:** Agregar endpoints de creación de ofertas y pagos para que puedan disparar notificaciones reales.
**Decisiones:** Se montaron las rutas bajo el scope de `/professional`, utilizando el middleware de roles `requireRole('professional')`. Como la tabla `notifications` ya existía previamente para los clientes, se reutilizó la misma tabla sin necesidad de crear una nueva migración, dado que la estructura de la base de datos es compartida.

## 2026-09-23
**Hecho:** Filtro de radio para marketplace. Creación de migración 004_marketplace_requests_filter para modificar la RPC get_marketplace_requests, e integración frontend/backend para visualizar requests fuera del rango con su respectiva etiqueta visual.
**Pendiente:** Nada pendiente sobre esta feature.
**Decisiones:** Se modificó la RPC existente y se actualizó ProfessionalMarketplacePage.jsx y MarketplaceService.js manteniendo las 3 capas requeridas.

## [23/09/2026]
**Hecho:** Implementación de los 5 endpoints de detalle del profesional (HU: Vistas de Detalles).
- `GET /api/v1/professional/offers/:id`
- `GET /api/v1/professional/reminders/:id`
- `GET /api/v1/professional/cancellations/:id`
- `GET /api/v1/professional/payments/:id`
- `GET /api/v1/professional/reviews/:id`

Archivos creados:
- `src/services/professionalDetailsService.js` (lógica con JOINs relacionales y filtros IDOR)
- `src/controllers/professionalDetailsController.js` (controladores delgados)
- `src/routes/professionalDetailsRoutes.js` (rutas protegidas con `requireRole('professional')`)
- `src/app.js` modificado: import y montaje del nuevo router.

**Pendiente:** Integrar llamadas a `notificationCreatorService.createNotification()` en flujos de negocio de ofertas, pagos y finalización de turnos.
**Decisiones:** Los endpoints `/reminders/:id` y `/cancellations/:id` comparten la misma función de servicio `getAppointmentById()` ya que ambos leen la tabla `appointments`. El filtro IDOR en `appointments` y `payments` se aplica manualmente en el servicio, verificando que `professional_id` del JOIN coincida con `req.user.id`.

## [25/09/2026] 
**Hecho:** Implementación del backend para notificaciones de recordatorio de turno dirigidas al cliente (1 día antes del turno confirmado):
1. Se extendió `appointmentReminderService.js` para detectar turnos confirmados en ventana de 36 horas y generar notificaciones tanto para el profesional como para el cliente, utilizando consultas desacopladas seguras e idempotencia estricta para evitar duplicados.
2. Se enriqueció `clientNotificationService.js` para resolver automáticamente datos del turno, del profesional y del servicio ante cualquier notificación de tipo `reminder` o `appointment_reminder`.
3. Se añadió el endpoint `POST /api/v1/client/reminders/check` en `clientNotificationRoutes.js` y `clientNotificationController.js`.
**Pendiente:** Probar visualmente en frontend cuando el cliente abra sus notificaciones o cuando se indique avanzar con la UI.
**Decisiones:** Se aseguró compatibilidad mapeando internamente `appointment_reminder` a `reminder` para el cliente de modo que coincida con las expectativas de la UI y los componentes existentes (`ReminderSummary.jsx`).

## [25/09/2026] (Parte 2) 
**Hecho:** Conexión de punta a punta del flujo de calificación de servicio (Reviews) y finalización de turnos:
1. `clientReviewService.js`: Se robusteció la validación desacoplada y se agregó resolución de `appointmentId` tanto desde `metadata.appointmentId` como desde `related_entity_id`, marcando la notificación como leída tras insertar la calificación.
2. `clientNotificationService.js`: Se integró el enriquecimiento de notificaciones de tipo `rating` para inyectar datos del profesional y turno al modal de calificación del cliente (`RatingModal`).
3. `NotificationsPage.jsx`: Se conectó `submitReviewMutation.mutate(reviewData)` al evento `onSubmitSuccess` del `RatingModal`.
4. `professionalDetailsRoutes.js` y `professionalDetailsService.js`: Se implementó el endpoint `POST /api/v1/professional/appointments/:id/complete` que finaliza el turno (`status = 'completed'`) y genera en simultáneo la alerta de "Trabajo finalizado" (`job_finished`) para el profesional y "¡Calificá tu experiencia!" (`rating`) para el cliente.

## [25/09/2026] (Parte 3) 
**Hecho:** Implementación de la notificación y detalle de calificación para el profesional (`review_received`):
1. `backend/src/services/clientReviewService.js`: Al insertar una calificación desde el cliente (`createReview`), se genera automáticamente una notificación de tipo `review_received` para el profesional con los metadatos completos (`clientName`, `serviceName`, `rating`, `tags`, `comment`, `appointmentId`, `reviewId`).
2. `backend/src/services/professionalDetailsService.js`: Se robusteció `getReviewById` con consultas desacopladas seguras a Supabase, resolución por ID de reseña o notificación, soporte de tags, título del servicio asociado e ID de oferta para navegación, protegiendo con validación IDOR.
3. `frontend/src/features/notifications/services/professionalNotificationService.js`: Se agregó el método `getReviewDetail(reviewId)` para consumir `GET /api/v1/professional/reviews/:id`.
4. `frontend/src/features/notifications/hooks/useProfessionalNotifications.js`: Se implementó la clave de query `PROF_NOTIFICATIONS_KEYS.reviewDetail`, el mapper `mapReviewDetail` y el hook `useProfessionalReviewDetailQuery(reviewId)` con stale time de 5 minutos.
5. `frontend/src/features/notifications/pages/ReviewDetailsPage.jsx`: Se reemplazaron los datos mockeados por el hook real `useProfessionalReviewDetailQuery`, implementando los 4 estados de la interfaz (Loading, Error, Empty, Success), renderizado dinámico de avatar, estrellas, comentario, chips de etiquetas/tags y navegación contextual.

## [26/09/2026]
**Hecho:** Implementación de enriquecimiento y visualización de la Notificación de Pago Confirmado para el Cliente y para el Profesional:
1. `backend/src/services/clientNotificationService.js`: Se agregaron formateadores (`formatPaymentMethod`, `formatPaymentDate`) y el enriquecimiento desacoplado relacional conectando `payments` → `appointments` → `offers` → `requests` & `profiles` (profesional), inyectando en `metadata` los datos de recibo (`operationNumber`, `paymentMethod`, `paymentDate`, `amount`, `paymentStatus`, `professionalName`, `serviceName`, `date`, `time`).
2. `backend/src/services/professionalDetailsService.js`: Se robusteció `getPaymentById` con consultas desacopladas seguras a Supabase, resolución por ID de pago, turno o notificación, validación estricta IDOR (`professional_id`), formateo de métodos de pago, fecha, montos e inyección de `offerId` para navegación contextual.
3. `frontend/src/features/notifications/services/professionalNotificationService.js`: Se implementó el método `getPaymentDetail(paymentId)` consumiendo `GET /api/v1/professional/payments/:id`.
4. `frontend/src/features/notifications/hooks/useProfessionalNotifications.js`: Se añadió `PROF_NOTIFICATIONS_KEYS.paymentDetail`, el transformador `mapPaymentDetail` y el hook `useProfessionalPaymentDetailQuery(paymentId)`.
5. `frontend/src/features/notifications/pages/PaymentConfirmedDetailsPage.jsx`: Reemplazo de mocks por el hook real `useProfessionalPaymentDetailQuery(id)` con los 4 estados de UI (Loading, Error, Empty, Success), renderizado dinámico de la tarjeta del turno, tabla de comprobante y navegación al detalle de la oferta.
**Pendiente:** Ninguno.
**Decisiones:** Se respetó estrictamente la arquitectura de 3 capas en backend y las pautas de reemplazo de mocks en frontend sin alterar componentes reutilizables ni alterar dependencias.
