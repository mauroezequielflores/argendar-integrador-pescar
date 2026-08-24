# 👤 Módulo 05: Perfil (Cliente)

## 📋 Resumen del Módulo
Gestiona el ciclo de autenticación y la información personal de los usuarios con rol Cliente, permitiendo el registro rápido, inicio de sesión seguro con JWT, recuperación de clave con enlace temporal, redirección automática por rol post-login a la vista de **Mis Tareas** (`/tasks`) y la administración de datos de contacto y direcciones habituales guardadas.

### 🎯 Historias de Usuario Cubiertas
* **`HU-01`:** Formulario de registro de cuenta de Cliente (nombre, apellido, email, contraseña).
* **`HU-03`:** Login seguro con JWT y validación de usuario no suspendido.
* **`HU-04`:** Flujo de recuperación de contraseña con validación anti-enumeración.
* **`HU-05`:** Redirección automática de rol Cliente hacia `/tasks`.
* **`HU-06`:** Pantalla "Mi Perfil" (Cliente) para actualizar datos personales y gestionar direcciones.

---

## 📁 Archivos y Reportes de este Módulo

1. 📄 **[Reporte de Especificación Técnica: Perfil Cliente](./Reporte_Especificacion_Perfil_Cliente.md)**
   * Ciclo de vida de la cuenta de Cliente.
   * Contratos de endpoints REST (`POST /auth/register`, `POST /auth/login`, `PUT /profile`).
   * Validaciones de integridad, regex de email y contraseñas robustas.
   * Componentes de pantallas de acceso y gestión de perfil.
   * Eventos del usuario y manejo de sesiones.
