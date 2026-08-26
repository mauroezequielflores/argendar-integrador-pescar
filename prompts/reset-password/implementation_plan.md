# Reset Password Flow — Implementation Plan

## Descripción

Implementación de la recreación del flujo de **Recuperar y Restablecer Contraseña** (3 estados / pantallas de las capturas de referencia) para la aplicación Argendar.
Cumple con las directrices de `context/prompt-recreacion-de-pantallas.md`:
- JavaScript únicamente (sin TypeScript).
- React + Tailwind CSS + Heroicons.
- React Hook Form + Zod para validaciones.
- Inversión de colores solicitada: Fondo general `#292929` y tarjeta/card en `#202020`.
- Módulo desacoplado y preparado para conexión futura con backend (`services/auth.service.js`).
- Componentes altamente modulares y reutilizables.

---

## Componentes y Arquitectura

### 1. Componentes Reutilizables Creados
- `src/features/auth/components/AuthCenteredCard.jsx`: Contenedor principal con fondo `#202020` sobre `#292929`, `rounded-[16px]`, `max-w-[440px]`, sombras y padding responsive.
- `src/features/auth/components/AuthHeaderBadge.jsx`: Insignia circular oscura (`#292929`) para alojar los íconos de cabecera (`KeyIcon`, `PaperAirplaneIcon`).
- `src/features/auth/components/AuthDivider.jsx`: Separador visual con línea `#3a3a3a` y punto central estilizado según el diseño de las capturas.

### 2. Validaciones (`src/validations/resetPassword.schema.js`)
- `resetPasswordRequestSchema`: Valida email obligatorio y formato de correo electrónico.
- `resetPasswordConfirmSchema`: Valida longitud (mín. 8 caracteres), mayúscula, número y coincidencia de confirmación de contraseña.

### 3. Capa de Servicios Backend (`src/features/auth/services/auth.service.js`)
- `requestPasswordReset({ email })`: Prepara la petición POST a endpoint de forgot-password con mock asíncrono para local.
- `resendPasswordReset({ email })`: Prepara el reenvío de enlace de recuperación.
- `resetPasswordConfirm({ token, password, confirmPassword })`: Prepara el cambio final de contraseña.

### 4. Páginas
- `src/features/auth/pages/ResetPasswordPage.jsx`: Renderiza Paso 1 (Formulario de correo) y Paso 2 (Confirmación "Correo enviado" con reenvío), con navegación a login y soporte para query param `?step=sent`.
- `src/features/auth/pages/ResetPasswordConfirmPage.jsx`: Renderiza Paso 3 (Formulario de establecimiento de nueva clave) con toggle de visibilidad en campos de contraseña y feedback de éxito.

### 5. Rutas y Enlaces
- `src/constants/routes.js`: Agregadas `RESET_PASSWORD` (`/reset-password`) y `RESET_PASSWORD_CONFIRM` (`/reset-password/confirm`).
- `src/app/router/AppRouter.jsx`: Incorporadas las rutas públicas en el árbol de rutas.
- `src/features/auth/pages/LoginPage.jsx`: Enlace "¿Olvidaste tu contraseña?" actualizado hacia `ROUTES.RESET_PASSWORD`.
- `src/features/auth/index.js`: Barril de exportaciones para el módulo auth.

---

## Checklist Final

- [x] No se agregó ni actualizó ninguna dependencia
- [x] No se modificó package.json ni configuración de Vite/Tailwind/ESLint
- [x] No hay archivos .ts/.tsx
- [x] Fondo general configurado en `#292929` y Card en `#202020`
- [x] Módulo listo para conexión con backend (`services/auth.service.js`)
- [x] Componentes reutilizables creados y desacoplados
- [x] Criterios de aceptación y 3 capturas recreadas fielmente