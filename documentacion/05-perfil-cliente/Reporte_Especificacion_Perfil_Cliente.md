# Reporte de Especificación Técnica — Módulo Perfil (Cliente)

**Proyecto:** Argendar — Plataforma Integrada de Servicios Técnicos  
**Módulo:** Autenticación y Perfil de Usuario (Cliente)  
**Historias de Usuario:** `HU-01`, `HU-03`, `HU-04`, `HU-05`, `HU-06`  
**Rol Principal:** Cliente  
**Versión:** 1.0.0  

---

## 1. Objetivo
Gestionar el ciclo de autenticación y la información personal de los usuarios con rol Cliente, permitiendo el registro, inicio de sesión seguro, recuperación de contraseña, redirección por rol post-login y la administración de datos de contacto y direcciones preferidas.

---

## 2. Usuarios Principales
* **Cliente**

---

## 3. Entrada al Flujo
* **Registro de Cliente:** `/register/client`
* **Inicio de Sesión:** `/login`
* **Recuperación de Contraseña:** `/forgot-password`
* **Perfil de Cuenta:** Menú del usuario -> **"Mi Perfil"**

---

## 3.1 Contratos de la API REST (Backend Request / Response)

### A. Registro de Cliente (`POST /api/v1/auth/register`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `email` | String | Sí | Correo electrónico del cliente |
| `password` | String | Sí | Clave de acceso (mínimo 8 caracteres, 1 mayúscula, 1 número) |
| `first_name` | String | Sí | Nombre del cliente |
| `last_name` | String | Sí | Apellido del cliente |
| `role` | String | Sí | Valor fijo `'client'` |

### B. Inicio de Sesión (`POST /api/v1/auth/login`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `email` | String | Sí | Correo del usuario |
| `password` | String | Sí | Contraseña |

### C. Actualizar Datos de Perfil (`PUT /api/v1/profile`)
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

## 4. Componentes de las Pantallas

### A. Pantalla HU-01 — Formulario de Registro de Cliente
* Campos: Nombre, Apellido, Correo electrónico, Contraseña y Confirmación de contraseña.
* Botón *"Registrarme como Cliente"*. Enlace hacia login si ya posee cuenta.

### B. Pantalla HU-03 & HU-05 — Login y Redirección por Rol
* Campos: Correo electrónico y Contraseña. Botón *"Iniciar Sesión"*.
* Redirección automática post-login: Redirige al Cliente a la vista de **"Mis Tareas"** (`/tasks`).

### C. Pantalla HU-04 — Recuperación de Contraseña
* Campo: Correo electrónico registrado. Botón *"Enviar instrucciones de recuperación"*.

### D. Pantalla Mi Perfil (Cliente)
* Ficha de datos personales editables (Nombre, Apellido, Teléfono de contacto).
* Gestión de direcciones habituales guardadas.

---

## 5. Matriz de Estados de la UI
* **Formulario:** Vacío, Validando campos, Enviando (Spinner), Error de autenticación (credenciales inválidas, email duplicado), Autenticado exitosamente.

---

## 6. Requisitos y Reglas de Negocio
1. El registro asigna automáticamente el rol `client`.
2. Post-login exitoso, la aplicación evalúa el rol del JWT y redirige a la pantalla `/tasks`.
3. El cierre de sesión revoca el token JWT y limpia el estado local del navegador.

---

## 7. Eventos del Usuario
* **Submit en Registro:** Valida datos y crea la cuenta.
* **Submit en Login:** Valida credenciales e ingresa.
* **Click en "Cerrar Sesión":** Revoca la sesión y redirige al Landing Page.
