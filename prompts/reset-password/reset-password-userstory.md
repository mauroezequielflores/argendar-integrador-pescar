# Historia de Usuario — Recuperación y Restablecimiento de Contraseña

1. **Rol**: Público (Cliente / Profesional / Administrador)
2. **Rutas**:
   - `/reset-password` (Solicitud de recuperación y confirmación de envío)
   - `/reset-password/confirm` (Establecimiento de nueva contraseña)
3. **Narrativa**:
   Como usuario de Argendar que olvidó su contraseña o necesita restablecerla,  
   quiero ingresar mi correo electrónico para recibir un enlace de recuperación y luego establecer una nueva clave segura,  
   para poder recuperar el acceso a mi cuenta de manera simple, rápida y segura.

---

## 4. Criterios de Aceptación

### CA01 — Pantalla "Recuperar contraseña" (`/reset-password` - Paso 1)
- **Contenedor y Diseño Visual**:
  - Fondo general de la pantalla: `#292929`.
  - Tarjeta central: `#202020` con bordes redondeados (`rounded-[16px]`), sombra pronunciada y ancho máximo controlado (`max-w-[440px]`).
  - En la parte superior de la tarjeta se debe mostrar una insignia circular oscura (`#292929`) con el ícono de llave (`KeyIcon`) en color blanco.
  - Título principal: **"Recuperar contraseña"** en texto blanco, tipografía semibold/bold de 22px.
  - Subtítulo explicativo: *"Ingresa tu correo electrónico para recibir las instrucciones de recuperación"* en color `#A8A8AA`.
- **Formulario e Interacción**:
  - Campo de entrada con etiqueta **"Correo electrónico"** y placeholder *"Ingresa tu correo electronico"*.
  - Validación con React Hook Form + Zod: campo obligatorio y formato válido de email.
  - Botón primario naranja (`#F78736` / `#FD7B03`) con el texto **"Enviar instrucciones"**, con estado de carga (`isLoading`).
- **Navegación y Separador**:
  - Separador horizontal con punto circular central estilizado (`─ ◦ ─`).
  - Enlace inferior con flecha izquierda: **"← Volver al inicio de sesión"** en color naranja de acento (`#FD7B03`), que redirige a `/login`.

---

### CA02 — Pantalla "Correo enviado" (`/reset-password` - Paso 2)
- **Contenedor y Diseño Visual**:
  - Misma tarjeta centrada (`#202020`) sobre fondo `#292929`.
  - Insignia circular superior con ícono de avión de papel (`PaperAirplaneIcon`) en color blanco.
  - Título principal: **"Correo enviado"** en texto blanco.
  - Mensaje descriptivo: *"Hemos enviado un enlace de recuperación a tu correo electrónico. Por favor, revisa tu bandeja de entrada."* en color `#A8A8AA`.
- **Acciones e Interacción**:
  - Botón primario naranja con el texto **"Entendido"**, que redirige al inicio de sesión (`/login`).
  - Separador horizontal con punto circular central (`─ ◦ ─`).
  - Sección inferior: *"¿No recibiste el correo? "* en color `#A8A8AA` seguido del enlace interactivo **"Reenviar enlace"** en texto blanco y subrayado, que invoca el servicio de reenvío con feedback visual.

---

### CA03 — Pantalla "Establecer nueva contraseña" (`/reset-password/confirm` - Paso 3)
- **Contenedor y Diseño Visual**:
  - Misma tarjeta centrada (`#202020`) sobre fondo `#292929`.
  - Título principal: **"Establecer nueva contraseña"** (con salto de línea armónico) en texto blanco.
  - Subtítulo: *"Ingresá tus credenciales para acceder a tu cuenta."* en color `#A8A8AA`.
- **Formulario y Validaciones**:
  - Campo **"Nueva contraseña"** con placeholder *"Ingresa tu contraseña"* e ícono de ojo para alternar visibilidad (Eye / EyeSlash).
  - Campo **"Confirmar contraseña"** con placeholder *"Ingresa tu contraseña"* e ícono de ojo para alternar visibilidad.
  - Validación con React Hook Form + Zod:
    - Mínimo 8 caracteres.
    - Al menos una letra mayúscula.
    - Al menos un número.
    - Confirmación idéntica a la nueva contraseña ("Las contraseñas no coinciden").
  - Botón primario naranja con el texto **"Restablecer contraseña"**, con estado de carga.
  - Feedback visual de éxito con redirección automática a `/login`.
- **Navegación**:
  - Separador horizontal con punto circular central (`─ ◦ ─`).
  - Texto inferior: *"¿Prefieres volver? "* en `#A8A8AA` con enlace **"Iniciar sesión"** en blanco subrayado apuntando a `/login`.

---

### CA04 — Arquitectura, Modularidad y Preparación para Backend
- **Componentes Reutilizables**:
  - `AuthCenteredCard`: Tarjeta de autenticación centrada con fondo `#202020` sobre `#292929`.
  - `AuthHeaderBadge`: Insignia circular para iconos de cabecera.
  - `AuthDivider`: Separador con línea y punto central.
- **Servicio Backend (`auth.service.js`)**:
  - Funciones preparadas (`requestPasswordReset`, `resendPasswordReset`, `resetPasswordConfirm`) con integración a la instancia de Axios (`api`) y mocks asíncronos para desarrollo local.