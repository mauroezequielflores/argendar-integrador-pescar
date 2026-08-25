# 🔐 Módulo 00: Registro y Autenticación (`EP-AUTH`)

## 📋 Resumen del Módulo
El módulo **EP-AUTH** es la columna vertebral de la plataforma Argendar. Gestiona la identidad, el registro por roles, el inicio de sesión seguro, la recuperación de credenciales y el control de accesos mediante políticas RLS en Supabase PostgreSQL y middlewares en Express.js.

### 👥 Roles Soportados
* **`client` (Cliente):** Usuario que publica necesidades de servicios técnicos y contrata profesionales.
* **`professional` (Profesional):** Técnico matriculado o especialista que ofrece sus servicios y envía presupuestos.
* **`admin` (Administrador):** Gestión general de la plataforma y usuarios.

### 🎯 Historias de Usuario Cubiertas
* **`HU-01`:** Registro de Cliente (nombre, apellido, email, contraseña).
* **`HU-02`:** Registro de Profesional (inicio de cuenta y vinculación con onboarding).
* **`HU-03`:** Inicio de Sesión seguro con JWT y validación de estado activo.
* **`HU-04`:** Recuperación de Contraseña con enlace seguro y protección contra enumeración de cuentas.
* **`HU-05`:** Redirección automática post-login según el rol del usuario (`/tasks` para Clientes, `/onboarding` o `/agenda` para Profesionales).

---

## 📁 Archivos y Reportes de este Módulo

1. 📄 **[Reporte de Especificación Backend (EP-AUTH)](./Reporte_Especificacion_Backend_EP-AUTH.md)**
   * Modelo DDL en español (`public.profiles` y `public.professional_profiles`).
   * Políticas de seguridad Row Level Security (RLS).
   * Contratos de endpoints REST (`/register`, `/login`, `/recover-password`, `/me`).
   * Middlewares de seguridad (`authMiddleware`, `requireRole`, `requireOnboardingComplete`).

2. 🧪 **[Reporte de QA Automation y Testing Backend](./Reporte_QA_Automation_Testing.md)**
   * Matriz de 33 casos de prueba ejecutados y aprobados (100% éxito).
   * Catálogo de 13 usuarios de prueba persistidos en la base de datos real de Supabase.
   * Pruebas de integración, E2E y unitarias.

3. 📮 **[Colección de Postman v2.1](./Argendar_Auth_Tests.postman_collection.json)**
   * Colección completa lista para importar en Postman con scripts de test y variables de entorno automatizadas.
