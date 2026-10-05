# API Docs — Argendar (Administrador)

Base URL: `http://localhost:3000/api/v1`

> Este archivo documenta por ahora solo los endpoints del rol **administrador**.
> Todas las rutas requieren `Authorization: Bearer <JWT de Supabase>` y rol `administrator`.

## Errores comunes

Forma única de error:

```json
{ "error": { "code": "FORBIDDEN", "message": "Acceso no autorizado" } }
```

| Código | Cuándo |
|---|---|
| 400 | Query param inválido (`VALIDATION_ERROR`) |
| 401 | Token ausente, inválido o vencido |
| 403 | El usuario no es `administrator` |
| 404 | El recurso no existe |
| 409 | Acción no permitida sobre ese recurso (ver cada endpoint) |
| 500 | Error al consultar la base de datos |

---

## Dashboard

### GET `/admin/dashboard/metrics`

KPIs globales del dashboard, con una tendencia de 4 tramos para el mini gráfico de cada tarjeta.

- **Auth:** Bearer, rol `administrator`
- **Query:**
  - `period` (opcional): `7days` | `30days` | `all_time` (por defecto `all_time`)

**200 OK**
```json
{
  "period": "30days",
  "totalUsers":        { "value": 1542, "trend": [12, 18, 9, 22] },
  "activeRequests":    { "value": 340,  "trend": [5, 8, 7, 11] },
  "totalOffers":       { "value": 1205, "trend": [20, 14, 25, 30] },
  "totalTransactions": { "value": 850,  "trend": [3, 6, 4, 9] }
}
```

Definiciones:
- `totalUsers`: perfiles con `status <> 'deleted'` creados en el periodo.
- `activeRequests`: solicitudes en estado `open` u `offered`. **No depende de `period`** (es un estado actual).
- `totalOffers`: ofertas creadas en el periodo.
- `totalTransactions`: pagos con `status = 'paid'` creados en el periodo.
- `trend`: 4 tramos consecutivos del periodo (en `all_time`, los últimos 28 días).

**400** — `period` inválido
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "period debe ser 7days, 30days o all_time" } }
```

---

### GET `/admin/dashboard/activity-chart`

Volumen diario de operaciones del marketplace (solicitudes + ofertas + pagos creados cada día), para el gráfico de líneas.

- **Auth:** Bearer, rol `administrator`
- **Query:**
  - `days` (opcional): entero de 1 a 90 (por defecto `30`)

**200 OK**
```json
{
  "days": 7,
  "points": [
    { "date": "2026-09-28", "total": 41 },
    { "date": "2026-09-29", "total": 0 }
  ]
}
```

- Siempre se devuelven todos los días del rango, con `total: 0` si no hubo actividad.
- Los días se calculan en zona `America/Argentina/Buenos_Aires`.

**400** — `days` fuera de rango o no numérico.

---

### GET `/admin/dashboard/recent-activity`

Últimos eventos de la plataforma.

- **Auth:** Bearer, rol `administrator`
- **Query:**
  - `limit` (opcional): entero de 1 a 50 (por defecto `10`)

**200 OK**
```json
[
  {
    "id": "uuid",
    "action": "NUEVO_USUARIO",
    "description": "Se registró Juan Pérez como cliente.",
    "actor": { "name": "Juan Pérez", "role": "client" },
    "createdAt": "2026-09-28T14:30:00.000Z"
  },
  {
    "id": "uuid",
    "action": "PAGO_REGISTRADO",
    "description": "Se registró un pago de $15.000 (pagado).",
    "actor": { "name": "María Gómez", "role": "client" },
    "status": "paid",
    "createdAt": "2026-09-28T13:10:00.000Z"
  }
]
```

- `action`: `NUEVO_USUARIO` | `SOLICITUD_PUBLICADA` | `OFERTA_ENVIADA` | `PAGO_REGISTRADO`.
- `actor`: quién generó el evento (`name` y `role`). En pagos es el cliente que pagó. Puede ser `null` si no se pudo determinar.
- `status`: solo en `PAGO_REGISTRADO` (`pending` | `partial` | `paid` | `refunded`).
- Se arma consultando `profiles`, `requests`, `offers` y `payments` (no usa una tabla de logs). Los eventos se ordenan por fecha descendente.
- Sin actividad devuelve `[]` (nunca `null`).

**400** — `limit` fuera de rango o no numérico.

---

## Usuarios

### GET `/admin/users`

Lista paginada de usuarios de un rol. Excluye los eliminados (`status = 'deleted'`) y se ordena por fecha de registro, del más nuevo al más viejo.

- **Auth:** Bearer, rol `administrator`
- **Query:**
  - `role` (obligatorio): `client` | `professional` | `administrator`
  - `search` (opcional, máx. 100): nombre y/o apellido (cada palabra debe coincidir, sin distinguir mayúsculas) o un UUID completo para buscar por ID exacto
  - `page` (opcional, por defecto `1`)
  - `limit` (opcional, 1 a 100, por defecto `10`)

**200 OK**
```json
{
  "items": [
    { "id": "uuid", "name": "Elena Martínez", "role": "client", "status": "active", "createdAt": "2026-08-17T23:00:00.000Z" }
  ],
  "meta": { "totalCount": 28, "page": 1, "limit": 10, "hasMore": true }
}
```

- `status`: `active` | `disabled`.
- Sin resultados, o una página posterior a la última: `items: []` (200).

**400** — `role` ausente o inválido, `limit` fuera de rango, etc.

---

### PATCH `/admin/users/:id/status`

Bloquea o desbloquea una cuenta.

- **Auth:** Bearer, rol `administrator`
- **Body:** `{ "status": "active" | "disabled" }`

**200 OK**
```json
{ "id": "uuid", "status": "disabled" }
```

**Errores**
- 400 — `:id` no es UUID o `status` inválido.
- 404 — el usuario no existe o está eliminado.
- 409 `SELF_MODIFICATION_NOT_ALLOWED` — el administrador intenta modificar su propia cuenta.
- 409 `ADMIN_ACCOUNT_PROTECTED` — la cuenta objetivo es de otro administrador.

> Nota: por ahora el cambio de `status` solo se guarda en `profiles`. El login y `authMiddleware` todavía no rechazan cuentas `disabled` (queda para una etapa posterior).

---

### DELETE `/admin/users/:id`

Eliminación lógica: marca `status = 'deleted'` y conserva la fila para no romper turnos, pagos ni reseñas.

- **Auth:** Bearer, rol `administrator`

**200 OK**
```json
{ "id": "uuid", "status": "deleted" }
```

**Errores:** los mismos 400, 404 y 409 que `PATCH /admin/users/:id/status`.

---

## Transacciones

> Requiere la columna `payments.transaction_number` (autonumérica). Migración:
> `ALTER TABLE public.payments ADD COLUMN transaction_number BIGINT GENERATED ALWAYS AS IDENTITY;`

### GET `/admin/transactions`

Historial global de pagos, solo lectura, del más reciente al más antiguo.

- **Auth:** Bearer, rol `administrator`
- **Query:**
  - `search` (opcional, máx. 50): número de transacción (`126`, `000126`, `TRX-126`, `TRX-000126`, sin distinguir mayúsculas) o un UUID completo de pago. Cualquier otro texto devuelve lista vacía.
  - `page` (opcional, por defecto `1`)
  - `limit` (opcional, 1 a 100, por defecto `10`)

**200 OK**
```json
{
  "items": [
    {
      "id": "uuid",
      "transactionNumber": "TRX-000126",
      "user": { "id": "uuid", "name": "Hernán Castro", "role": "client" },
      "professional": { "id": "uuid", "name": "Ricardo Gómez", "role": "professional" },
      "amount": 15000,
      "depositAmount": 3000,
      "method": "mercadopago",
      "status": "paid",
      "createdAt": "2026-09-28T14:30:00.000Z"
    }
  ],
  "meta": { "totalCount": 1, "page": 1, "limit": 10, "hasMore": false }
}
```

- `user` es el cliente que pagó; `professional` es quien recibe el trabajo. Cualquiera de los dos puede ser `null` si no se pudo determinar.
- `amount` = `payments.total_amount`; `depositAmount` = `payments.deposit_amount`.
- `method`: `cash` | `mercadopago` | `transfer` | `credit_card`.
- `status`: `pending` | `partial` | `paid` | `refunded`.
- Sin resultados, o una página posterior a la última: `items: []` (200).
- Por ahora no hay endpoints para reembolsar ni cancelar (los botones están desactivados en el frontend).

**400** — `limit`/`page` fuera de rango o `search` demasiado largo.

---

## Moderación

> Requiere las columnas `moderation_status` (TEXT, `active` | `disabled` | `deleted`, por defecto `active`) y `order_number` (autonumérica) en `requests`, `offers`, `reviews` y `appointments`.
> **Por ahora el estado solo se guarda:** todavía no oculta contenido en el marketplace, la agenda ni los perfiles.

`:entity` es una de: `requests` | `offers` | `reviews` | `appointments`.

### GET `/admin/moderation/:entity`

Lista paginada de elementos de esa entidad, del más reciente al más antiguo. Incluye los tres estados.

- **Auth:** Bearer, rol `administrator`
- **Query:**
  - `search` (opcional, máx. 50): número de orden (`125`, `00125`, `ORD-125`, `ORD-00125`, sin distinguir mayúsculas) o un UUID completo. Cualquier otro texto devuelve lista vacía.
  - `page` (opcional, por defecto `1`)
  - `limit` (opcional, 1 a 100, por defecto `10`)

**200 OK**
```json
{
  "items": [
    {
      "id": "uuid",
      "orderNumber": "ORD-00125",
      "moderationStatus": "active",
      "title": "Reparación de instalación eléctrica",
      "description": "El cliente solicita revisión de la instalación.",
      "user": { "id": "uuid", "name": "Juan Pérez", "role": "client" },
      "createdAt": "2026-09-28T14:30:00.000Z"
    }
  ],
  "meta": { "totalCount": 14, "page": 1, "limit": 10, "hasMore": true }
}
```

Qué significan `title`, `description` y `user` en cada entidad:

| Entidad | title | description | user |
|---|---|---|---|
| `requests` | título de la solicitud | descripción | cliente que la publicó |
| `offers` | `Oferta de $X para "<título de la solicitud>"` | mensaje de la oferta | profesional |
| `reviews` | `Calificación N/5` | comentario | quien calificó |
| `appointments` | título de la solicitud asociada | notas, o `Turno programado para el dd/mm/aaaa hh:mm.` | cliente de la solicitud |

`user` puede ser `null` si no se pudo determinar. Sin resultados, o una página posterior a la última: `items: []` (200).

**400** — entidad inválida, `limit`/`page` fuera de rango o `search` demasiado largo.

---

### PATCH `/admin/moderation/:entity/:id`

Cambia el estado de moderación de un elemento.

- **Auth:** Bearer, rol `administrator`
- **Body:** `{ "moderationStatus": "active" | "disabled" | "deleted" }`

**200 OK**
```json
{ "id": "uuid", "moderationStatus": "disabled" }
```

- Idempotente: si el estado ya es el pedido, responde 200 sin cambios.
- `deleted` es definitivo (borrado lógico): la fila se conserva.

**Errores**
- 400 — entidad, `:id` (UUID) o `moderationStatus` inválidos.
- 404 — el elemento no existe.
- 409 `ITEM_DELETED` — se intenta activar o desactivar un elemento ya eliminado.

---

## Bandeja de consultas

> Requiere la tabla `support_tickets` (id, `ticket_number` autonumérico, `user_id`, `subject`, `message`, `status` open|answered, `reply_subject`, `reply_message`, `replied_by`, `replied_at`, `created_at`). Las consultas las crean clientes y profesionales desde "Ayuda" (ver `POST /support/tickets` más abajo).

### GET `/admin/inquiries`

Lista paginada de consultas, de la más reciente a la más antigua. No incluye el email del usuario.

- **Auth:** Bearer, rol `administrator`
- **Query:**
  - `search` (opcional, máx. 50): número de consulta (`2`, `000002`, `CON-2`, `CON-000002`), UUID completo, o texto del asunto (sin distinguir mayúsculas).
  - `status` (opcional): `open` | `answered`
  - `page` (opcional, por defecto `1`) y `limit` (opcional, 1 a 100, por defecto `10`)

**200 OK**
```json
{
  "items": [
    {
      "id": "uuid",
      "ticketNumber": "CON-000002",
      "subject": "No puedo subir mi foto",
      "status": "open",
      "createdAt": "2026-09-28T14:30:00.000Z",
      "user": { "id": "uuid", "name": "Lucía Gómez", "role": "client" }
    }
  ],
  "meta": { "totalCount": 1, "page": 1, "limit": 10, "hasMore": false }
}
```

Sin resultados, o una página posterior a la última: `items: []` (200). **400** — `status`, `page` o `limit` inválidos.

---

### GET `/admin/inquiries/:id`

Detalle de una consulta, con el email del usuario (sale de Supabase Auth) y la respuesta si existe.

- **Auth:** Bearer, rol `administrator`

**200 OK**
```json
{
  "id": "uuid",
  "ticketNumber": "CON-000002",
  "subject": "No puedo subir mi foto",
  "message": "Cuando intento subir la foto me da error...",
  "status": "answered",
  "createdAt": "2026-09-28T14:30:00.000Z",
  "user": { "id": "uuid", "name": "Lucía Gómez", "role": "client", "email": "lucia@ejemplo.com" },
  "reply": {
    "subject": "Re: No puedo subir mi foto",
    "message": "Hola Lucía...",
    "repliedAt": "2026-09-29T10:00:00.000Z",
    "repliedBy": "Admin Argendar"
  }
}
```

`reply` es `null` mientras la consulta esté abierta. **400** — `:id` no es UUID. **404** — la consulta no existe.

---

### POST `/admin/inquiries/:id/reply`

Responde una consulta: pasa a `answered` y se crea una notificación para el usuario (`type: support_reply`, `related_entity_type: support_ticket`, con `href` a su pantalla de Ayuda).

- **Auth:** Bearer, rol `administrator`
- **Body:** `{ "subject": "Re: ...", "message": "texto de la respuesta" }` — `subject` de 1 a 150 caracteres y `message` de 1 a 2000 (se recortan los espacios).

**201 Created** — devuelve el mismo objeto de detalle, con `status: "answered"` y `reply` completo.

**Errores**
- 400 — `subject`/`message` vacíos o demasiado largos, o `:id` inválido.
- 404 — la consulta no existe.
- 409 `INQUIRY_ALREADY_ANSWERED` — la consulta ya fue respondida (también si otro administrador la respondió al mismo tiempo).

---

## Soporte (cliente y profesional)

### POST `/support/tickets`

Envía una consulta desde la sección Ayuda. Aparece en la bandeja del administrador.

- **Auth:** Bearer, rol `client` o `professional` (otros roles: 403)
- **Body:** `{ "subject": "Resumen de la consulta", "message": "Más detalles..." }` — `subject` de 1 a 150 caracteres y `message` de 1 a 2000 (se recortan los espacios).

**201 Created**
```json
{ "id": "uuid", "ticketNumber": "CON-000002", "status": "open", "createdAt": "2026-09-28T14:30:00.000Z" }
```

**400** — campos vacíos o demasiado largos. **401** — sin token. **403** — el rol no puede enviar consultas.

---

## Resumen rápido

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/admin/dashboard/metrics` | administrator | KPIs con tendencia (`period`) |
| GET | `/admin/dashboard/activity-chart` | administrator | Operaciones diarias (`days`) |
| GET | `/admin/dashboard/recent-activity` | administrator | Actividad reciente (`limit`) |
| GET | `/admin/users` | administrator | Usuarios por rol, con búsqueda y paginación |
| PATCH | `/admin/users/:id/status` | administrator | Bloquear / desbloquear |
| DELETE | `/admin/users/:id` | administrator | Eliminación lógica |
| GET | `/admin/transactions` | administrator | Historial de pagos con búsqueda y paginación |
| GET | `/admin/moderation/:entity` | administrator | Elementos a moderar (requests, offers, reviews, appointments) |
| PATCH | `/admin/moderation/:entity/:id` | administrator | Cambiar estado de moderación |
| GET | `/admin/inquiries` | administrator | Consultas con búsqueda, filtro por estado y paginación |
| GET | `/admin/inquiries/:id` | administrator | Detalle de una consulta (con email y respuesta) |
| POST | `/admin/inquiries/:id/reply` | administrator | Responder una consulta y avisar al usuario |
| POST | `/support/tickets` | client, professional | Enviar una consulta desde Ayuda |
