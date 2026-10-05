## [04/10/2026] (HU admin 05 — Bandeja de consultas)
**Hecho:** `GET /api/v1/admin/inquiries`, `GET /api/v1/admin/inquiries/:id`, `POST /api/v1/admin/inquiries/:id/reply` y `POST /api/v1/support/tickets` (cliente/profesional). Archivos: `services/adminInquiriesService.js`, `controllers/adminInquiriesController.js`, `middlewares/schemas/adminInquiriesSchemas.js`, `services/supportService.js`, `controllers/supportController.js`, `routes/supportRoutes.js`, `middlewares/schemas/supportSchemas.js`; rutas admin en `routes/adminRoutes.js` y montaje de `/api/v1/support` en `app.js`. Frontend: bandeja de `/admin/reports` conectada (service, hook, mappers, paginación, modal con detalle/respuesta) y formularios de Ayuda de cliente (`ContactFormCard.jsx`) y profesional (`ProfessionalHelpPage.jsx`) enviando de verdad (`features/help/services/supportService.js`).
**Migración ejecutada por el usuario en Supabase:** tabla `support_tickets` (con índices y RLS activado sin políticas; solo el backend con service_role la lee/escribe).
**Pendiente:** el usuario ve la respuesta solo como notificación (`type: support_reply`, ícono de campana por defecto en ambos centros de notificaciones); no hay pantalla donde releer el historial de sus consultas. El contador `ticket_number` consumió el 1 en una prueba (la primera consulta real será CON-000002; reiniciable con `ALTER TABLE public.support_tickets ALTER COLUMN ticket_number RESTART WITH 1;`).
**Decisiones:** Código `CON-000001` (no `REQ-`). La búsqueda acepta número, UUID completo o texto del asunto. El email solo viaja en el detalle (sale de Auth). Responder es único: 409 `INQUIRY_ALREADY_ANSWERED`, protegido contra respuestas simultáneas. Prueba end-to-end con datos creados y borrados por el script.

## [04/10/2026] (HU admin 04 — Moderación)
**Hecho:** `GET /api/v1/admin/moderation/:entity` y `PATCH /api/v1/admin/moderation/:entity/:id` (entity: requests | offers | reviews | appointments; 10 por página; búsqueda por número de orden o UUID). Archivos: `services/adminModerationService.js`, `controllers/adminModerationController.js`, `middlewares/schemas/adminModerationSchemas.js`, rutas en `routes/adminRoutes.js`; `utils/adminLookups.js` ampliado (`fetchProfileSummaries`, `fetchRowsByIds`, `pick`). Frontend de `/admin/moderation` conectado (service, hook, mappers, constantes, paginación en cada pestaña).
**Migración ejecutada por el usuario en Supabase:** `moderation_status TEXT NOT NULL DEFAULT 'active' CHECK (...)` y `order_number BIGINT GENERATED ALWAYS AS IDENTITY` en `requests`, `offers`, `reviews` y `appointments` (todos los registros existentes quedaron `active`).
**Pendiente:** EFECTO REAL (decisión del usuario: hacerlo después, en un paso aparte y acotado): que desactivar/eliminar oculte la solicitud del marketplace, la oferta de las ofertas del cliente (y no se pueda aceptar) y la calificación de los perfiles y del promedio. Los turnos quedan SOLO como estado. Hay ~60 puntos de lectura en 12 servicios + 3 funciones SQL (`get_marketplace_requests`, `create_offer_and_notify`, `accept_offer_and_schedule`); la propuesta es filtrar en Node, uno por uno. Verificar que el trigger de `rating_avg`/`reviews_count` considere `moderation_status`.
**Decisiones:** Estado `disabled` (no `hidden`) para coincidir con "Desactivar". `deleted` es definitivo (409 `ITEM_DELETED`). El admin ve los tres estados en el listado.

## [04/10/2026] (HU admin 03 — Transacciones)
**Hecho:** `GET /api/v1/admin/transactions` (search, page, limit; 10 por defecto), solo lectura. Archivos: `services/adminTransactionsService.js`, `controllers/adminTransactionsController.js`, `middlewares/schemas/adminTransactionsSchemas.js`, ruta en `routes/adminRoutes.js`. Nuevo `utils/adminLookups.js` (fullName, fetchProfileNames, resolvePaymentParties) compartido con el dashboard, que se refactorizó para usarlo. Frontend de `/admin/transactions` conectado (service, hook, mappers, paginación).
**Migración ejecutada por el usuario en Supabase:** `ALTER TABLE public.payments ADD COLUMN transaction_number BIGINT GENERATED ALWAYS AS IDENTITY;` (los 5 pagos existentes quedaron numerados 1–5).
**Pendiente:** Reembolsar/cancelar (botón desactivado; sin endpoints a propósito). Probar con un token de admin desde `api.http`.
**Decisiones:** `user` = cliente que pagó, `professional` aparte. La búsqueda acepta número (`126`, `TRX-000126`) o UUID completo; cualquier otro texto devuelve vacío. Estados: paid→COMPLETADO, pending→PENDIENTE, partial→PARCIAL, refunded→REEMBOLSADO.

## [04/10/2026] (HU admin 02 — Usuarios)
**Hecho:** `GET /api/v1/admin/users` (role, search, page, limit; 10 por defecto), `PATCH /api/v1/admin/users/:id/status` y `DELETE /api/v1/admin/users/:id` (borrado lógico). Archivos: `services/adminUsersService.js`, `controllers/adminUsersController.js`, `middlewares/schemas/adminUsersSchemas.js`, rutas en `routes/adminRoutes.js`. Frontend de `/admin/users` conectado (service, hook, mappers, `components/ui/Pagination.jsx`).
**Pendiente:** El bloqueo solo guarda `profiles.status`; `authMiddleware` y `loginUser` no rechazan cuentas `disabled`/`deleted` (decisión del usuario: dejarlo para más adelante). Probar PATCH/DELETE exitosos desde la UI (no se probaron contra datos reales).
**Decisiones:** Los administradores no se pueden modificar (409 `ADMIN_ACCOUNT_PROTECTED` / `SELF_MODIFICATION_NOT_ALLOWED`). Búsqueda por palabras en nombre/apellido o UUID completo. Página fuera de rango devuelve lista vacía (no error).

## [04/10/2026] (ampliación)
**Hecho:** `loginUser` ahora devuelve `role` desde `profiles.role` (fallback a `user_metadata.role`). Antes usaba solo los metadatos de Auth y un admin cambiado desde el panel seguía redirigiendo como su rol anterior. `recent-activity` incluye `actor {name, role}` y, en pagos, `status`. Frontend del dashboard conectado a los 3 endpoints (`dashboardService`, `useDashboardData`, `utils/dashboardMappers.js`, ejes dinámicos del gráfico).
**Pendiente:** Probar con un token de admin los 400 de validación. Corregir `code` de AppError en 401/403 (hoy `INTERNAL_SERVER_ERROR`).
**Decisiones:** "Ver todo" pide 50 eventos en vez de 10 (no hay pantalla de destino en Figma). Los estados de la tabla se derivan del tipo de evento.

## [04/10/2026]
**Hecho:** HU admin 01 (Dashboard). Endpoints `GET /api/v1/admin/dashboard/metrics`, `/activity-chart` y `/recent-activity`.
- `src/routes/adminRoutes.js` (auth + `requireRole(ROLES.ADMIN)` para todo `/admin/*`), `src/controllers/adminDashboardController.js`, `src/services/adminDashboardService.js`, `src/middlewares/schemas/adminDashboardSchemas.js`.
- `src/app.js`: import y montaje en `/api/v1/admin`.
- `backend/API_DOCS.md` y `backend/api.http` creados (solo endpoints de admin por ahora).

**Pendiente:** Prueba real contra Supabase (el entorno corre en Docker; solo se verificó la sintaxis). Frontend del dashboard sigue con datos mock.
**Decisiones:** `recent-activity` se arma con un UNION de `created_at` de `profiles`, `requests`, `offers` y `payments`; NO se creó la tabla `platform_activity_logs` (se podrá migrar más adelante). `activeRequests` no respeta `period` porque es un estado actual. Los nombres se resuelven con una consulta aparte a `profiles` para no depender de nombres de FK.

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

## [30/09/2026]
**Hecho:** Implementación del backend para el Chatbot asistido por IA (API Gemini REST con fetch nativo):
1. `src/utils/constants.js`: Se añadió `SYSTEM_INSTRUCTION` (guardrails del dominio Argendar) y el código de error `GEMINI_SERVICE_ERROR`.
2. `src/services/geminiService.js`: Integración desacoplada con la API REST de Gemini (v1beta) usando la función nativa `fetch` de Node.js (cero dependencias externas instaladas).
3. `src/services/chatbotService.js`: Orquestador del mensaje, obtención del nombre de usuario desde la tabla `profiles` e inyección de contexto.
4. `src/controllers/chatbotController.js`: Controlador delgado con validaciones de entrada (longitud de caracteres, mensaje no vacío).
5. `src/routes/chatbotRoutes.js`: Ruta `POST /api/v1/chatbot/message` protegida con `authMiddleware`.
6. `src/app.js`: Import y montaje del nuevo router de chatbot bajo `/api/v1/chatbot`.
7. `.env` & `.env.example`: Se agregó la variable de entorno `GEMINI_API_KEY`.
**Pendiente:** Configurar `GEMINI_API_KEY` en producción cuando esté disponible.
**Decisiones:** Se utilizó `fetch` nativo para evitar instalar nuevos paquetes `npm` en `package.json`. No se modificó ningún archivo dentro de la carpeta `/frontend/`.