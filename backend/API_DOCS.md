# API Argendar — Documentación de Endpoints

## Información general

- **Base URL:** `http://localhost:5000`
- **Prefijo:** `/api/v1`
- **Content-Type:** `application/json` (en todos los POST)
- **Autenticación:** Bearer Token en el header `Authorization`

### ¿Cómo enviar el token?

Los endpoints que requieren autenticación necesitan el header:

```
Authorization: Bearer <accessToken>
```

El `accessToken` se obtiene de la respuesta del endpoint de login.

---

## Auth — Autenticación

### POST /api/v1/auth/register

Crea una cuenta nueva de usuario.

**Autenticación:** No requiere

**Body:**

```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@ejemplo.com",
  "password": "123456"
}
```

| Campo    | Tipo   | Obligatorio | Reglas                   |
|----------|--------|-------------|--------------------------|
| nombre   | string | Sí          | No puede estar vacío     |
| apellido | string | Sí          | No puede estar vacío     |
| email    | string | Sí          | Formato email válido     |
| password | string | Sí          | Mínimo 6 caracteres      |

**Respuestas:**

`201` — Usuario creado con éxito

```json
{
  "status": "success",
  "message": "Usuario registrado con éxito.",
  "data": {
    "user": {
      "id": "uuid-del-usuario",
      "email": "juan@ejemplo.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "created_at": "2026-07-29T14:30:00.000Z"
    },
    "session": {
      "accessToken": "eyJhbG...",
      "refreshToken": "eyJhbG...",
      "expiresIn": 3600
    }
  }
}
```

`400` — Error de validación

```json
{
  "status": "error",
  "message": "El campo 'nombre' es obligatorio."
}
```

`409` — Email ya registrado

```json
{
  "status": "error",
  "message": "El correo electrónico ya está registrado."
}
```

---

### POST /api/v1/auth/login

Inicia sesión con un usuario ya registrado.

**Autenticación:** No requiere

**Body:**

```json
{
  "email": "juan@ejemplo.com",
  "password": "123456"
}
```

| Campo    | Tipo   | Obligatorio | Reglas               |
|----------|--------|-------------|----------------------|
| email    | string | Sí          | Formato email válido |
| password | string | Sí          | No puede estar vacío |

**Respuestas:**

`200` — Login exitoso

```json
{
  "status": "success",
  "message": "Sesión iniciada con éxito.",
  "data": {
    "user": {
      "id": "uuid-del-usuario",
      "email": "juan@ejemplo.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "created_at": "2026-07-29T14:30:00.000Z"
    },
    "session": {
      "accessToken": "eyJhbG...",
      "refreshToken": "eyJhbG...",
      "expiresIn": 3600
    }
  },
  "accessToken": "eyJhbG..."
}
```

`400` — Error de validación

```json
{
  "status": "error",
  "message": "Debe proporcionar una dirección de correo válida para iniciar sesión."
}
```

`401` — Credenciales incorrectas

```json
{
  "status": "error",
  "message": "Email o contraseña incorrectos."
}
```

---

### GET /api/v1/auth/me

Devuelve los datos del usuario autenticado.

**Autenticación:** Sí (Bearer Token)

**Body:** No enviar

**Headers:**

```
Authorization: Bearer eyJhbG...
```

**Respuestas:**

`200` — Usuario encontrado

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid-del-usuario",
      "email": "juan@ejemplo.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "created_at": "2026-07-29T14:30:00.000Z"
    }
  }
}
```

`401` — Token inválido o no enviado

```json
{
  "status": "error",
  "message": "No autorizado. Token no proporcionado."
}
```

---

### POST /api/v1/auth/forgot-password

Solicita el envío de un email con un enlace para recuperar la contraseña.

**Autenticación:** No requiere

**Body:**

```json
{
  "email": "juan@ejemplo.com"
}
```

| Campo | Tipo   | Obligatorio | Reglas               |
|-------|--------|-------------|----------------------|
| email | string | Sí          | Formato email válido |

**Respuestas:**

`200` — Solicitud procesada (siempre responde igual por seguridad)

```json
{
  "status": "success",
  "message": "Si existe una cuenta asociada al correo, se enviará un enlace de recuperación."
}
```

`400` — Error de validación

```json
{
  "status": "error",
  "message": "Debe proporcionar una dirección de correo válida."
}
```

**Notas para el frontend:**
- Siempre responde 200 sin importar si el email existe o no (por seguridad).
- Después de recibir la respuesta, mostrar la pantalla "Revisá tu correo" (pantalla 2).
- Supabase envía un email con un enlace que redirige a la URL configurada (ej: `http://localhost:5173/reset-password`).
- El enlace tiene este formato: `http://localhost:5173/reset-password#access_token=eyJhbG...&type=recovery`

---

### POST /api/v1/auth/reset-password

Restablece la contraseña usando el token de recuperación recibido por email.

**Autenticación:** No requiere (el token del email actúa como verificación)

**Body:**

```json
{
  "token": "eyJhbG...",
  "password": "nuevaPassword123",
  "confirmPassword": "nuevaPassword123"
}
```

| Campo           | Tipo   | Obligatorio | Reglas                              |
|-----------------|--------|-------------|-------------------------------------|
| token           | string | Sí          | No puede estar vacío                |
| password        | string | Sí          | Mínimo 6 caracteres                 |
| confirmPassword | string | Sí          | Debe coincidir con password         |

**Respuestas:**

`200` — Contraseña actualizada

```json
{
  "status": "success",
  "message": "La contraseña fue actualizada correctamente."
}
```

`400` — Error de validación

```json
{
  "status": "error",
  "message": "Las contraseñas no coinciden."
}
```

`401` — Token inválido o expirado

```json
{
  "status": "error",
  "message": "El enlace de recuperación es inválido o ha expirado. Solicitá uno nuevo."
}
```

**Notas para el frontend:**
- El `token` es el `access_token` que viene en el hash (#) de la URL cuando el usuario hace click en el enlace del email.
- Para extraerlo: `const token = window.location.hash.split('access_token=')[1]?.split('&')[0]`
- Si responde 200, mostrar pantalla de confirmación (pantalla 4) con mensaje de éxito.
- Si responde 401, mostrar pantalla de confirmación (pantalla 4) con mensaje de error y opción de solicitar un nuevo enlace.

---

## Turnos

### GET /api/v1/turnos/:usuarioId

Devuelve los turnos asociados a un usuario.

**Autenticación:** Sí (Bearer Token)

**Parámetros de URL:**

| Parámetro  | Tipo   | Obligatorio | Reglas          |
|------------|--------|-------------|-----------------|
| usuarioId  | string | Sí          | UUID v4 válido  |

**Body:** No enviar

**Headers:**

```
Authorization: Bearer eyJhbG...
```

**Respuestas:**

`200` — Lista de turnos

```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid-del-turno",
      "usuarioId": "uuid-del-usuario",
      "servicio": "Consulta Médica General - Clínica Médica",
      "fechaOriginal": "2026-07-30T10:00:00.000Z",
      "fechaFormateada": "30/07/2026 10:00",
      "estado": "PENDIENTE",
      "estadoLabel": "Pendiente de Confirmación",
      "creadoEl": "29/07/2026 14:30"
    }
  ]
}
```

`400` — UUID inválido

```json
{
  "status": "error",
  "message": "El parámetro usuarioId no es un UUID válido."
}
```

`401` — Token inválido o no enviado

```json
{
  "status": "error",
  "message": "No autorizado. Token no proporcionado."
}
```

---

## Otros

### GET /api/v1/usuarios

Devuelve la lista de todos los usuarios registrados.

**Autenticación:** No requiere

**Body:** No enviar

**Respuestas:**

`200` — Lista de usuarios

```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid-del-usuario",
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan@ejemplo.com",
      "created_at": "2026-07-29T14:30:00.000Z"
    }
  ]
}
```

---

### GET /api/v1/ejemplo

Endpoint de prueba para verificar que la API funciona.

**Autenticación:** No requiere

**Body:** No enviar

**Respuestas:**

`200` — OK

```json
{
  "message": "Endpoint de ejemplo del equipo"
}
```

---

### GET /

Health check del servidor.

**Autenticación:** No requiere

**Respuestas:**

`200` — Servidor activo

```
Servidor de Argendar activo
```

---

## Resumen rápido

| Método | Ruta                          | Auth | Descripción                        |
|--------|-------------------------------|------|------------------------------------|
| POST   | /api/v1/auth/register         | No   | Crear cuenta                       |
| POST   | /api/v1/auth/login            | No   | Iniciar sesión                     |
| GET    | /api/v1/auth/me               | Sí   | Obtener usuario actual             |
| POST   | /api/v1/auth/forgot-password  | No   | Solicitar recuperación contraseña  |
| POST   | /api/v1/auth/reset-password   | No   | Restablecer contraseña con token   |
| GET    | /api/v1/turnos/:usuarioId     | Sí   | Obtener turnos de un usuario       |
| GET    | /api/v1/usuarios              | No   | Listar todos los usuarios          |
| GET    | /api/v1/ejemplo               | No   | Endpoint de prueba                 |
| GET    | /                             | No   | Health check                       |
