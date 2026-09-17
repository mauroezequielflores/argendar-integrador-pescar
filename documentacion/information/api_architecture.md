# Arquitectura de la API y Conexiones Internas

Este documento sirve como referencia rápida para entender cómo se conectan los archivos del backend (Rutas, Controladores y Servicios), qué propósito tienen y a qué funcionalidad del negocio responden.

## Arquitectura Base (3 Capas)
1. **Rutas (`src/routes/`)**: Definen la URL, montan middlewares (autenticación, rol, validación) y delegan la ejecución al controlador.
2. **Controladores (`src/controllers/`)**: Extraen datos del `Request`, llaman al servicio y envían la respuesta al cliente. Atrapan errores y los envían al `next(error)`.
3. **Servicios (`src/services/`)**: Ejecutan la lógica de negocio pura. Hablan con Supabase. Retornan datos limpios o lanzan `AppError` estructurados.

---

## 1. Módulo de Autenticación
- **Propósito**: Registro e Inicio de sesión.
- **Rutas**: `routes/authRoutes.js` (`/api/v1/auth`)
  - `POST /register`: Registra un usuario y hace login automático (vía frontend logic en context, pero en backend registra en Supabase Auth).
  - `POST /login`: Loguea devolviendo JWT y userData.
  - `PATCH /change-password`: Cambia la contraseña del usuario autenticado (requiere JWT). Utiliza la API de administrador de Supabase para evitar conflictos de sesión en el servidor.
- **Controlador**: `controllers/authController.js`
- **Esquemas de Validación**: `middlewares/schemas/authSchemas.js`

---

## 2. Módulo de Perfil del Cliente
- **Propósito**: Visualización y edición del perfil público y configuraciones privadas del cliente.
- **Rutas**: `routes/clientRoutes.js` (`/api/v1/client`)
  - `GET /profile`: Retorna perfil básico y últimas opiniones recibidas.
  - `PATCH /profile`: Actualiza biografía y URLs de imágenes.
  - `GET /profile/settings`: Retorna PII (DNI, Teléfono, Ubicación) y sus estados de verificación.
  - `PATCH /profile/settings`: Actualiza PII. Invalida verificaciones tras el cambio y bloquea alteración de DNI ya verificado.
- **Controlador**: `controllers/clientController.js`
- **Servicio**: `services/clientService.js`
- **Middlewares Específicos**: Requiere JWT (`authMiddleware`) y rol de cliente (`requireRole('client')`).
- **Esquemas**: `updateClientProfileSchema`, `updateClientSettingsSchema` (en `profileSchemas.js`).

---

## 3. Módulo de Perfil del Profesional
- **Propósito**: Visualización y edición del perfil público profesional, catálogo de habilidades, disponibilidad, certificaciones y configuraciones privadas.
- **Rutas**: `routes/professionalRoutes.js` (`/api/v1/professional`)
  - `GET /profile`: Arma el perfil uniendo las tablas `profiles`, `professional_profiles`, `professional_availability` y `professional_certifications`.
  - `PATCH /profile`: Actualiza los datos profesionales y reemplaza las configuraciones de disponibilidad/certificaciones entrantes.
  - `GET /profile/settings`: Retorna información PII de manera idéntica al cliente.
  - `PATCH /profile/settings`: Actualiza PII de manera idéntica al cliente.
- **Controlador**: `controllers/professionalController.js`
- **Servicio**: `services/professionalService.js`
- **Middlewares Específicos**: Requiere JWT y rol de profesional (`requireRole('professional')`).
- **Esquemas**: `updateProfessionalProfileSchema`, `updateProfessionalSettingsSchema`.

---

## Middlewares Globales
- **`authMiddleware.js`**: Extrae el Bearer token, verifica su validez usando la API oficial de Supabase Auth, obtiene el rol desde la base de datos y adjunta `req.user`.
- **`roleMiddleware.js`**: (`requireRole`) Bloquea peticiones de roles no deseados, devolviendo `403 Forbidden`.
- **`validateRequest.js`**: Parsea el request contra un esquema de **Zod** y detiene la petición devolviendo `400 Bad Request` en caso de fallas de tipo o formato.
- **`errorHandler.js`**: Captura todo error final y estandariza la respuesta JSON, ocultando rastros en producción pero ofreciendo el mensaje de error útil para debug.

---

## 4. Módulo de Ubicaciones (Marketplace)
- **Propósito**: Validar direcciones y consultar zonas activas.
- **Rutas**: `routes/clientRoutes.js` (`/api/v1/client/locations`)
  - `GET /locations/zones`: Devuelve zonas habilitadas.
  - `POST /locations/validate`: Valida dirección contra la zona/servicio (usa un mock de Google Maps temporalmente).
- **Controlador**: `controllers/locationController.js`
- **Servicio**: `services/locationService.js` (y `googleMapsService.js`)

---

## 5. Módulo de Solicitudes (Requests) y Agenda del Cliente
- **Propósito**: Publicar nuevas necesidades de trabajo y gestionar el historial y seguimiento.
- **Rutas principales**:
  - `routes/jobRequestsRoutes.js` (`/api/v1/job-requests`)
    - `POST /`: Crea una nueva solicitud (Job Request).
    - `GET /`: Devuelve las solicitudes creadas por el cliente para visualizar en la agenda.
  - `routes/clientRoutes.js` (`/api/v1/client`)
    - `GET /marketplace`: Devuelve la vista principal del cliente (profesionales y solicitudes activas).
    - `GET /agenda`: Devuelve listado de turnos/solicitudes (tab=solicitudes|proximos|historial).
    - `GET /agenda/:id`: Devuelve el detalle del turno.
    - `POST /agenda/:id/cancel`: Cancela el turno.
    - `POST /agenda/:id/confirm-completion`: Completa el turno.
- **Controladores**: `controllers/JobRequestsController.js`, `controllers/requestController.js`, `controllers/agendaController.js`
- **Servicios**: `services/JobRequestsService.js`, `services/requestService.js`, `services/agendaService.js`

---

## 6. Módulo de Marketplace Profesional
- **Propósito**: Visualizar solicitudes para ofertar y proponer cotizaciones.
- **Rutas**: `routes/professionalRoutes.js` (`/api/v1/professional`)
  - `GET /marketplace/requests`: Listado de solicitudes con cálculo de distancias (Google Maps mock) y paginado.
  - `GET /marketplace/requests/:id`: Detalle de solicitud para postulación.
  - `POST /offers`: Enviar una oferta con seña a una solicitud.
- **Controlador**: `controllers/requestController.js` (reutilizado), `controllers/offerController.js`
- **Servicio**: `services/requestService.js`, `services/offerService.js`

---

*(Este documento debe actualizarse a medida que se integren futuros módulos).*
