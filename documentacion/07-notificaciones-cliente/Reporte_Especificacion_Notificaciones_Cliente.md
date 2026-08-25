# Reporte de Especificación Técnica — Módulo Notificaciones (Cliente)

**Proyecto:** Argendar — Plataforma Integrada de Servicios Técnicos  
**Módulo:** Sistema de Notificaciones In-App (Cliente)  
**Historias de Usuario:** `HU-48`, `HU-49`, `HU-50`, `HU-53`, `HU-54`, `HU-55`, `HU-56`, `HU-57`  
**Rol Principal:** Cliente  
**Versión:** 1.0.0  

---

## 1. Objetivo
Alertar al Cliente de manera inmediata e in-app en la campana del header sobre eventos relevantes de sus publicaciones y turnos (nueva cotización recibida, pago de seña o saldo confirmado, recordatorio 24h previas, reporte de trabajo completado por el profesional y cancelaciones), permitiendo su fácil lectura y navegación directa.

---

## 2. Usuarios Principales
* **Cliente**

---

## 3. Entrada al Flujo
* Ícono de **Campana de Notificaciones** en el encabezado (Header).

---

## 3.1 Contratos de la API REST (Backend Request / Response)

### A. Obtener Notificaciones (`GET /api/v1/notifications`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `token` | JWT | Sí | Token del cliente autenticado |
| `unreadOnly` | Boolean | No | `true` para filtrar únicamente las no leídas |

### B. Marcar Leída (`PATCH /api/v1/notifications/:id/read`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `notificationId` | UUID | Sí | Identificador de la notificación |
| `token` | JWT | Sí | Token del cliente autenticado |

### C. Marcar Todas Leídas (`PATCH /api/v1/notifications/read-all`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `token` | JWT | Sí | Token del cliente autenticado |

**Validaciones del Backend:**
* Inserción transaccional por backend mediante eventos.
* Filtro RLS estricto por `user_id = auth.uid()`.

---

## 4. Componentes de las Pantallas

### A. HU-48 — Campana In-App (Cliente)
* Badge rojo superpuesto en la campana con el contador numérico de notificaciones no leídas.

### B. HU-49 — Dropdown de Notificaciones (`<NotificationDropdown>`)
* Menú desplegable flotante con las notificaciones específicas para Cliente:
  * **Nueva Cotización Recibida (HU-50):** Ícono azul. Título: *"Nueva cotización en tu tarea"*. Mensaje con presupuesto inicial. Enlaza a `/tasks/:id`.
  * **Pago Confirmado (HU-53):** Ícono de moneda. Título: *"Pago de seña/saldo confirmado"*. Enlaza a la cita.
  * **Recordatorio 24h (HU-54):** Ícono de reloj. Título: *"Recordatorio de servicio técnico para mañana"*. Enlaza a `/appointments/:id`.
  * **Trabajo Completado (HU-55):** Ícono de tilde verde. Título: *"El profesional reporta trabajo finalizado"*. Enlaza al turno para abonar el saldo.
  * **Pedido Cancelado (HU-56):** Ícono rojo. Título: *"Pedido cancelado por el profesional"*.
* Botón *"Marcar todo como leído"*.

---

## 5. Matriz de Estados de la UI
* **Campana:** Sin no leídas (badge oculto), Con no leídas (badge con contador).
* **Dropdown:** Cargando, Lista con notificaciones, Lista vacía.
* **Ítem individual:** Resaltado (No leído), Fondo neutro (Leído).

---

## 6. Requisitos y Reglas de Negocio
1. Inserción automática al crearse una propuesta (`new_proposal`), procesarse un pago (`payment_confirmed`), ejecutarse el cron 24h (`reminder_24h`), solicitarse el cierre del trabajo (`job_completed`) o cancelarse un pedido (`job_cancelled`).
2. Redirección inteligente al hacer clic: hacia la tarea en `new_proposal` y hacia el detalle del turno en los demás casos.
3. Actualización optimista de conteo al marcar como leídas.

---

## 7. Eventos del Usuario
* **Click en Campana:** Abre o cierra el dropdown.
* **Click en Notificación de "Nueva cotización":** Marca leída y redirige a la tarea para comparar cotizaciones.
* **Click en Notificación de "Trabajo completado":** Marca leída y redirige al detalle del turno para aprobar y abonar el saldo.
* **Click en "Marcar todo como leído":** Limpia el contador de la campana.
