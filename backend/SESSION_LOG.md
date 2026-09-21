## [06/09/2026]
**Hecho:** Implementación de endpoints de Autenticación (POST `/api/v1/auth/register` y POST `/api/v1/auth/login`) correspondientes a HU-01 y HU-02. Se crearon tests unitarios con Jest y colección de Postman. Se documentó todo en `context/reportesImplementacion/Auth_Implementation_Report.md`.
**Pendiente:** Confirmar variables de entorno en producción. Enlazar frontend real cuando estén listos los formularios axios.
**Decisiones:** Se decidió usar `first_name` y `last_name` en el meta_data de Supabase para disparar correctamente el trigger `handle_new_user`, respetando las variables `nombre` y `apellido` del body esperado de frontend. Se corrigió la estructura de respuesta para que devuelva los datos sin el envoltorio "data", cumpliendo estrictamente con la regla 5 del prompt.

## [13/09/2026]
**Hecho:** Endpoints creados para los perfiles de cliente y profesional (GET y PATCH para `/profile` y `/profile/settings`), correspondientes a las Historias de Usuario de los perfiles públicos y configuraciones.
Se implementó la arquitectura de 3 capas (`routes`, `controllers`, `services`) junto a la validación con Zod en los middlewares.
**Pendiente:** Agregar endpoints de notificaciones y métodos de pago correspondientes a historias de usuario futuras. 
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
