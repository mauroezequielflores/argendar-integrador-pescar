# Reporte de Especificación Técnica — Módulo Turnos (Cliente)

**Proyecto:** Argendar — Plataforma Integrada de Servicios Técnicos  
**Módulo:** Turnos y Agenda Cliente ("Mi Agenda")  
**Historias de Usuario:** `HU-40`, `HU-41`, `HU-43`, `HU-45`, `HU-46`, `HU-47`, `HU-72`  
**Rol Principal:** Cliente  
**Versión:** 1.0.0  

---

## 1. Objetivo
Ofrecer al Cliente un panel integrado ("Mi Agenda") para supervisar sus turnos de servicio técnico agendados, consultar el detalle del turno y del profesional asignado, solicitar la cancelación si es necesario, confirmar la finalización del trabajo (liberando el cobro del saldo remanente) y acceder a un historial congelado de servicios terminados o cancelados.

---

## 2. Usuarios Principales
* **Cliente**

---

## 3. Entrada al Flujo
* Menú principal **"Mi Agenda"** (vista Cliente).
* Redirección desde notificación de **"Turno Confirmado"** o **"Trabajo Finalizado por Profesional"**.

---

## 3.1 Contratos de la API REST (Backend Request / Response)

### A. Obtener Agenda del Cliente (`GET /api/v1/appointments`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `token` | JWT | Sí | Token del cliente autenticado |
| `historial` | Boolean | No | `false` para Actividad activa, `true` para Historial |
| `fecha` | Date | No | Filtro por fecha |
| `estado` | Enum | No | Filtro por estado |

### B. Confirmar Servicio Completado y Liquidar Saldo (`POST /api/v1/appointments/:id/confirm-completion`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `appointmentId` | UUID | Sí | Identificador único del turno |
| `token` | JWT | Sí | Token del cliente autenticado |

### C. Cancelar Turno (`POST /api/v1/appointments/:id/cancel`)
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

## 4. Componentes de las Pantallas

### A. Pantalla HU-41 — Mi Agenda (Cliente)
* **Encabezado:** Título "Mi Agenda", descripción orientativa.
* **Pestañas:**
  * **Actividad:** Muestra turnos confirmados y en curso ordenados por proximidad de fecha. Muestra tarjeta con: Fecha/Hora, Profesional asignado, Rubro, Estado y botón *"Ver detalle"*.
  * **Historial:** Muestra turnos `COMPLETED` y `CANCELLED` ordenados por fecha descendente.

### B. Pantalla HU-43 — Detalle del Turno (Cliente)
* **Información del Servicio:** Número de turno, Estado, Fecha y hora acordadas, Rubro y Descripción técnica.
* **Ficha del Profesional:** Nombre del Profesional, Calificación promedio en estrellas y teléfono (visible post-seña).
* **Desglose Económico:** Presupuesto Total, Seña Abonada, Saldo Restante Pendiente de Cobro.
* **Acciones:**
  * Si el profesional solicitó cierre (`COMPLETION_REQUESTED`): Botón destacado *"Confirmar Trabajo Completado y Pagar Saldo"*.
  * Botón *"Cancelar Turno"* (disponible en turnos activos).

### C. Modal HU-46 — Cancelar Turno
* Diálogo de confirmación con campo opcional para el motivo de cancelación.

---

## 5. Matriz de Estados de la UI
* **Mi Agenda:** Skeleton cards, Sin turnos en curso, Turnos activos cargados, Error de carga.
* **Detalle del Turno:** Cargando datos, Servicio en curso, Servicio reportado completado por profesional, Confirmando finalización y cobro, Cancelado.

---

## 6. Requisitos y Reglas de Negocio
1. La pestaña "Actividad" muestra únicamente turnos confirmados y en curso.
2. Confirmar el trabajo completado ejecuta la liquidación del saldo restante mediante Mercado Pago.
3. El historial muestra datos congelados e inmutables del turno finalizado o cancelado.

---

## 7. Eventos del Usuario
* **Click en "Confirmar Trabajo Completado":** Inicia la aprobación y el cobro del saldo remanente.
* **Click en "Cancelar Turno":** Abre el modal de cancelación.
* **Alternar Pestañas:** Cambia entre "Actividad" e "Historial".
