# Reporte de Especificación Técnica — Módulo Notificaciones (General / Profesional)

**Proyecto:** Argendar — Plataforma Integrada de Servicios Técnicos  
**Módulo:** Sistema de Notificaciones In-App (General y Profesional)  
**Historias de Usuario:** `HU-48`, `HU-49`, `HU-51`, `HU-52`, `HU-53`, `HU-54`, `HU-56`, `HU-57`  
**Rol Principal:** Profesional de Servicios Técnicos  
**Versión:** 1.0.0  

---

## 1. Objetivo
Proveer un sistema de notificaciones in-app centralizado en la barra superior que alerte al Profesional en tiempo real sobre eventos críticos de la plataforma (cotización aceptada, cotización rechazada en lote, confirmación de pagos de seña/saldo, recordatorios 24h previas y cancelaciones), permitiendo su lectura rápida y navegación hacia las entidades correspondientes.

---

## 2. Usuarios Principales
* **Profesional de Servicios Técnicos**

---

## 3. Entrada al Flujo
* Ícono de **Campana de Notificaciones** en el encabezado (Header) accesible desde cualquier vista de la plataforma.

---

## 3.1 Contratos de la API REST (Backend Request / Response)

### A. Obtener Notificaciones (`GET /api/v1/notifications`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `token` | JWT | Sí | Token del usuario autenticado |
| `unreadOnly` | Boolean | No | Si es `true`, devuelve únicamente las no leídas |

### B. Marcar Notificación como Leída (`PATCH /api/v1/notifications/:id/read`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `notificationId` | UUID | Sí | ID de la notificación |
| `token` | JWT | Sí | Token del usuario autenticado |

### C. Marcar Todas como Leídas (`PATCH /api/v1/notifications/read-all`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `token` | JWT | Sí | Token del usuario autenticado |

**Validaciones del Backend:**
* Inserción automática mediante backend autenticado (`SUPABASE_SERVICE_ROLE_KEY`).
* Aplicación estricta de políticas RLS por `user_id = auth.uid()`.

---

## 4. Componentes de las Pantallas

### A. HU-48 — Campana In-App
* Posicionada en la barra de navegación superior.
* Indicador tipo Badge en rojo con el contador exacto de notificaciones no leídas. Si el contador es 0, el badge se oculta automáticamente.

### B. HU-49 — Dropdown de Notificaciones (`<NotificationDropdown>`)
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

## 5. Matriz de Estados de la UI
* **Campana:** Sin no leídas (badge oculto), Con no leídas (badge activo con número).
* **Dropdown:** Cargando notificaciones, Lista con contenido, Lista vacía (*"No tenés notificaciones"*).
* **Ítem individual:** No leído (fondo resaltado / indicador azul), Leído (fondo neutro).

---

## 6. Requisitos y Reglas de Negocio
1. Disparo transaccional directo desde el backend en cada evento de la plataforma.
2. Inserción masiva en lote (batch) de `proposal_rejected` al resto de profesionales postulados cuando un cliente acepta una oferta específica.
3. Actualización optimista en el frontend al marcar como leída para asegurar agilidad de interacción.
4. El clic en una notificación redirige directamente al turno (`/appointments/:id`) o a la cotización correspondiente.

---

## 7. Eventos del Usuario
* **Click en Campana:** Abre o cierra el dropdown desplegable.
* **Click en Notificación Individual:** Marca la alerta como leída en la BD y redirige a la vista asociada.
* **Click en "Marcar todo como leído":** Actualiza masivamente el estado `read = true` de todas las notificaciones del usuario.
