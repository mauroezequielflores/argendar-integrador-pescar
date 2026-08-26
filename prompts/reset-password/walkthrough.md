# Reset Password Flow — Walkthrough

Recreación completa del módulo y pantallas de **Recuperar y Restablecer Contraseña** para Argendar según las 3 capturas provistas y los requerimientos del usuario.

## Resumen de Cambios Realizados

### 1. Sistema de Diseño e Identidad Visual
- **Fondo / Background**: `#292929`
- **Tarjeta / Card**: `#202020`
- **Insignias y Separador**: Creados `AuthHeaderBadge` e `AuthDivider` (`─ ◦ ─`) replicando exactamente los elementos visuales de las capturas.

### 2. Módulo de Servicios Backend (`src/features/auth/services/auth.service.js`)
- Módulo desacoplado utilizando la instancia global de Axios (`api`), con funciones listas para endpoints reales y fallback con retardo simulado para entorno local:
  - `requestPasswordReset({ email })`
  - `resendPasswordReset({ email })`
  - `resetPasswordConfirm({ token, password, confirmPassword })`

### 3. Esquemas de Validación (`src/validations/resetPassword.schema.js`)
- `resetPasswordRequestSchema`: Validación de email requerido y formato de correo electrónico.
- `resetPasswordConfirmSchema`: Validación de nueva contraseña (mínimo 8 caracteres, al menos 1 letra mayúscula y al menos 1 número) y validación de coincidencia exacta con confirmPassword.

### 4. Componentes Reutilizables Creados
- `src/features/auth/components/AuthCenteredCard.jsx`
- `src/features/auth/components/AuthHeaderBadge.jsx`
- `src/features/auth/components/AuthDivider.jsx`

### 5. Pantallas Creadas
- `src/features/auth/pages/ResetPasswordPage.jsx`:
  - **Paso 1**: Título *"Recuperar contraseña"*, insignia con `KeyIcon`, input de email con validación, botón *"Enviar instrucciones"* y enlace *"← Volver al inicio de sesión"* en naranja.
  - **Paso 2**: Título *"Correo enviado"*, insignia con `PaperAirplaneIcon`, mensaje descriptivo, botón *"Entendido"* (redirige a `/login`), y enlace interactivo *"Reenviar enlace"*.
- `src/features/auth/pages/ResetPasswordConfirmPage.jsx`:
  - **Paso 3**: Título *"Establecer nueva contraseña"*, campos de *"Nueva contraseña"* y *"Confirmar contraseña"* con toggle de visualización, botón *"Restablecer contraseña"*, mensaje de éxito con auto-redirección y enlace *"¿Prefieres volver? Iniciar sesión"*.

### 6. Enrutamiento y Conexión
- `src/constants/routes.js`: Rutas `RESET_PASSWORD: "/reset-password"` y `RESET_PASSWORD_CONFIRM: "/reset-password/confirm"`.
- `src/app/router/AppRouter.jsx`: Integradas ambas pantallas como rutas públicas.
- `src/features/auth/pages/LoginPage.jsx`: Enlace "¿Olvidaste tu contraseña?" conectado a `/reset-password`.
- `src/features/auth/index.js`: Exportación centralizada de componentes, páginas y servicios.

---

## Verificación de Cumplimiento de Pautas

| Pauta / Requisito | Estado | Observación |
|---|---|---|
| Fondo `#292929` y Card `#202020` | Cumplido | Implementado en `AuthCenteredCard` |
| JavaScript moderno sin TypeScript | Cumplido | Todos los archivos en `.js` / `.jsx` |
| Validación Zod + React Hook Form | Cumplido | `resetPassword.schema.js` integrado en ambas páginas |
| Sin librerías no autorizadas | Cumplido | Solo React + Tailwind + Heroicons |
| Preparado para Backend | Cumplido | `auth.service.js` con llamadas a Axios listas |
| Componentes Reutilizables | Cumplido | `AuthCenteredCard`, `AuthHeaderBadge`, `AuthDivider` |
| Documentación guardada | Cumplido | `userstory.md`, `implementation_plan.md` y `walkthrough.md` en `prompts/reset-password/` |