# Documentación de la Base de Datos - Proyecto Argendar

Este documento mantiene el contexto actualizado sobre la estructura de la base de datos de Supabase para el proyecto **Argendar**. Sirve como referencia central para implementar nuevas funcionalidades y entender las relaciones entre entidades.

## Resumen del Esquema (Esquema `public`)

El proyecto Argendar es una plataforma que conecta clientes con profesionales de servicios. El esquema público está diseñado alrededor de la gestión de usuarios (clientes y profesionales), solicitudes de trabajo (requests), cotizaciones (offers), turnos (appointments) y pagos (payments).

### 1. Gestión de Usuarios y Perfiles

#### `profiles`
Tabla principal de usuarios que se vincula con la tabla `auth.users` de Supabase.
- **Campos clave:** `id`, `role` (enum: `client`, `professional`, `administrator`), `first_name`, `last_name`, `status` (enum: `active`, `disabled`, `deleted`).
- **Verificaciones y datos personales:** `dni`, `phone`, `location`, `dni_verified`, `phone_verified`.
- **Configuraciones:** `email_alerts`, `phone_alerts`.

#### `professional_profiles`
Información detallada exclusiva para usuarios con rol `professional`.
- **Campos clave:** `profile_id` (FK a `profiles.id`), `category_id` (FK a `service_categories.id`).
- **Detalles laborales:** `hourly_rate`, `headline`, `skills` (JSONB), `license_number`.
- **Métricas y alcance:** `service_area`, `coverage_radius_km`, `rating_avg`, `reviews_count`, `is_verified`.

#### `professional_availability`
Disponibilidad horaria de los profesionales.
- **Campos clave:** `profile_id`, `day`, `time_range`.

#### `professional_certifications`
Certificados o acreditaciones subidas por los profesionales para validar sus conocimientos.
- **Campos clave:** `profile_id`, `name`, `issuer`, `file_path`, `is_verified`.

### 2. Categorías y Zonas

#### `service_categories`
Clasificación de los servicios ofrecidos en la plataforma (ej. Plomería, Electricidad).
- **Campos clave:** `id`, `name`, `slug`, `icon`, `is_active`.

#### `zones`
Ubicaciones y zonas de cobertura o agrupación geográfica.
- **Campos clave:** `id`, `name`, `city`, `province`, `active`.

### 3. Solicitudes de Trabajo (Requests) y Ofertas

#### `requests`
Solicitudes de trabajo publicadas por los clientes.
- **Campos clave:** `id`, `client_id` (FK a `profiles`), `category_id` (FK a `service_categories`), `status` (enum: `open`, `offered`, `scheduled`, `completed`, `cancelled`).
- **Detalles del trabajo:** `title`, `description`, `date_preference`, `estimated_budget`, `is_emergency`, `has_materials`, `installation_age`, `time_preference`.
- **Ubicación:** `address`, `neighborhood`, `city`, `latitude`, `longitude`.

#### `request_photos`
Imágenes adjuntas a una solicitud de trabajo para dar más contexto.
- **Campos clave:** `request_id`, `storage_path`, `position`.

#### `offers`
Propuestas económicas o presupuestos enviados por los profesionales a una solicitud.
- **Campos clave:** `id`, `request_id`, `professional_id`.
- **Condiciones:** `amount`, `proposed_deposit`, `proposed_date`, `proposed_time`, `message`.
- **Estado:** `status` (enum: `pending`, `accepted`, `rejected`, `withdrawn`).

### 4. Turnos (Appointments) y Pagos (Payments)

#### `appointments`
Trabajos o turnos confirmados luego de que un cliente acepta una oferta.
- **Campos clave:** `id`, `offer_id` (único, FK a `offers`), `scheduled_at`, `status` (enum: `confirmed`, `rescheduled`, `completed`, `cancelled`).
- **Otros:** `notes`.

#### `payments`
Registro y seguimiento de pagos para los turnos confirmados.
- **Campos clave:** `id`, `appointment_id` (único, FK a `appointments`).
- **Monto:** `total_amount`, `deposit_amount`, `remaining_amount` (columna calculada).
- **Transacción:** `method` (enum: `cash`, `mercadopago`, `transfer`, `credit_card`), `status` (enum: `pending`, `partial`, `paid`, `refunded`), `external_operation_id`.

### 5. Reseñas y Notificaciones

#### `reviews`
Calificaciones y comentarios dejados de un usuario a otro (generalmente de cliente a profesional tras finalizar un trabajo).
- **Campos clave:** `reviewer_id`, `reviewee_id`, `rating` (1 al 5), `comment`.

#### `notifications`
Sistema de alertas in-app para los usuarios.
- **Campos clave:** `user_id`, `type`, `title`, `description`, `is_read`.
- **Relaciones dinámicas:** `related_entity_id`, `related_entity_type`, `metadata` (JSONB).

---

## 📌 Guía de Actualización
*Cada vez que se ejecuten migraciones en Supabase añadiendo tablas, columnas o cambiando lógicas de negocio, este documento deberá actualizarse para reflejar el estado actual de la base de datos.*
