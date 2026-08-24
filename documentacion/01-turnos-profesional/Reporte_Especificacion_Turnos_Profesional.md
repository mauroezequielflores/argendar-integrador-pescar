# Reporte de Especificación Técnica — Módulo Turnos (Rol Profesional)

**Proyecto:** Argendar — Plataforma Integrada de Servicios Técnicos  
**Módulo:** Turnos y Agenda Profesional ("Mi Agenda")  
**Historias de Usuario:** `HU-40`, `HU-42`, `HU-43`, `HU-44`, `HU-46`, `HU-47`, `HU-72`  
**Rol Principal:** Profesional de Servicios Técnicos  
**Versión:** 1.0.0  

---

## 1. Objetivo
Permitir que los profesionales de servicios técnicos administren integralmente sus turnos asignados desde su panel principal, marcando el inicio del servicio ("En progreso"), consultando la ficha de diagnóstico completa y los datos de contacto del cliente (visibles únicamente post-seña), solicitando el cierre del trabajo realizado, gestionando cancelaciones justificadas y consultando el historial de actividades finalizadas o canceladas.

---

## 2. Usuarios Principales
* **Profesional de Servicios Técnicos**

---

## 3. Entrada al Flujo
* Accesible desde el menú principal de la plataforma mediante la opción **"Mi Agenda"** (vista Profesional).
* Redirección automática desde:
  * Notificación de **"¡Tu cotización fue aceptada!"** / **"Pago de seña confirmado"**.
  * Confirmación de una Oferta enviada que ha sido aceptada por el Cliente.

---

## 3.1 Contratos de la API REST (Backend Request / Response)

### A. Obtener Agenda del Profesional (`GET /api/v1/appointments`)
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

### B. Obtener Detalle del Turno (`GET /api/v1/appointments/:id`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `appointmentId` | UUID | Sí | Identificador único del turno |
| `token` | JWT | Sí | Token del usuario autenticado |

**Validaciones del Backend:**
* El turno existe en la tabla `appointments`.
* El usuario pertenece al turno como profesional asignado.
* Revela teléfono y dirección del cliente **únicamente** si el estado del turno no está `CANCELLED` y se acreditó el pago de la seña.

### C. Marcar Servicio como "En progreso" (`PATCH /api/v1/appointments/:id/in-progress`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `appointmentId` | UUID | Sí | Identificador del turno |
| `token` | JWT | Sí | Token del usuario profesional |

**Validaciones del Backend:**
* El turno está en estado `CONFIRMED`.
* La fecha actual coincide con la fecha agendada del turno (o tolerancia del mismo día).
* Actualiza el estado a `IN_PROGRESS`.

### D. Solicitar Cierre de Trabajo (`PATCH /api/v1/appointments/:id/request-completion`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `appointmentId` | UUID | Sí | Identificador del turno |
| `token` | JWT | Sí | Token del usuario profesional |

**Validaciones del Backend:**
* El turno está en estado `IN_PROGRESS`.
* Establece la marca temporal `completion_requested_at`.
* Genera notificación automática `type = 'job_completed'` orientada al cliente.

### E. Cancelar Turno (`POST /api/v1/appointments/:id/cancel`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `appointmentId` | UUID | Sí | Identificador del turno |
| `motivo` | String | No | Motivo explícito de la cancelación |
| `token` | JWT | Sí | Token del usuario autenticado |

**Validaciones del Backend:**
* El turno no se encuentra en estado `COMPLETED` ni `CANCELLED`.
* Actualiza estado a `CANCELLED`, registra `cancelled_by` y despacha notificación al cliente (`job_cancelled`).

---

## 4. Componentes de las Pantallas

### A. Pantalla HU-42 — Mi Agenda (Profesional)
* **Encabezado:** Título "Mi Agenda", descripción orientativa de trabajo en curso.
* **Barra de búsqueda & Filtros:** Búsqueda por nombre de cliente, dirección o rubro; filtro por fecha y estado.
* **Pestañas:**
  * **Actividad:** Muestra turnos `CONFIRMED` e `IN_PROGRESS` ordenados por proximidad cronológica. Cada tarjeta muestra: fecha/hora, cliente, dirección, rubro, monto acordado/seña, badge de estado y botón *"Ver detalle"*.
  * **Ofertas Pendientes:** Muestra las cotizaciones enviadas pendientes de aceptación o pago.
  * **Historial:** Muestra turnos `COMPLETED` y `CANCELLED` ordenados por fecha descendente.

### B. Pantalla HU-43 — Detalle del Turno (Profesional)
* **Encabezado:** Número de turno, Estado en Badge, Fecha y Horario de la cita.
* **Información del Cliente:** Nombre del Cliente, Dirección de la visita y Teléfono (visibles tras la seña).
* **Diagnóstico técnico:** Cuestionario dinámico respondido por el cliente, galería de fotografías del problema, notas adicionales de la propuesta aceptada.
* **Información económica:** Presupuesto total cotizado, Seña percibida/abonada, Saldo pendiente de cobro al finalizar.
* **Acciones disponibles (dinámicas según estado):**
  * Si `CONFIRMED`: Botón *"Marcar En progreso"*, Botón *"Cancelar Turno"*.
  * Si `IN_PROGRESS`: Botón *"Solicitar Cierre del Trabajo"*, Botón *"Cancelar Turno"*.
  * Si `COMPLETION_REQUESTED`: Indicador *"Esperando confirmación del cliente"*.

### C. Modal HU-46 — Cancelar Turno
* Centrado en pantalla con ícono de advertencia.
* Título: *"Cancelar Turno Agendado"*.
* Campo de texto opcional para justificar la cancelación.
* Botones: *"Confirmar Cancelación"* (destructivo) y *"Volver"*.

---

## 5. Matriz de Estados de la UI
* **Mi Agenda:** Skeleton cards, Sin actividades asignadas, Actividades cargadas, Error de conexión.
* **Detalle del Turno:** Cargando datos, Información completa, Información de contacto bloqueada (pre-seña), Error de permisos.
* **Cancelación:** Modal abierto, Procesando (Spinner), Cancelación exitosa con toast informativo.

---

## 6. Requisitos y Reglas de Negocio
1. La dirección exacta y el teléfono del Cliente permanecen ocultos hasta la acreditación de la seña.
2. El Profesional solo puede marcar *"En progreso"* el mismo día fijado en la agenda para la cita.
3. La acción *"Solicitar Cierre"* no finaliza automáticamente el turno; gatilla la notificación `HU-55` para que el Cliente efectúe la validación y el pago del saldo remanente.
4. Historial refleja todos los registros en modo de solo lectura ("datos congelados").

---

## 7. Eventos del Usuario
* **Click en pestaña "Actividad" / "Historial":** Alterna la vista de turnos.
* **Click en "Marcar En progreso":** Cambia el estado a `IN_PROGRESS` y actualiza la tarjeta.
* **Click en "Solicitar Cierre":** Envía petición al backend y cambia la UI a estado pendiente de aprobación.
* **Click en "Cancelar Turno":** Despliega el modal de confirmación de cancelación.
