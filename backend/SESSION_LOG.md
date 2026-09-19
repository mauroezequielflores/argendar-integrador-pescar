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
