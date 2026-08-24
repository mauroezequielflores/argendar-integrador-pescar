# Reporte Técnico Integrado de Módulos — Argendar

Este documento consolida la especificación técnica, de diseño y de comportamiento funcional para los 7 módulos clave de la plataforma Argendar, estructurados con la misma metodología detallada utilizada en el [Módulo Mi Agenda](file:///wsl.localhost/Ubuntu/home/maur/argendar/argendar-integrador-pescar/docs/M%C3%B3dulo%20Mi%20agendatxt.txt) y fundamentada en la matriz de Historias de Usuario de [user_story_mapping_mvp.md](file:///wsl.localhost/Ubuntu/home/maur/argendar/argendar-integrador-pescar/docs/user_story_mapping_mvp.md) y las definiciones de [preguntas_abiertas_respuestas.md](file:///wsl.localhost/Ubuntu/home/maur/argendar/argendar-integrador-pescar/docs/preguntas_abiertas_respuestas.md).

---

## Tabla de Contenidos
1. [Módulo 1: Turnos (Rol Profesional)](#módulo-1-turnos-rol-profesional)
2. [Módulo 2: Perfil Profesional](#módulo-2-perfil-profesional)
3. [Módulo 3: Notificaciones (General / Profesional)](#módulo-3-notificaciones-general--profesional)
4. [Módulo 4: Marketplace (Cliente)](#módulo-4-marketplace-cliente)
5. [Módulo 5: Perfil (Cliente)](#módulo-5-perfil-cliente)
6. [Módulo 6: Turnos (Cliente)](#módulo-6-turnos-cliente)
7. [Módulo 7: Notificaciones (Cliente)](#módulo-7-notificaciones-cliente)

---

# Módulo 1: Turnos (Rol Profesional)

### 1. Objetivo
Permitir que los profesionales de servicios técnicos administren integralmente sus turnos asignados desde su panel principal, marcando el inicio del servicio ("En progreso"), consultando la ficha de diagnóstico completa y los datos de contacto del cliente (visibles únicamente post-seña), solicitando el cierre del trabajo realizado, gestionando cancelaciones justificadas y consultando el historial de actividades finalizadas o canceladas.

### 2. Usuarios principales
* **Profesional de Servicios Técnicos**

### 3. Entrada al flujo
* Accessible desde el menú principal de la plataforma mediante la opción **"Mi Agenda"** (vista Profesional).
* Redirección automática desde:
  * Notificación de **"¡Tu cotización fue aceptada!"** / **"Pago de seña confirmado"**.
  * Confirmación de una Oferta enviada que ha sido aceptada por el Cliente.

### 3.1 Datos enviados al Backend (Request)

#### A. Obtener Agenda del Profesional (`GET /api/v1/appointments`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `token` | JWT | Sí | Token del usuario autenticado (rol profesional) |
| `historial` | Boolean | No | `false` para Actividad en curso, `true` para Historial |
| `fecha` | Date | No | Filtra por fecha específica del turno |
| `estado` | Enum | No | Filtra por estado (`CONFIRMED`, `IN_PROGRESS`, `COMPLETION_REQUESTED`, `COMPLETED`, `CANCELLED`) |

**Validaciones del Backend:**
* Usuario autenticado con rol `professional`.
* Aplica políticas RLS (`professional_id = auth.uid()`).
* Retorna turnos ordenados cronológicamente por fecha/hora.

#### B. Obtener Detalle del Turno (`GET /api/v1/appointments/:id`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `appointmentId` | UUID | Sí | Identificador único del turno |
| `token` | JWT | Sí | Token del usuario autenticado |

**Validaciones del Backend:**
* El turno existe en la tabla `appointments`.
* El usuario pertenece al turno como profesional asignado.
* Revela teléfono y dirección del cliente **únicamente** si el estado del turno no está `CANCELLED` y se acreditó el pago de la seña.

#### C. Marcar Servicio como "En progreso" (`PATCH /api/v1/appointments/:id/in-progress`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `appointmentId` | UUID | Sí | Identificador del turno |
| `token` | JWT | Sí | Token del usuario profesional |

**Validaciones del Backend:**
* El turno está en estado `CONFIRMED`.
* La fecha actual coincide con la fecha agendada del turno (o tolerancia del mismo día).
* Actualiza el estado a `IN_PROGRESS`.

#### D. Solicitar Cierre de Trabajo (`PATCH /api/v1/appointments/:id/request-completion`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `appointmentId` | UUID | Sí | Identificador del turno |
| `token` | JWT | Sí | Token del usuario profesional |

**Validaciones del Backend:**
* El turno está en estado `IN_PROGRESS`.
* Establece la marca temporal `completion_requested_at`.
* Genera notificación automática `type = 'job_completed'` orientada al cliente.

#### E. Cancelar Turno (`POST /api/v1/appointments/:id/cancel`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `appointmentId` | UUID | Sí | Identificador del turno |
| `motivo` | String | No | Motivo explícito de la cancelación |
| `token` | JWT | Sí | Token del usuario autenticado |

**Validaciones del Backend:**
* El turno no se encuentra en estado `COMPLETED` ni `CANCELLED`.
* Actualiza estado a `CANCELLED`, registra `cancelled_by` y despacha notificación al cliente (`job_cancelled`).

---

### 4. Componentes de las pantallas

#### A. Pantalla HU-42 — Mi Agenda (Profesional)
* **Encabezado:** Título "Mi Agenda", descripción orientativa de trabajo en curso.
* **Barra de búsqueda & Filtros:** Búsqueda por nombre de cliente, dirección o rubro; filtro por fecha y estado.
* **Pestañas:**
  * **Actividad:** Muestra turnos `CONFIRMED` e `IN_PROGRESS` ordenados por proximidad cronológica. Cada tarjeta muestra: fecha/hora, cliente, dirección, rubro, monto acordado/seña, badge de estado y botón *"Ver detalle"*.
  * **Ofertas Pendientes:** Muestra las cotizaciones enviadas pendientes de aceptación o pago.
  * **Historial:** Muestra turnos `COMPLETED` y `CANCELLED` ordenados por fecha descendente.

#### B. Pantalla HU-43 — Detalle del Turno (Profesional)
* **Encabezado:** Número de turno, Estado en Badge, Fecha y Horario de la cita.
* **Información del Cliente:** Nombre del Cliente, Dirección de la visita y Teléfono (visibles tras la seña).
* **Diagnóstico técnico:** Cuestionario dinámico respondido por el cliente, galería de fotografías del problema, notas adicionales de la propuesta aceptada.
* **Información económica:** Presupuesto total cotizado, Seña percibida/abonada, Saldo pendiente de cobro al finalizar.
* **Acciones disponibles (dinámicas según estado):**
  * Si `CONFIRMED`: Botón *"Marcar En progreso"*, Botón *"Cancelar Turno"*.
  * Si `IN_PROGRESS`: Botón *"Solicitar Cierre del Trabajo"*, Botón *"Cancelar Turno"*.
  * Si `COMPLETION_REQUESTED`: Indicador *"Esperando confirmación del cliente"*.

#### C. Modal HU-46 — Cancelar Turno
* Centrado en pantalla con ícono de advertencia.
* Título: *"Cancelar Turno Agendado"*.
* Campo de texto opcional para justificar la cancelación.
* Botones: *"Confirmar Cancelación"* (destructivo) y *"Volver"*.

---

### 5. Estados
* **Mi Agenda:** Skeleton cards, Sin actividades asignadas, Actividades cargadas, Error de conexión.
* **Detalle del Turno:** Cargando datos, Información completa, Información de contacto bloqueada (pre-seña), Error de permisos.
* **Cancelación:** Modal abierto, Procesando (Spinner), Cancelación exitosa con toast informativo.

---

### 6. Requisitos
1. La dirección exacta y el teléfono del Cliente permanecen ocultos hasta la acreditación de la seña.
2. El Profesional solo puede marcar *"En progreso"* el mismo día fijado en la agenda para la cita.
3. La acción *"Solicitar Cierre"* no finaliza automáticamente el turno; gatilla la notificación HU-55 para que el Cliente efectúe la validación y el pago del saldo remanente.
4. Historial refleja todos los registros en modo de solo lectura ("datos congelados").

---

### 7. Eventos del Usuario
* **Click en pestaña "Actividad" / "Historial":** Alterna la vista de turnos.
* **Click en "Marcar En progreso":** Cambia el estado a `IN_PROGRESS` y actualiza la tarjeta.
* **Click en "Solicitar Cierre":** Envía petición al backend y cambia la UI a estado pendiente de aprobación.
* **Click en "Cancelar Turno":** Despliega el modal de confirmación de cancelación.

---
---

# Módulo 2: Perfil Profesional

### 1. Objetivo
Permitir a los profesionales registrarse en la plataforma, completar su información personal y laboral mediante un proceso de onboarding paso a paso, seleccionar los rubros técnicos de su especialidad, definir sus zonas geográficas de cobertura y ofrecer un perfil público completo con calificaciones y reseñas que genere confianza a los clientes.

### 2. Usuarios principales
* **Profesional de Servicios Técnicos** (administración de perfil)
* **Cliente** (visualización del perfil público)

### 3. Entrada al flujo
* **Registro de Profesional:** `/register/professional`.
* **Wizard de Onboarding:** `/onboarding` (redirección obligatoria post-registro inicial).
* **Edición de Perfil:** Menú del usuario -> **"Mi Perfil Profesional"**.
* **Perfil Público:** Enlace desde el comparador de cotizaciones (`/professionals/:id`).

### 3.1 Datos enviados al Backend (Request)

#### A. Registro de Profesional (`POST /api/v1/auth/register`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `email` | String | Sí | Correo electrónico del profesional |
| `password` | String | Sí | Mínimo 8 caracteres (1 mayúscula, 1 número) |
| `first_name` | String | Sí | Nombre del profesional |
| `last_name` | String | Sí | Apellido del profesional |
| `role` | String | Sí | Valor fijo `'professional'` |

#### B. Completar Información Básica (`PUT /api/v1/profile` & `PUT /api/v1/professional-profile`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `phone` | String | Sí | Formato telefónico de Argentina validado |
| `bio` | String | Sí | Descripción profesional (máx 500 caracteres) |
| `token` | JWT | Sí | Token del profesional autenticado |

#### C. Seleccionar Rubros de Servicio (`PUT /api/v1/professional-profile/rubros`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `rubroIds` | Array[UUID] | Sí | Lista de IDs de rubros seleccionados (mínimo 1) |
| `token` | JWT | Sí | Token del profesional autenticado |

#### D. Definir Zonas de Cobertura (`PUT /api/v1/professional-profile/zones`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `zoneIds` | Array[UUID] | Sí | Lista de IDs de localidades/barrios seleccionados (mínimo 1) |
| `token` | JWT | Sí | Token del profesional autenticado |

#### E. Consultar Perfil Público (`GET /api/v1/professionals/:id`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `id` | UUID | Sí | ID del perfil profesional |

**Validaciones del Backend:**
* Validación del formato de teléfono (regex Argentina).
* La biografía no puede exceder los 500 caracteres.
* Requiere al menos 1 rubro y 1 zona elegidos para marcar `is_onboarding_complete = true`.
* `GET /api/v1/professionals/:id` omite estrictamente datos sensibles (teléfono, email).

---

### 4. Componentes de las pantallas

#### A. Wizard de Onboarding (HU-07, HU-08, HU-09)
* **Barra de Progreso:** Muestra los 3 pasos (1. Datos personales & Bio -> 2. Rubros -> 3. Zonas).
* **Paso 1 (HU-07):** Campos pre-cargados de nombre y apellido, campo para teléfono, área de texto para descripción/experiencia con contador de caracteres (0/500).
* **Paso 2 (HU-08):** Grilla de tarjetas visuales interactivas con íconos representativos de cada rubro (Frigoristas, Plomeros, Electricistas) y checkboxes.
* **Paso 3 (HU-09):** Buscador interactivo y selector múltiple de barrios y localidades con badges removibles. Botón *"Finalizar Onboarding"*.

#### B. Pantalla HU-10 — Perfil Profesional Público
* **Encabezado:** Foto/Avatar, Nombre completo, Insignia de profesional verificado, Promedio de estrellas (ej. 4.8 ★) y contador total de valoraciones.
* **Sección de Bio:** Descripción profesional de experiencia y especialidad.
* **Badges:** Lista de rubros técnicos operados e insignias de zonas de cobertura geográfica.
* **Sección de Opiniones:** Historial de reseñas y puntuaciones otorgadas por clientes anteriores.

---

### 5. Estados
* **Wizard:** Formulario en curso, Guardando paso (Spinner), Error de validación (teléfono inválido, bio >500 caracteres, sin selección de rubro/zona).
* **Perfil Público:** Skeleton de perfil, Perfil cargado con éxito, Profesional no encontrado (404).

---

### 6. Requisitos
1. Es obligatorio completar el Onboarding para acceder al Feed de tareas abiertas.
2. La descripción profesional tiene una restricción estricta de 500 caracteres.
3. El Perfil Público oculta datos de contacto hasta que un cliente acepte su propuesta y pague la seña.

---

### 7. Eventos del Usuario
* **Click en "Siguiente Paso" (Wizard):** Valida los campos del paso actual y avanza.
* **Seleccionar / Deseleccionar Rubro:** Alterna el estado visual de la tarjeta de rubro.
* **Agregar / Eliminar Zona:** Actualiza la lista de zonas seleccionadas.
* **Click en Perfil del Profesional:** Abre la vista del Perfil Público desde la comparación de ofertas.

---
---

# Módulo 3: Notificaciones (General / Profesional)

### 1. Objetivo
Proveer un sistema de notificaciones in-app centralizado en la barra superior que alerte al Profesional en tiempo real sobre eventos críticos de la plataforma (cotización aceptada, cotización rechazada en lote, confirmación de pagos de seña/saldo, recordatorios 24h previas y cancelaciones), permitiendo su lectura rápida y navegación hacia las entidades correspondientes.

### 2. Usuarios principales
* **Profesional de Servicios Técnicos**

### 3. Entrada al flujo
* Ícono de **Campana de Notificaciones** en el encabezado (Header) accesible desde cualquier vista de la plataforma.

### 3.1 Datos enviados al Backend (Request)

#### A. Obtener Notificaciones (`GET /api/v1/notifications`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `token` | JWT | Sí | Token del usuario autenticado |
| `unreadOnly` | Boolean | No | Si es `true`, devuelve únicamente las no leídas |

#### B. Marcar Notificación como Leída (`PATCH /api/v1/notifications/:id/read`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `notificationId` | UUID | Sí | ID de la notificación |
| `token` | JWT | Sí | Token del usuario autenticado |

#### C. Marcar Todas como Leídas (`PATCH /api/v1/notifications/read-all`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `token` | JWT | Sí | Token del usuario autenticado |

**Validaciones del Backend:**
* Inserción automática mediante backend autenticado (`SUPABASE_SERVICE_ROLE_KEY`).
* Aplicación estricta de RLS por `user_id`.

---

### 4. Componentes de las pantallas

#### A. HU-48 — Campana In-App
* Posicionada en la barra de navegación superior.
* Indicador tipo Badge en rojo con el contador exacto de notificaciones no leídas. Si el contador es 0, el badge se oculta.

#### B. HU-49 — Dropdown de Notificaciones (`<NotificationDropdown>`)
* Menú desplegable flotante al hacer clic en la campana.
* Encabezado con título *"Notificaciones"* y botón *"Marcar todo como leído"*.
* Lista con scroll con los siguientes tipos de notificaciones para Profesional:
  * **Cotización Aceptada (HU-51):** Ícono verde. Título: *"¡Tu cotización fue aceptada!"*. Mensaje con rubro, zona y horario.
  * **Cotización Rechazada (HU-52):** Ícono gris. Título: *"Cotización no seleccionada"*. Mensaje de pedido cubierto.
  * **Pago Confirmado (HU-53):** Ícono de moneda. Título: *"Pago de seña/saldo confirmado"*.
  * **Recordatorio 24h (HU-54):** Ícono de reloj. Título: *"Recordatorio de servicio técnico para mañana"*.
  * **Pedido Cancelado (HU-56):** Ícono rojo de advertencia. Título: *"Pedido cancelado por el cliente"*.
* Pie del menú con enlace *"Ver todas las notificaciones"*.

---

### 5. Estados
* **Campana:** Sin no leídas (badge oculto), Con no leídas (badge activo con número).
* **Dropdown:** Cargando notificaciones, Lista con contenido, Lista vacía (*"No tenés notificaciones"*).
* **Ítem individual:** No leído (fondo resaltado / indicador azul), Leído (fondo neutro).

---

### 6. Requisitos
1. Disparo transaccional directo desde el backend en cada evento.
2. Inserción masiva en lote (batch) de `proposal_rejected` al resto de profesionales cuando un cliente acepta una oferta.
3. Actualización optimista en el frontend al marcar como leída para asegurar agilidad visual.
4. El clic en una notificación redirige directamente al turno (`/appointments/:id`) o a la cotización correspondiente.

---

### 7. Eventos del Usuario
* **Click en Campana:** Abre o cierra el dropdown desplegable.
* **Click en Notificación Individual:** Marca la alerta como leída en la BD y redirige a la vista asociada.
* **Click en "Marcar todo como leído":** Actualiza masivamente el estado `read = true` de todas las notificaciones del usuario.

---
---

# Módulo 4: Marketplace (Cliente)

### 1. Objetivo
Permitir a los clientes solicitar servicios técnicos publicando tareas mediante un wizard estructurado (ubicación, rubro, cuestionario dinámico, horarios y fotos), administrar sus publicaciones, recibir y comparar propuestas económicas de profesionales, aceptar la cotización óptima y concretar la reserva pagando la seña a través de Mercado Pago.

### 2. Usuarios principales
* **Cliente**

### 3. Entrada al flujo
* Botón **"Publicar Tarea"** desde la barra principal o la landing page.
* Sección **"Mis Tareas"** (`/tasks`) para consultar solicitudes creadas.

### 3.1 Datos enviados al Backend (Request)

#### A. Crear Tarea (`POST /api/v1/tasks`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `token` | JWT | Sí | Token del cliente autenticado |
| `zone_id` | UUID | Sí | ID de la localidad/barrio seleccionada |
| `address` | String | Sí | Dirección exacta de la visita técnica |
| `rubro_id` | UUID | Sí | ID del rubro del servicio técnico |
| `problem_type` | String | Sí | Tipo de falla o necesidad |
| `questionnaire_answers` | JSON | Sí | Respuestas al cuestionario dinámico del rubro |
| `preferred_date` | Date | Sí | Fecha deseada para la visita |
| `preferred_time_slot` | Enum | Sí | Franja horaria (`MORNING`, `AFTERNOON`, `EVENING`) |
| `photo_urls` | Array[String] | No | URLs de fotos cargadas sobre el problema |

#### B. Consultar Mis Tareas (`GET /api/v1/tasks/my-tasks`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `token` | JWT | Sí | Token del cliente autenticado |
| `status` | Enum | No | Filtra por estado (`PUBLISHED`, `HAS_OFFERS`, `ACCEPTED`, `CANCELLED`) |

#### C. Aceptar Cotización (`POST /api/v1/offers/:id/accept`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `proposalId` | UUID | Sí | Identificador de la propuesta elegida |
| `token` | JWT | Sí | Token del cliente autenticado |

#### D. Crear Preferencia de Pago de Seña (`POST /api/v1/payments/checkout`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `proposalId` | UUID | Sí | Identificador de la propuesta aceptada |
| `token` | JWT | Sí | Token del cliente |

**Validaciones del Backend:**
* Cuestionario dinámico validado según el esquema del rubro seleccionado.
* Edición de tarea únicamente permitida si `status = 'PUBLISHED'` (sin cotizaciones recibidas).
* Aceptar cotización genera transacción atómica: rechaza otras ofertas (`proposal_rejected`), reserva el turno y genera la preferencia de cobro de Mercado Pago.
* Procesamiento de Webhook MP (`APPROVED`) confirma la transacción y genera el turno formal en `appointments`.

---

### 4. Componentes de las pantallas

#### A. Wizard de Publicación de Tarea (HU-11 a HU-17)
* **Paso 1 — Ubicación (HU-11):** Campo de texto para dirección, selector de barrio/zona.
* **Paso 2 — Rubro y Problema (HU-12):** Selección de rubro técnico (Frigorista, Plomero, Electricista) y tipo de falla.
* **Paso 3 — Cuestionario Dinámico (HU-13):** Formulario generado dinámicamente según el rubro con preguntas específicas de diagnóstico.
* **Paso 4 — Fecha y Horario (HU-14):** Selector de fecha en calendario y franja horaria preferida.
* **Paso 5 — Carga de Fotos (HU-15):** Uploader de fotos con vista previa y opción de eliminar.
* **Paso 6 — Resumen y Publicación (HU-16, HU-17):** Ficha resumen de los datos ingresados y botón *"Confirmar y Publicar"*.

#### B. Pantalla HU-18 — Mis Tareas Creadas
* Lista de tareas publicadas con badges de estado (`PUBLISHED`, `HAS_OFFERS`, `ACCEPTED`, `CANCELLED`) y contador de cotizaciones recibidas.

#### C. Pantalla HU-29 y HU-30 — Comparador de Cotizaciones
* Vista de cotizaciones recibidas para una tarea.
* Botón *"Comparar Lado a Lado"* (HU-30) que despliega una tabla comparativa con: Nombre del profesional, Calificación en estrellas, Presupuesto total, Monto de seña, Fecha/hora propuesta y notas.
* Botón *"Aceptar Cotización"* por cada propuesta.

#### D. Checkout y Resultado de Pago (HU-33, HU-39)
* Integración con Mercado Pago Checkout Pro / SDK.
* Pantalla HU-39 de resultado del pago: Indicador de aprobación/rechazo de seña y botón *"Ver Mi Agenda"*.

---

### 5. Estados
* **Wizard:** Formularios por paso, Subiendo fotos (ProgressBar), Guardando tarea.
* **Tarea:** Publicada sin ofertas, Con cotizaciones recibidas, Cotización aceptada (esperando seña), Turno Agendado, Cancelada.
* **Pago:** Generando preferencia, Checkout MP en curso, Pago Aprobado, Pago Fallido / Reintento.

---

### 6. Requisitos
1. El Cuestionario Dinámico se ajusta estrictamente al rubro seleccionado.
2. Las tareas solo pueden editarse mientras no posean cotizaciones de profesionales.
3. La aceptación de una oferta exige el pago exitoso de la seña cotizada por el profesional para agendar formalmente el turno.
4. Si el cliente falla el pago de seña, se otorga un plazo de reintento antes de liberar la cotización.

---

### 7. Eventos del Usuario
* **Navegar en Wizard:** "Continuar" / "Volver".
* **Subir Fotos:** Selecciona archivos de imagen para adjuntar.
* **Click en "Comparar Cotizaciones":** Abre la vista comparativa lado a lado.
* **Click en "Aceptar Cotización":** Inicia la transacción de reserva y deriva al checkout de pago de seña.

---
---

# Módulo 5: Perfil (Cliente)

### 1. Objetivo
Gestionar el ciclo de autenticación y la información personal de los usuarios con rol Cliente, permitiendo el registro, inicio de sesión seguro, recuperación de contraseña, redirección por rol post-login y la administración de datos de contacto y direcciones preferidas.

### 2. Usuarios principales
* **Cliente**

### 3. Entrada al flujo
* **Registro de Cliente:** `/register/client`.
* **Inicio de Sesión:** `/login`.
* **Recuperación de Contraseña:** `/forgot-password`.
* **Perfil de Cuenta:** Menú del usuario -> **"Mi Perfil"**.

### 3.1 Datos enviados al Backend (Request)

#### A. Registro de Cliente (`POST /api/v1/auth/register`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `email` | String | Sí | Correo electrónico del cliente |
| `password` | String | Sí | Clave de acceso (mínimo 8 caracteres, 1 mayúscula, 1 número) |
| `first_name` | String | Sí | Nombre del cliente |
| `last_name` | String | Sí | Apellido del cliente |
| `role` | String | Sí | Valor fijo `'client'` |

#### B. Inicio de Sesión (`POST /api/v1/auth/login`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `email` | String | Sí | Correo del usuario |
| `password` | String | Sí | Contraseña |

#### C. Actualizar Datos de Perfil (`PUT /api/v1/profile`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `phone` | String | No | Teléfono de contacto principal |
| `first_name` | String | No | Nombre |
| `last_name` | String | No | Apellido |
| `token` | JWT | Sí | Token del cliente autenticado |

**Validaciones del Backend:**
* Formato de correo válido y comprobación de duplicados en `auth.users`.
* Formato de contraseña seguro.
* Asignación automática de rol `client` en la tabla `profiles`.
* Devuelve token JWT firmado y refrescable.

---

### 4. Componentes de las pantallas

#### A. Pantalla HU-01 — Formulario de Registro de Cliente
* Campos: Nombre, Apellido, Correo electrónico, Contraseña y Confirmación de contraseña.
* Botón *"Registrarme como Cliente"*. Enlace hacia login si ya posee cuenta.

#### B. Pantalla HU-03 & HU-05 — Login y Redirección por Rol
* Campos: Correo electrónico y Contraseña. Botón *"Iniciar Sesión"*.
* Redirección automática post-login: Redirige al Cliente a la vista de **"Mis Tareas"** (`/tasks`).

#### C. Pantalla HU-04 — Recuperación de Contraseña
* Campo: Correo electrónico registrado. Botón *"Enviar instrucciones de recuperación"*.

#### D. Pantalla Mi Perfil (Cliente)
* Ficha de datos personales editables (Nombre, Apellido, Teléfono de contacto).
* Gestión de direcciones habituales guardadas.

---

### 5. Estados
* **Formulario:** Vacío, Validando campos, Enviando (Spinner), Error de autenticación (credenciales inválidas, email duplicado), Autenticado exitosamente.

---

### 6. Requisitos
1. El registro asigna automáticamente el rol `client`.
2. Post-login exitoso, la aplicación evalúa el rol del JWT y redirige a la pantalla `/tasks`.
3. El cierre de sesión revoca el token JWT y limpia el estado local del navegador.

---

### 7. Eventos del Usuario
* **Submit en Registro:** Valida datos y crea la cuenta.
* **Submit en Login:** Valida credenciales e ingresa.
* **Click en "Cerrar Sesión":** Revoca la sesión y redirige al Landing Page.

---
---

# Módulo 6: Turnos (Cliente)

### 1. Objetivo
Ofrecer al Cliente un panel integrado ("Mi Agenda") para supervisar sus turnos de servicio técnico agendados, consultar el detalle del turno y del profesional asignado, solicitar la cancelación si es necesario, confirmar la finalización del trabajo (liberando el cobro del saldo remanente) y acceder a un historial congelado de servicios terminados o cancelados.

### 2. Usuarios principales
* **Cliente**

### 3. Entrada al flujo
* Menú principal **"Mi Agenda"** (vista Cliente).
* Redirección desde notificación de **"Turno Confirmado"** o **"Trabajo Finalizado por Profesional"**.

### 3.1 Datos enviados al Backend (Request)

#### A. Obtener Agenda del Cliente (`GET /api/v1/appointments`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `token` | JWT | Sí | Token del cliente autenticado |
| `historial` | Boolean | No | `false` para Actividad activa, `true` para Historial |
| `fecha` | Date | No | Filtro por fecha |
| `estado` | Enum | No | Filtro por estado |

#### B. Confirmar Servicio Completado y Liquidar Saldo (`POST /api/v1/appointments/:id/confirm-completion`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `appointmentId` | UUID | Sí | Identificador único del turno |
| `token` | JWT | Sí | Token del cliente autenticado |

#### C. Cancelar Turno (`POST /api/v1/appointments/:id/cancel`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `appointmentId` | UUID | Sí | Identificador del turno |
| `motivo` | String | No | Motivo de la cancelación |
| `token` | JWT | Sí | Token del cliente |

**Validaciones del Backend:**
* RLS asegura que el cliente solo vea turnos donde figure como cliente contratante.
* Confirmar finalización actualiza el turno a `COMPLETED` e inicia el cobro del saldo restante a través de Mercado Pago (HU-37).
* Cancelar turno envía notificación `job_cancelled` al profesional asignado.

---

### 4. Componentes de las pantallas

#### A. Pantalla HU-41 — Mi Agenda (Cliente)
* **Encabezado:** Título "Mi Agenda", descripción orientativa.
* **Pestañas:**
  * **Actividad:** Muestra turnos confirmados y en curso ordenados por proximidad de fecha. Muestra tarjeta con: Fecha/Hora, Profesional asignado, Rubro, Estado y botón *"Ver detalle"*.
  * **Historial:** Muestra turnos `COMPLETED` y `CANCELLED` ordenados por fecha descendente.

#### B. Pantalla HU-43 — Detalle del Turno (Cliente)
* **Información del Servicio:** Número de turno, Estado, Fecha y hora acordadas, Rubro y Descripción técnica.
* **Ficha del Profesional:** Nombre del Profesional, Calificación promedio en estrellas y teléfono (visible post-seña).
* **Desglose Económico:** Presupuesto Total, Seña Abonada, Saldo Restante Pendiente de Cobro.
* **Acciones:**
  * Si el profesional solicitó cierre (`COMPLETION_REQUESTED`): Botón destacado *"Confirmar Trabajo Completado y Pagar Saldo"*.
  * Botón *"Cancelar Turno"* (disponible en turnos activos).

#### C. Modal HU-46 — Cancelar Turno
* Diálogo de confirmación con campo opcional para el motivo de cancelación.

---

### 5. Estados
* **Mi Agenda:** Skeleton cards, Sin turnos en curso, Turnos activos cargados, Error de carga.
* **Detalle del Turno:** Cargando datos, Servicio en curso, Servicio reportado completado por profesional, Confirmando finalización y cobro, Cancelado.

---

### 6. Requisitos
1. La pestaña "Actividad" muestra únicamente turnos confirmados y en curso.
2. Confirmar el trabajo completado ejecuta la liquidación del saldo restante mediante Mercado Pago.
3. El historial muestra datos congelados e inmutables del turno finalizado o cancelado.

---

### 7. Eventos del Usuario
* **Click en "Confirmar Trabajo Completado":** Inicia la aprobación y el cobro del saldo remanente.
* **Click en "Cancelar Turno":** Abre el modal de cancelación.
* **Alternar Pestañas:** Cambia entre "Actividad" e "Historial".

---
---

# Módulo 7: Notificaciones (Cliente)

### 1. Objetivo
Alertar al Cliente de manera inmediata e in-app en la campana del header sobre eventos relevantes de sus publicaciones y turnos (nueva cotización recibida, pago de seña o saldo confirmado, recordatorio 24h previas, reporte de trabajo completado por el profesional y cancelaciones), permitiendo su fácil lectura y navegación directa.

### 2. Usuarios principales
* **Cliente**

### 3. Entrada al flujo
* Ícono de **Campana de Notificaciones** en el encabezado (Header).

### 3.1 Datos enviados al Backend (Request)

#### A. Obtener Notificaciones (`GET /api/v1/notifications`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `token` | JWT | Sí | Token del cliente autenticado |
| `unreadOnly` | Boolean | No | `true` para filtrar únicamente las no leídas |

#### B. Marcar Leída (`PATCH /api/v1/notifications/:id/read`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `notificationId` | UUID | Sí | Identificador de la notificación |
| `token` | JWT | Sí | Token del cliente autenticado |

#### C. Marcar Todas Leídas (`PATCH /api/v1/notifications/read-all`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `token` | JWT | Sí | Token del cliente autenticado |

**Validaciones del Backend:**
* Inserción transaccional por backend mediante eventos.
* Filtro RLS estricto por `user_id = auth.uid()`.

---

### 4. Componentes de las pantallas

#### A. HU-48 — Campana In-App (Cliente)
* Badge rojo superpuesto en la campana con el contador numérico de notificaciones no leídas.

#### B. HU-49 — Dropdown de Notificaciones (`<NotificationDropdown>`)
* Menú desplegable flotante con las notificaciones específicas para Cliente:
  * **Nueva Cotización Recibida (HU-50):** Ícono azul. Título: *"Nueva cotización en tu tarea"*. Mensaje con presupuesto inicial. Enlaza a `/tasks/:id`.
  * **Pago Confirmado (HU-53):** Ícono de moneda. Título: *"Pago de seña/saldo confirmado"*. Enlaza a la cita.
  * **Recordatorio 24h (HU-54):** Ícono de reloj. Título: *"Recordatorio de servicio técnico para mañana"*. Enlaza a `/appointments/:id`.
  * **Trabajo Completado (HU-55):** Ícono de tilde verde. Título: *"El profesional reporta trabajo finalizado"*. Enlaza al turno para abonar el saldo.
  * **Pedido Cancelado (HU-56):** Ícono rojo. Título: *"Pedido cancelado por el profesional"*.
* Botón *"Marcar todo como leído"*.

---

### 5. Estados
* **Campana:** Sin no leídas (badge oculto), Con no leídas (badge con contador).
* **Dropdown:** Cargando, Lista con notificaciones, Lista vacía.
* **Ítem individual:** Resaltado (No leído), Fondo neutro (Leído).

---

### 6. Requisitos
1. Inserción automática al crearse una propuesta (`new_proposal`), procesarse un pago (`payment_confirmed`), ejecutarse el cron 24h (`reminder_24h`), solicitarse el cierre del trabajo (`job_completed`) o cancelarse un pedido (`job_cancelled`).
2. Redirección inteligente al hacer clic: hacia la tarea en `new_proposal` y hacia el detalle del turno en los demás casos.
3. Actualización optimista de conteo al marcar como leídas.

---

### 7. Eventos del Usuario
* **Click en Campana:** Abre o cierra el dropdown.
* **Click en Notificación de "Nueva cotización":** Marca leída y redirige a la tarea para comparar cotizaciones.
* **Click en Notificación de "Trabajo completado":** Marca leída y redirige al detalle del turno para aprobar y abonar el saldo.
* **Click en "Marcar todo como leído":** Limpia el contador de la campana.

---

## Resumen de Cobertura de Módulos y Historias de Usuario

| Módulo | Historias de Usuario Asociadas | Roles Involucrados | Cobertura en este Reporte |
|---|---|---|---|
| **Turnos (Rol Profesional)** | HU-40, HU-42, HU-43, HU-44, HU-46, HU-47, HU-72 | Profesional | 100% |
| **Perfil Profesional** | HU-02, HU-07, HU-08, HU-09, HU-10 | Profesional / Cliente | 100% |
| **Notificaciones (General / Profesional)** | HU-48, HU-49, HU-51, HU-52, HU-53, HU-54, HU-56, HU-57 | Profesional | 100% |
| **Marketplace (Cliente)** | HU-11 a HU-20, HU-29 a HU-39 | Cliente | 100% |
| **Perfil (Cliente)** | HU-01, HU-03, HU-04, HU-05, HU-06 | Cliente | 100% |
| **Turnos (Cliente)** | HU-40, HU-41, HU-43, HU-45, HU-46, HU-47, HU-72 | Cliente | 100% |
| **Notificaciones (Cliente)** | HU-48, HU-49, HU-50, HU-53, HU-54, HU-55, HU-56, HU-57 | Cliente | 100% |
