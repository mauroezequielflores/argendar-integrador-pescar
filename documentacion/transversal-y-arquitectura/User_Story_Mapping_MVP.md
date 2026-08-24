# USER STORY MAPPING & PRODUCT BACKLOG MVP — ARGENDAR
**Modelo de Negocio:** Marketplace de Solicitudes y Cotizaciones (On-Demand)
**Stack Tecnológico:** React (JS) + Node.js (REST API) + Supabase (PostgreSQL, Auth, Storage, RLS) + Mercado Pago (Checkout Pro / Webhooks) + Despliegue Cloud

---

## 1. MATRIZ DE USER STORY MAP

El User Story Map (USM) de **Argendar** se estructura con el flujo de conversión del marketplace en el **Eje Horizontal** (secuencia de valor del usuario) y la priorización de entregas en el **Eje Vertical** (Cortes de Release).

### 1.1 Diagrama de Flujo y Actividades (Eje Horizontal)

```
=============================================================================================================================================================
                                                     FLUJO HORIZONTAL DEL MARKETPLACE (EJE DE VALOR)
=============================================================================================================================================================
    EP-AUTH              EP-ONBOARD          EP-PUBLISH            EP-FEED             EP-QUOTE            EP-ACCEPT           EP-PAY              EP-AGENDA
  1. Registro y        2. Onboarding       3. Publicación       4. Exploración      5. Cotización        6. Comparación      7. Pagos y          8. Agenda y
  Autenticación        Profesional          de Tareas            de Trabajos         y Propuestas        y Aceptación        Transacciones       Ejecución
-------------------------------------------------------------------------------------------------------------------------------------------------------------
[Registro Cliente]   [Datos de Perfil]   [Confirmar Zona]     [Feed Abierto]      [Enviar Oferta]      [Ver Ofertas]       [Cobro Seña]        [Crear Turno]
[Registro Prof.]     [Selección Rubros]  [Elegir Rubro]       [Filtrar Rubro/Z.]  [Proponer Fecha]     [Comparar Lado]     [Webhook Seña]      [Mi Agenda Cl.]
[Login Usuario]      [Zonas Cobertura]   [Cuestionario Din.]  [Ver Detalle Tarea] [Mis Cotizaciones]   [Aceptar Oferta]    [Pago Fallido]      [Mi Agenda Pr.]
[Recuperar Pass]     [Perfil Público]    [Fecha Deseada]      [Galería de Fotos]  [Retirar Oferta]     [Rechazo Autom.]    [Expiración Reint.] [Detalle Turno]
[Redirección Rol]                        [Cargar Fotos]                                                                    [Cobro Saldo]       [In Progress]
[Cierre Sesión]                          [Resumen Tarea]                                                                   [Webhook Saldo]     [Completado]
                                         [Publicar Tarea]                                                                  [Resultado Pago]    [Cancelar]
                                         [Mis Publicaciones]                                                                                   [Historial]
                                         [Editar Tarea]
                                         [Cancelar Tarea]
=============================================================================================================================================================
                                               EP-NOTIF (9. Notificaciones In-App) | EP-CHAT (10. Chatbot FAQ)
                                                  EP-ADMIN (11. Dashboard de Administrador y Moderación)
=============================================================================================================================================================
```

### 1.2 Corte por Releases (Eje Vertical)

| Capa / Corte | Épicas Incluidas | Alcance Funcional |
| :--- | :--- | :--- |
| **MVP (Release 1.0)** | `EP-AUTH`, `EP-ONBOARD`, `EP-PUBLISH`, `EP-FEED`, `EP-QUOTE`, `EP-ACCEPT`, `EP-PAY`, `EP-AGENDA`, `EP-NOTIF`, `EP-CHAT`, `EP-ADMIN` | **Alcance completo para los rubros iniciales (Frigoristas, Plomeros, Electricistas).** Incluye registro diferenciado, onboarding, publicación de tareas con cuestionario dinámico y fotos, feed de profesionales, sistema de cotizaciones, aceptación con cobro de seña en MP, agenda con tabla `appointments` separada, cobro de saldo al finalizar, campana de notificaciones in-app (7 eventos), chatbot FAQ de árbol de decisión y panel de administración único. |
| **Release 1.1 / Futuro** | Mejoras Transversales | **Funcionalidades diferidas:** Chat en vivo entre Cliente y Profesional, filtros de feed por calificación/rango de precio, notificaciones push (móvil/browser) y por email, integración con LLMs externos en Chatbot (Gemini/OpenAI), gestión de disputas en plataforma, reembolsos automáticos, CRUD de rubros desde panel admin y pagos fraccionados por hito/milestone. |

---

## 2. TABLA RESUMEN DEL PRODUCT BACKLOG

| ID HU | Épica | Nombre de la Historia | Rol | Prioridad (MoSCoW) | Estimación (Pts) | Release |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **HU-01** | `EP-AUTH` | Registro de Cliente | Cliente | Must Have | 3 | 1.0 |
| **HU-02** | `EP-AUTH` | Registro de Profesional | Profesional | Must Have | 3 | 1.0 |
| **HU-03** | `EP-AUTH` | Login de usuario | Cliente / Prof. / Admin | Must Have | 3 | 1.0 |
| **HU-04** | `EP-AUTH` | Recuperación de contraseña | Cliente / Profesional | Should Have | 3 | 1.0 |
| **HU-05** | `EP-AUTH` | Redirección por rol post-login | Cliente / Prof. / Admin | Must Have | 2 | 1.0 |
| **HU-06** | `EP-AUTH` | Cierre de sesión | Cliente / Prof. / Admin | Must Have | 1 | 1.0 |
| **HU-07** | `EP-ONBOARD` | Completar perfil profesional | Profesional | Must Have | 3 | 1.0 |
| **HU-08** | `EP-ONBOARD` | Selección de rubros de servicio | Profesional | Must Have | 3 | 1.0 |
| **HU-09** | `EP-ONBOARD` | Definición de zonas de cobertura | Profesional | Must Have | 3 | 1.0 |
| **HU-10** | `EP-ONBOARD` | Visualización del perfil profesional público | Cliente | Should Have | 2 | 1.0 |
| **HU-11** | `EP-PUBLISH` | Confirmar ubicación/dirección del servicio | Cliente | Must Have | 3 | 1.0 |
| **HU-12** | `EP-PUBLISH` | Selección de rubro y tipo de problema | Cliente | Must Have | 3 | 1.0 |
| **HU-13** | `EP-PUBLISH` | Cuestionario dinámico por rubro | Cliente | Must Have | 8 | 1.0 |
| **HU-14** | `EP-PUBLISH` | Selección de fecha deseada y franja horaria | Cliente | Must Have | 3 | 1.0 |
| **HU-15** | `EP-PUBLISH` | Carga de fotos del problema | Cliente | Must Have | 5 | 1.0 |
| **HU-16** | `EP-PUBLISH` | Pantalla de resumen y confirmación | Cliente | Must Have | 3 | 1.0 |
| **HU-17** | `EP-PUBLISH` | Publicar tarea | Cliente | Must Have | 3 | 1.0 |
| **HU-18** | `EP-PUBLISH` | Ver mis tareas publicadas | Cliente | Must Have | 3 | 1.0 |
| **HU-19** | `EP-PUBLISH` | Editar tarea publicada (antes de ofertas) | Cliente | Should Have | 3 | 1.0 |
| **HU-20** | `EP-PUBLISH` | Cancelar tarea publicada | Cliente | Must Have | 2 | 1.0 |
| **HU-21** | `EP-FEED` | Feed de tareas abiertas | Profesional | Must Have | 5 | 1.0 |
| **HU-22** | `EP-FEED` | Filtros del feed por zona y rubro | Profesional | Must Have | 3 | 1.0 |
| **HU-23** | `EP-FEED` | Vista detallada de tarea | Profesional | Must Have | 3 | 1.0 |
| **HU-24** | `EP-FEED` | Galería de fotos de la tarea | Profesional | Should Have | 3 | 1.0 |
| **HU-25** | `EP-QUOTE` | Enviar cotización/propuesta | Profesional | Must Have | 5 | 1.0 |
| **HU-26** | `EP-QUOTE` | Proponer fecha/hora respetando preferencias | Profesional | Must Have | 3 | 1.0 |
| **HU-27** | `EP-QUOTE` | Ver mis cotizaciones enviadas | Profesional | Must Have | 3 | 1.0 |
| **HU-28** | `EP-QUOTE` | Retirar/cancelar cotización enviada | Profesional | Should Have | 2 | 1.0 |
| **HU-29** | `EP-ACCEPT` | Ver cotizaciones recibidas para una tarea | Cliente | Must Have | 3 | 1.0 |
| **HU-30** | `EP-ACCEPT` | Comparar cotizaciones lado a lado | Cliente | Should Have | 5 | 1.0 |
| **HU-31** | `EP-ACCEPT` | Aceptar una cotización | Cliente | Must Have | 5 | 1.0 |
| **HU-32** | `EP-ACCEPT` | Rechazo automático de cotizaciones pendientes | Sistema | Must Have | 3 | 1.0 |
| **HU-33** | `EP-PAY` | Cobro de seña al aceptar cotización | Cliente | Must Have | 8 | 1.0 |
| **HU-34** | `EP-PAY` | Procesamiento de webhook de pago (seña) | Sistema | Must Have | 8 | 1.0 |
| **HU-35** | `EP-PAY` | Pago fallido y plazo de reintento | Cliente | Must Have | 5 | 1.0 |
| **HU-36** | `EP-PAY` | Expiración de plazo de reintento | Sistema | Should Have | 5 | 1.0 |
| **HU-37** | `EP-PAY` | Cobro de saldo restante al completar servicio | Cliente | Must Have | 5 | 1.0 |
| **HU-38** | `EP-PAY` | Procesamiento de webhook de pago (saldo) | Sistema | Must Have | 5 | 1.0 |
| **HU-39** | `EP-PAY` | Pantalla de resultado de pago | Cliente | Must Have | 3 | 1.0 |
| **HU-40** | `EP-AGENDA` | Creación automática de turno agendado | Sistema | Must Have | 5 | 1.0 |
| **HU-41** | `EP-AGENDA` | Vista "Mi Agenda" del Cliente | Cliente | Must Have | 3 | 1.0 |
| **HU-42** | `EP-AGENDA` | Vista "Mi Agenda" del Profesional | Profesional | Must Have | 3 | 1.0 |
| **HU-43** | `EP-AGENDA` | Detalle de turno agendado | Cliente / Profesional | Must Have | 3 | 1.0 |
| **HU-44** | `EP-AGENDA` | Marcar pedido como "En progreso" | Profesional | Must Have | 2 | 1.0 |
| **HU-45** | `EP-AGENDA` | Confirmar servicio completado | Cliente | Must Have | 3 | 1.0 |
| **HU-46** | `EP-AGENDA` | Cancelar pedido | Cliente / Profesional | Must Have | 3 | 1.0 |
| **HU-47** | `EP-AGENDA` | Historial de trabajos realizados | Cliente / Profesional | Should Have | 3 | 1.0 |
| **HU-48** | `EP-NOTIF` | Campana de notificaciones in-app | Cliente / Profesional | Must Have | 3 | 1.0 |
| **HU-49** | `EP-NOTIF` | Dropdown de notificaciones | Cliente / Profesional | Must Have | 3 | 1.0 |
| **HU-50** | `EP-NOTIF` | Notificación: Nueva cotización recibida | Cliente | Must Have | 2 | 1.0 |
| **HU-51** | `EP-NOTIF` | Notificación: Cotización aceptada | Profesional | Must Have | 2 | 1.0 |
| **HU-52** | `EP-NOTIF` | Notificación: Cotización rechazada | Profesional | Must Have | 2 | 1.0 |
| **HU-53** | `EP-NOTIF` | Notificación: Pago confirmado | Cliente / Profesional | Must Have | 2 | 1.0 |
| **HU-54** | `EP-NOTIF` | Notificación: Recordatorio 24h antes del turno | Cliente / Profesional | Should Have | 3 | 1.0 |
| **HU-55** | `EP-NOTIF` | Notificación: Trabajo completado (solicitud) | Cliente | Must Have | 2 | 1.0 |
| **HU-56** | `EP-NOTIF` | Notificación: Pedido cancelado | Cliente / Profesional | Must Have | 2 | 1.0 |
| **HU-57** | `EP-NOTIF` | Marcar notificación como leída | Cliente / Profesional | Must Have | 2 | 1.0 |
| **HU-58** | `EP-CHAT` | Widget flotante del chatbot | Cliente / Profesional | Should Have | 3 | 1.0 |
| **HU-59** | `EP-CHAT` | Interacción con árbol de preguntas frecuentes | Cliente / Profesional | Should Have | 5 | 1.0 |
| **HU-60** | `EP-CHAT` | Respuesta automática a FAQ | Cliente / Profesional | Should Have | 3 | 1.0 |
| **HU-61** | `EP-CHAT` | Mensaje de fallback del chatbot | Cliente / Profesional | Should Have | 2 | 1.0 |
| **HU-62** | `EP-ADMIN` | Acceso al panel de administrador | Administrador | Must Have | 3 | 1.0 |
| **HU-63** | `EP-ADMIN` | Listado y búsqueda de usuarios | Administrador | Must Have | 5 | 1.0 |
| **HU-64** | `EP-ADMIN` | Suspender / reactivar cuenta de usuario | Administrador | Must Have | 3 | 1.0 |
| **HU-65** | `EP-ADMIN` | Listado de tareas publicadas (moderación) | Administrador | Must Have | 5 | 1.0 |
| **HU-66** | `EP-ADMIN` | Ocultar / eliminar publicación | Administrador | Must Have | 3 | 1.0 |
| **HU-67** | `EP-ADMIN` | Dashboard de métricas (KPIs) | Administrador | Should Have | 8 | 1.0 |
| **HU-68** | `EP-ADMIN` | Historial de pagos (transacciones MP) | Administrador | Should Have | 5 | 1.0 |
| **HU-72** | `EP-AGENDA` / `EP-PAY` | Confirmación del Turno independiente del pago | Sistema / Cliente | Must Have | 5 | 1.0 |

**Resumen Cuantitativo del MVP (Release 1.0):**
- **Total de Historias de Usuario:** 69 HUs
- **Estimación Total:** 242 Story Points
- **Distribución MoSCoW:** 43 Must Have (149 pts - 61.6%) | 20 Should Have (80 pts - 33.1%) | 6 Could Have (13 pts - 5.4%)

---

## 3. FICHAS DETALLADAS DE HISTORIAS DE USUARIO

---

#### HU-01 - Registro de Cliente
* **Rol:** Cliente
* **Épica:** Registro y Autenticación (`EP-AUTH`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** visitante de la plataforma
  * **Quiero** registrarme como Cliente con mi email, contraseña, nombre y apellido
  * **Para** crear una cuenta en el marketplace y poder publicar tareas de servicio técnico
* **Criterios de Aceptación:**
  1. El formulario valida formato de email, contraseña mínima de 8 caracteres (al menos una mayúscula y un número), y campos de nombre y apellido obligatorios.
  2. Al confirmar, el sistema registra la cuenta en `auth.users` mediante Supabase Auth y genera automáticamente un perfil en `profiles` con el rol `client`.
  3. Si el correo ya existe en la base de datos, el sistema muestra un mensaje de error explícito: *"Este correo ya está registrado en Argendar"*.
  4. Tras un registro exitoso, el usuario inicia sesión de forma automática y es redirigido a la vista de "Mis Tareas".
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<RegisterForm>` en la ruta `/register/client`. Mantiene el estado local con validación de expresiones regulares. Envía un request asincrónico a la API REST de Node.js.
  * **Backend (Node.js):** Endpoint `POST /api/v1/auth/register`. Controlador `authController.register()`. Invoca `supabase.auth.signUp()`, e inserta con `SUPABASE_SERVICE_ROLE_KEY` en la tabla `profiles` (`role = 'client'`). Retorna un token JWT de sesión.
  * **Base de Datos & Storage (Supabase):** Tabla `profiles` (columnas: `id UUID PK`, `role user_role`, `first_name TEXT`, `last_name TEXT`, `is_suspended BOOLEAN DEFAULT false`). Política RLS en `profiles` que permite inserción desde backend autenticado.
  * **Despliegue / Integración:** Variables `.env`: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. CORS habilitado para `FRONTEND_URL`.

---

#### HU-02 - Registro de Profesional
* **Rol:** Profesional
* **Épica:** Registro y Autenticación (`EP-AUTH`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** visitante de la plataforma
  * **Quiero** registrarme como Profesional de servicios técnicos con mi email y contraseña
  * **Para** poder completar mi perfil profesional y acceder al feed de trabajos solicitados
* **Criterios de Aceptación:**
  1. El formulario valida email, contraseña, nombre y apellido bajo los mismos criterios de seguridad que HU-01.
  2. El sistema crea el usuario en `auth.users`, registra un perfil en `profiles` con `role = 'professional'` y crea un registro de configuración en `professional_profiles` con `is_onboarding_complete = false`.
  3. Al terminar el registro, el sistema redirige automáticamente al usuario a la pantalla de onboarding para profesionales.
  4. El profesional no puede acceder al feed de tareas sin completar el onboarding.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Reutiliza `<RegisterForm>` con el prop `role="professional"`. Ruta `/register/professional`. Al completar, ejecuta `useNavigate('/onboarding')`.
  * **Backend (Node.js):** Mismo endpoint `POST /api/v1/auth/register` indicando `role: 'professional'`. Además de `profiles`, realiza un insert en `professional_profiles` vinculando el `user_id`.
  * **Base de Datos & Storage (Supabase):** Tabla `professional_profiles` (columnas: `id UUID PK`, `user_id UUID FK`, `description TEXT`, `is_onboarding_complete BOOLEAN DEFAULT false`, `average_rating NUMERIC(3,2) DEFAULT 0`).
  * **Despliegue / Integración:** Middleware en Node.js que intercepta accesos a `/api/v1/job-requests/feed` verificando `is_onboarding_complete = true`.

---

#### HU-03 - Login de usuario
* **Rol:** Cliente / Profesional / Administrador
* **Épica:** Registro y Autenticación (`EP-AUTH`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** usuario registrado en Argendar
  * **Quiero** iniciar sesión con mi email y contraseña
  * **Para** acceder a mi cuenta y a las funcionalidades habilitadas para mi rol
* **Criterios de Aceptación:**
  1. El formulario valida que email y contraseña no se encuentren vacíos.
  2. Si las credenciales fallan, se despliega un mensaje genérico: *"Correo o contraseña incorrectos"*.
  3. Si la cuenta del usuario tiene `is_suspended = true`, se bloquea el acceso con el mensaje: *"Tu cuenta se encuentra suspendida. Contactá a soporte"*.
  4. Tras un login exitoso, el sistema guarda el token JWT en memoria y redirige al usuario al área correspondiente a su rol (HU-05).
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<LoginForm>` en `/login`. Almacena la sesión en el contexto global `<AuthProvider>`. Usa hooks de React Router para navegación condicional.
  * **Backend (Node.js):** Endpoint `POST /api/v1/auth/login`. Llama a `supabase.auth.signInWithPassword()`. Consulta la tabla `profiles` para obtener el rol y validar si el usuario está suspendido.
  * **Base de Datos & Storage (Supabase):** Query de lectura en `profiles` con RLS habilitado para que cada usuario solo lea su propio perfil (`auth.uid() = id`).
  * **Despliegue / Integración:** Configuración de expiración del token JWT en `.env` mediante `JWT_EXPIRATION=7d`.

---

#### HU-04 - Recuperación de contraseña
* **Rol:** Cliente / Profesional
* **Épica:** Registro y Autenticación (`EP-AUTH`)
* **Prioridad:** Should Have
* **Narrativa:**
  * **Como** usuario registrado
  * **Quiero** solicitar un enlace de recuperación de contraseña en mi email
  * **Para** restablecer mi acceso a la plataforma si olvidé mis credenciales
* **Criterios de Aceptación:**
  1. El usuario ingresa su correo en un campo de texto y solicita la recuperación.
  2. Si el correo es válido, el sistema envía un email con un token seguro de un solo uso sin exponer errores de enumeración de usuarios.
  3. El enlace entrante redirige a la vista `/reset-password` donde se permite ingresar la nueva contraseña.
  4. Al confirmar la nueva contraseña, la sesión se actualiza y el usuario ingresa automáticamente.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componentes `<ForgotPasswordForm>` en `/forgot-password` y `<ResetPasswordForm>` en `/reset-password`. Captura el token del hash URL y actualiza credenciales vía SDK.
  * **Backend (Node.js):** Endpoint `POST /api/v1/auth/recover-password`. Ejecuta `supabase.auth.resetPasswordForEmail()` configurando la URL de retorno del frontend.
  * **Base de Datos & Storage (Supabase):** Configuración en Supabase Auth > Email Templates para personalizar el correo transaccional en español.
  * **Despliegue / Integración:** Variables en Vercel/Cloud: `FRONTEND_URL` para construir la `redirectTo` en producción.

---

#### HU-05 - Redirección por rol post-login
* **Rol:** Cliente / Profesional / Administrador
* **Épica:** Registro y Autenticación (`EP-AUTH`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** usuario autenticado
  * **Quiero** ser redirigido automáticamente al dashboard correspondiente a mi rol tras iniciar sesión
  * **Para** acceder a mis funciones sin tener que navegar por menús intermedios
* **Criterios de Aceptación:**
  1. Si el rol es `client`, redirigir a `/dashboard/my-tasks`.
  2. Si el rol es `professional` y `is_onboarding_complete = true`, redirigir a `/dashboard/feed`.
  3. Si el rol es `professional` y `is_onboarding_complete = false`, redirigir a `/onboarding`.
  4. Si el rol es `admin`, redirigir al panel de administración `/admin`.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<AuthRedirect>` o lógica dentro del callback de login. Lee `user.role` e `is_onboarding_complete` desde el `<AuthProvider>`.
  * **Backend (Node.js):** La respuesta JSON de `POST /api/v1/auth/login` incluye el objeto de perfil completo para que el cliente evalúe la ruta de forma inmediata.
  * **Base de Datos & Storage (Supabase):** RLS garantiza que la consulta inicial al perfil sea segura y veloz mediante índices en la clave primaria.
  * **Despliegue / Integración:** Configuración de rutas protegidas (`<PrivateRoute>`) en React Router.

---

#### HU-06 - Cierre de sesión
* **Rol:** Cliente / Profesional / Administrador
* **Épica:** Registro y Autenticación (`EP-AUTH`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** usuario autenticado
  * **Quiero** cerrar mi sesión activa
  * **Para** proteger la privacidad de mi cuenta cuando termino de usar la plataforma
* **Criterios de Aceptación:**
  1. El botón de cierre de sesión es visible y accesible desde el menú de usuario en el cabezal de la aplicación.
  2. Al presionar el botón, se revoca la validez del token de sesión en el cliente y backend.
  3. El estado de autenticación de React se borra y el usuario es devuelto a `/login`.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Botón en `<UserMenu>`. Ejecuta `supabase.auth.signOut()`, limpia el state en context y despacha una navegación a la página de ingreso.
  * **Backend (Node.js):** Endpoint REST opcional `POST /api/v1/auth/logout` para limpiar sesiones en el servidor o invalidar caché de usuario.
  * **Base de Datos & Storage (Supabase):** Supabase Auth se encarga de revocar el token de actualización (refresh token) en la tabla `auth.sessions`.
  * **Despliegue / Integración:** N/A.

---

#### HU-07 - Completar perfil profesional
* **Rol:** Profesional
* **Épica:** Onboarding Profesional (`EP-ONBOARD`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Profesional recién registrado
  * **Quiero** completar mi información básica de contacto y experiencia laboral
  * **Para** tener un perfil público visible que genere confianza a los clientes cuando envíe cotizaciones
* **Criterios de Aceptación:**
  1. El formulario muestra el nombre y apellido pre-cargados (editables) e incluye campos obligatorios para el teléfono y una descripción profesional de experiencia.
  2. El teléfono se valida mediante expresiones regulares de formato telefónico en Argentina.
  3. La descripción no puede estar vacía ni superar los 500 caracteres.
  4. Es el Paso 1 del Wizard de Onboarding; al confirmar, los datos se guardan y se avanza al paso siguiente.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<OnboardingProfileStep>` en `/onboarding`. Forma parte de un wizard muti-step con barra de progreso.
  * **Backend (Node.js):** Endpoints `PUT /api/v1/profile` (para el teléfono) y `PUT /api/v1/professional-profile` (para la descripción en `professional_profiles`).
  * **Base de Datos & Storage (Supabase):** Tablas `profiles` y `professional_profiles`. Políticas RLS permiten el UPDATE al propietario (`auth.uid() = id`).
  * **Despliegue / Integración:** N/A.

---

#### HU-08 - Selección de rubros de servicio
* **Rol:** Profesional
* **Épica:** Onboarding Profesional (`EP-ONBOARD`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Profesional en proceso de onboarding
  * **Quiero** seleccionar los rubros técnicos en los que trabajo (Frigorista, Plomero, Electricista)
  * **Para** que la plataforma me muestre en el feed exclusivamente los trabajos asociados a mi especialidad
* **Criterios de Aceptación:**
  1. El sistema presenta la lista completa de rubros habilitados en la plataforma con tarjetas visuales e íconos.
  2. El profesional debe seleccionar al menos un rubro para poder continuar.
  3. Las selecciones se almacenan de forma segura en la tabla intermedia `professional_rubros`.
  4. Es el Paso 2 del Onboarding y permite avanzar a la selección de zonas.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<OnboardingRubrosStep>`. Realiza un fetch a `GET /api/v1/rubros`. Muestra opciones en tarjetas con checkboxes.
  * **Backend (Node.js):** Endpoints `GET /api/v1/rubros` (retorna `rubros`) y `PUT /api/v1/professional-profile/rubros` (ejecuta transacción transaccional borrando e insertando los nuevos `rubro_id`).
  * **Base de Datos & Storage (Supabase):** Tablas `rubros` (campos `id`, `name`, `slug`, `icon_url`) y `professional_rubros` (PK compuesta `professional_id`, `rubro_id`).
  * **Despliegue / Integración:** Scripts SQL de seed para poblar en producción los rubros base: Frigoristas, Plomeros y Electricistas.

---

#### HU-09 - Definición de zonas de cobertura
* **Rol:** Profesional
* **Épica:** Onboarding Profesional (`EP-ONBOARD`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Profesional en proceso de onboarding
  * **Quiero** indicar mis zonas o barrios de cobertura de servicio
  * **Para** recibir solicitudes y tareas ubicadas únicamente donde estoy dispuesto a trabajar
* **Criterios de Aceptación:**
  1. El profesional selecciona uno o más barrios/localidades disponibles mediante un selector múltiple con buscador incorporado.
  2. Debe elegir por lo menos una zona geográfica para finalizar.
  3. Al enviar este Paso 3, el sistema almacena las zonas en `professional_zones`, cambia el campo `is_onboarding_complete = true` del perfil y redirige al Feed.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<OnboardingZonesStep>`. Fetch a `GET /api/v1/zones`. Al confirmar, llama al endpoint final de onboarding y redirige a `/dashboard/feed`.
  * **Backend (Node.js):** Endpoint `PUT /api/v1/professional-profile/zones`. Actualiza la tabla `professional_zones` y ejecuta un update final en `professional_profiles` activando `is_onboarding_complete`.
  * **Base de Datos & Storage (Supabase):** Tabla `zones` (`id`, `name`, `city`, `province`) y tabla `professional_zones` (`professional_id`, `zone_id`).
  * **Despliegue / Integración:** Seeds con la lista base de zonas/barrios para las principales regiones geográficas operadas.

---

#### HU-10 - Visualización del perfil profesional público
* **Rol:** Cliente
* **Épica:** Onboarding Profesional (`EP-ONBOARD`)
* **Prioridad:** Should Have
* **Narrativa:**
  * **Como** Cliente buscando contratistas
  * **Quiero** ver el perfil público del profesional que me cotizó una tarea
  * **Para** evaluar su calificación y experiencia antes de aceptar su propuesta de trabajo
* **Criterios de Aceptación:**
  1. Desde la pantalla de comparación de cotizaciones, el nombre y avatar del profesional son un enlace clickeable hacia `/professionals/:id`.
  2. El perfil público muestra: nombre, descripción, calificación promedio en estrellas, total de opiniones, rubros y zonas operadas.
  3. No se expone información privada del profesional (teléfono, correo) en esta pantalla antes de aceptar la oferta.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<ProfessionalPublicProfile>` en `/professionals/:id`. Renderiza tarjeta pública con indicadores de estrellas.
  * **Backend (Node.js):** Endpoint `GET /api/v1/professionals/:id`. Hace un JOIN seguro entre `profiles`, `professional_profiles`, `rubros` y `zones` sin traer datos privados.
  * **Base de Datos & Storage (Supabase):** Política RLS en `professional_profiles` configurada como pública (`SELECT` abierto a todos los usuarios autenticados).
  * **Despliegue / Integración:** N/A.

---

#### HU-11 - Confirmar ubicación/dirección del servicio
* **Rol:** Cliente
* **Épica:** Publicación de Tarea (`EP-PUBLISH`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente
  * **Quiero** indicar la dirección y zona en la que necesito el servicio
  * **Para** que la tarea esté correctamente referenciada geográficamente en el marketplace
* **Criterios de Aceptación:**
  1. El formulario solicita una dirección en campo de texto (obligatorio), un campo para detalles/piso (opcional) y un selector desplegable de zona/barrio (obligatorio).
  2. La zona seleccionada se valida contra la base de datos de zonas habilitadas.
  3. Es el Paso 1 del Wizard de Publicación y guarda el estado en memoria para el siguiente paso.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<AddressStep>` dentro del stepper `<PublishWizard>`. Ruta `/publish`. Alimenta el estado global temporal del formulario en un React Context.
  * **Backend (Node.js):** Utiliza `GET /api/v1/zones` para popular el selector. Los datos de dirección y zona se reciben en el body del request al publicar (HU-17).
  * **Base de Datos & Storage (Supabase):** Columnas `address`, `address_details` y `zone_id` en la tabla principal `job_requests`.
  * **Despliegue / Integración:** N/A.

---

#### HU-12 - Selección de rubro y tipo de problema
* **Rol:** Cliente
* **Épica:** Publicación de Tarea (`EP-PUBLISH`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente
  * **Quiero** seleccionar el rubro (Frigorista, Plomero, Electricista) y describir brevemente la avería
  * **Para** que la publicación sea catalogada correctamente y notificada a los especialistas correspondientes
* **Criterios de Aceptación:**
  1. El cliente selecciona un único rubro a través de tarjetas con iconos representativos.
  2. Dispone de un área de texto opcional para agregar una descripción general adicional de su problema.
  3. Al elegir el rubro, el sistema carga dinámicamente el cuestionario asociado para el próximo paso.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<RubroStep>` en el wizard. Al seleccionar, ejecuta la carga del esquema de preguntas por API y actualiza `rubro_id` en el contexto.
  * **Backend (Node.js):** Endpoint `GET /api/v1/rubros` reutilizado. El identificador pasa a regir la selección dinámica.
  * **Base de Datos & Storage (Supabase):** Columna `rubro_id UUID FK` y `description TEXT` en la tabla `job_requests`.
  * **Despliegue / Integración:** N/A.

---

#### HU-13 - Cuestionario dinámico por rubro
* **Rol:** Cliente
* **Épica:** Publicación de Tarea (`EP-PUBLISH`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente publicando un trabajo
  * **Quiero** responder a un cuestionario que cambie según el rubro elegido
  * **Para** aportar información técnica precisa y que los profesionales coticen sin incertidumbre
* **Criterios de Aceptación:**
  1. Al entrar en el Paso 3, el sistema muestra preguntas traídas de la base de datos para el rubro seleccionado (ej. Frigoristas: tipo de equipo, frigorías, ubicación en altura; Plomeros: tipo de pérdida, material de cañería).
  2. El renderizador interpreta tipos de pregunta: `text` (input), `select` (dropdown), `multiselect` (checkboxes) y `number`.
  3. Las preguntas con atributo `is_required = true` impiden avanzar en el wizard si se dejan vacías.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<QuestionnaireStep>` y motor de renderizado `<DynamicQuestionField>`. Llama a `GET /api/v1/rubros/:rubroId/questions`.
  * **Backend (Node.js):** Endpoint `GET /api/v1/rubros/:rubroId/questions`. Retorna la lista ordenada por `display_order ASC`.
  * **Base de Datos & Storage (Supabase):** Tabla `questionnaire_questions` (`id`, `rubro_id FK`, `question_text`, `question_type`, `options JSONB`, `display_order`, `is_required`) y tabla relacional `job_request_answers` (`id`, `job_request_id FK`, `question_id FK`, `answer_value TEXT`).
  * **Despliegue / Integración:** Los rubros y preguntas se gestionan desde base de datos / código (según decisión §4.1).

---

#### HU-14 - Selección de fecha deseada y franja horaria
* **Rol:** Cliente
* **Épica:** Publicación de Tarea (`EP-PUBLISH`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente
  * **Quiero** indicar mi preferencia de fecha y franja horaria (mañana, tarde, noche) para recibir la visita
  * **Para** que los profesionales conozcan mi disponibilidad al armar sus propuestas
* **Criterios de Aceptación:**
  1. El usuario selecciona una fecha con un calendario emergente (Date Picker); el sistema desactiva el día en curso y todas las fechas pasadas.
  2. Selecciona una opción de franja horaria: Mañana (08-12 hs), Tarde (12-18 hs) o Noche (18-21 hs).
  3. Estos campos de preferencia son orientativos y no bloquean propuestas alternativas del profesional.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<ScheduleStep>`. Utiliza un selector de fechas de React compatible con accesibilidad e integra botones para las 3 franjas.
  * **Backend (Node.js):** Acepta los parámetros `preferred_date` (formato YYYY-MM-DD) y `preferred_time_slot` (enum string).
  * **Base de Datos & Storage (Supabase):** Tipo ENUM `time_slot ('morning', 'afternoon', 'evening')`. Columnas `preferred_date DATE` y `preferred_time_slot time_slot` en `job_requests`.
  * **Despliegue / Integración:** N/A.

---

#### HU-15 - Carga de fotos del problema
* **Rol:** Cliente
* **Épica:** Publicación de Tarea (`EP-PUBLISH`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente
  * **Quiero** subir fotografías de mi equipo o instalación dañada
  * **Para** ilustrar el problema y que los especialistas efectúen un diagnóstico visual previo
* **Criterios de Aceptación:**
  1. El cliente puede adjuntar de 0 a 5 fotos mediante una zona de arrastrar y soltar (Drag and Drop) o botón explorador.
  2. El sistema acepta únicamente extensiones JPG, PNG y WEBP y valida un tamaño máximo de 5MB por archivo.
  3. Se muestran miniaturas (thumbnails) de las imágenes adjuntas con un botón de borrado rápido.
  4. Las fotos se almacenan de forma segura en un bucket privado de Supabase Storage.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<PhotoUploadStep>`. Sube directamente al Storage de Supabase usando el cliente anónimo autenticado a la carpeta `job-photos/{user_id}/temp/`.
  * **Backend (Node.js):** Al crearse la tarea en HU-17, el backend asocia formalmente el path del archivo a la tabla relacional de imágenes y confirma su persistencia.
  * **Base de Datos & Storage (Supabase):** Bucket `job-photos` configurado con políticas RLS (solo suben propietarios autenticados). Tabla `job_photos` (`id UUID PK`, `job_request_id UUID FK`, `storage_path TEXT`, `file_name TEXT`, `file_size INTEGER`, `mime_type TEXT`).
  * **Despliegue / Integración:** Configuración CORS de Storage para subidas en paralelo y firmado temporal de URLs para visualización en el feed.

---

#### HU-16 - Pantalla de resumen y confirmación de tarea
* **Rol:** Cliente
* **Épica:** Publicación de Tarea (`EP-PUBLISH`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente
  * **Quiero** ver un resumen ordenado de todos los datos introducidos
  * **Para** revisar mis selecciones y respuestas al cuestionario antes de publicarlas de forma definitiva
* **Criterios de Aceptación:**
  1. El Paso 6 del Wizard expone en tarjetas separadas: Dirección/Zona, Rubro, Respuestas del Cuestionario, Fotos y Preferencia horaria.
  2. Cada sección del resumen posee un ícono o enlace de "Editar" que regresa al paso respectivo del wizard sin perder la memoria del formulario.
  3. Muestra un botón de confirmación final rotulado *"Publicar tarea"*.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<SummaryStep>`. Lee del contexto `<PublishWizardContext>` y renderiza secciones limpias usando componentes presentacionales de Tailwind.
  * **Backend (Node.js):** No requiere invocación REST independiente.
  * **Base de Datos & Storage (Supabase):** N/A.
  * **Despliegue / Integración:** N/A.

---

#### HU-17 - Publicar tarea
* **Rol:** Cliente
* **Épica:** Publicación de Tarea (`EP-PUBLISH`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente
  * **Quiero** presionar el botón "Publicar tarea" para confirmar mi pedido
  * **Para** que mi solicitud ingrese formalmente al marketplace y sea visible por profesionales de mi zona
* **Criterios de Aceptación:**
  1. Al presionar "Publicar tarea", el sistema envía toda la estructura del wizard al backend en una transacción atómica.
  2. Se crea un registro en `job_requests` con estado inicial `PUBLISHED`.
  3. Se almacenan todas las respuestas al cuestionario y se enlazan las fotos subidas previamente.
  4. Se muestra un mensaje de confirmación festivo y se redirige a `/dashboard/my-tasks`.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Acción en `<SummaryStep>`. Invoca `POST /api/v1/job-requests` pasándole el objeto completo (incluyendo array de rutas de fotos en Storage y array de respuestas).
  * **Backend (Node.js):** Endpoint `POST /api/v1/job-requests`. Controlador `jobRequestController.create()`. Ejecuta una transacción (o query batch en Supabase): insert en `job_requests`, insert en `job_request_answers` e insert en `job_photos`.
  * **Base de Datos & Storage (Supabase):** RLS en `job_requests` valida `auth.uid() = client_id`. Estado `status` de base: `'PUBLISHED'`.
  * **Despliegue / Integración:** Configuración de rate limiting en Node.js para prevenir spam en la creación de publicaciones.

---

#### HU-18 - Ver mis tareas publicadas
* **Rol:** Cliente
* **Épica:** Publicación de Tarea (`EP-PUBLISH`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente
  * **Quiero** ver una lista de mis tareas publicadas con su estado y el número de ofertas recibidas
  * **Para** dar seguimiento a mis pedidos y acceder a ver las cotizaciones
* **Criterios de Aceptación:**
  1. Muestra tarjetas con: Rubro, Zona, Fecha, Estado con color (PUBLISHED, HAS_OFFERS, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED) y un badge numérico de ofertas pendientes.
  2. El cliente puede hacer clic en cualquier tarjeta para ingresar a la vista detallada.
  3. Muestra filtros por estado de pedido y opción de ordenar por fecha más reciente.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<MyTasksList>` en `/dashboard/my-tasks`. Realiza fetch a `GET /api/v1/job-requests`.
  * **Backend (Node.js):** Endpoint `GET /api/v1/job-requests`. Realiza una consulta SQL que hace un LEFT JOIN para contar propuestas asociadas (`COUNT(proposals.id)`) para cada registro.
  * **Base de Datos & Storage (Supabase):** RLS asegura filtrar por `client_id = auth.uid()`. Índice en la columna `client_id` para garantizar rendimiento.
  * **Despliegue / Integración:** N/A.

---

#### HU-19 - Editar tarea publicada (antes de ofertas)
* **Rol:** Cliente
* **Épica:** Publicación de Tarea (`EP-PUBLISH`)
* **Prioridad:** Should Have
* **Narrativa:**
  * **Como** Cliente
  * **Quiero** modificar los detalles de una tarea que publiqué siempre que no tenga cotizaciones
  * **Para** corregir errores en mi dirección o cuestionario de forma rápida
* **Criterios de Aceptación:**
  1. La interfaz sólo muestra el botón "Editar" en tareas con estado `PUBLISHED`.
  2. Si la tarea entra en estado `HAS_OFFERS`, la edición se bloquea y se advierte al usuario.
  3. Al guardar los cambios, la base de datos se actualiza sin modificar la fecha original de publicación.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Reutiliza el wizard de publicación pre-poblando datos. Llama a `PUT /api/v1/job-requests/:id`.
  * **Backend (Node.js):** Endpoint `PUT /api/v1/job-requests/:id`. Verifica rígidamente en SQL que `status = 'PUBLISHED'`; de lo contrario, responde un HTTP 403 Forbidden.
  * **Base de Datos & Storage (Supabase):** Política SQL adicional o comprobación en servicio REST protegiendo la inmutabilidad si el estado cambió.
  * **Despliegue / Integración:** N/A.

---

#### HU-20 - Cancelar tarea publicada
* **Rol:** Cliente
* **Épica:** Publicación de Tarea (`EP-PUBLISH`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente
  * **Quiero** cancelar mi tarea en cualquier momento del ciclo inicial
  * **Para** retirarla del mercado si solucioné mi problema por mis propios medios
* **Criterios de Aceptación:**
  1. En el detalle de la tarea, hay un botón secundario para "Cancelar tarea" (disponible en los estados `PUBLISHED`, `HAS_OFFERS`, `ACCEPTED`, e `IN_PROGRESS` en MVP, ver §3.3).
  2. Requiere confirmación en un diálogo emergente.
  3. Al cancelar, el estado del registro cambia a `CANCELLED`, se rechazan en cascada todas las propuestas asociadas y se envía notificación in-app a los afectados.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Botón en `<TaskDetailView>`. Gatilla modal `<ConfirmCancelDialog>` e invoca `PATCH /api/v1/job-requests/:id/cancel`.
  * **Backend (Node.js):** Endpoint `PATCH /api/v1/job-requests/:id/cancel`. Transacción que actualiza `status = 'CANCELLED'`, marca propuestas pendientes en estado `rejected` e inserta notificaciones.
  * **Base de Datos & Storage (Supabase):** Campo `cancelled_by UUID FK` que registra quién canceló, y enum de estado `'CANCELLED'`.
  * **Despliegue / Integración:** N/A.

---

#### HU-21 - Feed de tareas abiertas
* **Rol:** Profesional
* **Épica:** Exploración de Trabajos (`EP-FEED`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Profesional
  * **Quiero** ver un feed con todas las tareas en estado PUBLISHED o HAS_OFFERS correspondientes a mis rubros y zonas
  * **Para** encontrar oportunidades de trabajo relevantes para mí
* **Criterios de Aceptación:**
  1. El feed muestra únicamente publicaciones de clientes con `status IN ('PUBLISHED', 'HAS_OFFERS')`.
  2. Filtra de forma estricta los ítems cruzando la tabla intermedia de rubros y zonas operadas por el usuario autenticado.
  3. Cada tarjeta indica: Rubro, Zona, Fecha, Franja horaria preferida, Número total de cotizaciones actuales y si la publicación ya recibió una propuesta propia.
  4. Ordena los trabajos por fecha de creación descendente (más nuevos arriba).
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<FeedView>` en `/dashboard/feed`. Presenta tarjetas `<JobFeedCard>` responsive con scroll infinito o paginación numerada.
  * **Backend (Node.js):** Endpoint `GET /api/v1/job-requests/feed`. Consulta con JOINs entre `job_requests`, `professional_rubros` y `professional_zones`, e incluye subqueries que cuentan propuestas.
  * **Base de Datos & Storage (Supabase):** RLS en `job_requests` habilitando lectura condicional del rol `professional` sobre los estados abiertos. Índices en `(rubro_id, zone_id, status)`.
  * **Despliegue / Integración:** N/A.

---

#### HU-22 - Filtros del feed por zona y rubro
* **Rol:** Profesional
* **Épica:** Exploración de Trabajos (`EP-FEED`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Profesional
  * **Quiero** filtrar dinámicamente el feed por rubro o zona en particular
  * **Para** ver únicamente un subconjunto específico dentro de mis configuraciones de perfil
* **Criterios de Aceptación:**
  1. Barra superior con selectores para filtrar por zona específica o rubro específico.
  2. Al modificar un selector, la lista del feed se actualiza por API sin recargar toda la página.
  3. Botón para "Limpiar filtros" y regresar al feed total.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<FeedFiltersBar>`. Al cambiar una selección, dispara el re-fetch pasando parámetros `?rubro_id=UUID&zone_id=UUID`.
  * **Backend (Node.js):** El endpoint `GET /api/v1/job-requests/feed` procesa querystrings opcionales para acotar el WHERE de la consulta SQL.
  * **Base de Datos & Storage (Supabase):** N/A.
  * **Despliegue / Integración:** N/A.

---

#### HU-23 - Vista detallada de tarea
* **Rol:** Profesional
* **Épica:** Exploración de Trabajos (`EP-FEED`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Profesional
  * **Quiero** ingresar al detalle de una tarea publicada en el feed
  * **Para** leer todas las respuestas al cuestionario, ver las fotos y evaluar el costo a cotizar
* **Criterios de Aceptación:**
  1. Al presionar una tarjeta, se carga la vista de detalle indicando toda la información del cuestionario dinámico.
  2. Expone una galería expandible con las fotos del problema (HU-24).
  3. Muestra la dirección aproximada (Barrio/Zona) resguardando la dirección callejera exacta por privacidad hasta concretar la aceptación.
  4. Muestra de forma destacada el botón *"Enviar cotización"*.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<JobRequestDetailView>` en la ruta `/tasks/:id`. Llama a `GET /api/v1/job-requests/:id`.
  * **Backend (Node.js):** Endpoint `GET /api/v1/job-requests/:id`. Verifica autenticación del profesional y devuelve un payload combinado con preguntas, respuestas e imágenes.
  * **Base de Datos & Storage (Supabase):** URLs firmadas para las imágenes recuperadas de `job_photos`.
  * **Despliegue / Integración:** N/A.

---

#### HU-24 - Galería de fotos de la tarea
* **Rol:** Profesional
* **Épica:** Exploración de Trabajos (`EP-FEED`)
* **Prioridad:** Should Have
* **Narrativa:**
  * **Como** Profesional evaluando un trabajo
  * **Quiero** abrir las fotos adjuntas por el cliente en un visor modal en pantalla completa
  * **Para** examinar la instalación en alta calidad sin perder resolución
* **Criterios de Aceptación:**
  1. En el detalle, las imágenes se presentan en una grilla de miniaturas.
  2. Al hacer clic en una miniatura, se abre un lightbox en pantalla completa con controles para hacer zoom y pasar a la siguiente foto.
  3. Permite cerrar con un botón visible o la tecla Esc.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente de galería `<PhotoGalleryLightbox>` utilizando librerías ligeras de visor o modales personalizados de React.
  * **Backend (Node.js):** Las URLs firmadas de lectura expiran transcurridos 60 minutos (seguridad configurada en Storage).
  * **Base de Datos & Storage (Supabase):** Supabase Storage en el bucket `job-photos`.
  * **Despliegue / Integración:** CDN caching habilitada para los assets estáticos de Storage.

---

#### HU-25 - Enviar cotización/propuesta
* **Rol:** Profesional
* **Épica:** Cotización y Propuestas (`EP-QUOTE`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Profesional
  * **Quiero** enviar una propuesta formal cotizando un trabajo publicado
  * **Para** que el cliente evalúe mis precios y fechas propuestas
* **Criterios de Aceptación:**
  1. El formulario requiere: Monto del Presupuesto Total ($) y Monto de la Seña propuesta ($), ambos mayores a 0, debiendo ser la seña menor o igual al presupuesto total.
  2. Solicita indicar Fecha propuesta (calendario, debe ser mayor o igual al día actual) y Hora propuesta para el turno.
  3. Campo opcional para Nota de la Cotización (máx. 300 caracteres).
  4. Al confirmar, el sistema inserta la propuesta en `proposals`, cambia la tarea del cliente a `HAS_OFFERS` y gatilla una notificación in-app (HU-50).
  5. Un mismo profesional solo puede enviar 1 cotización activa por publicación.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<ProposalFormModal>`. Valida montos de seña en el cliente antes de llamar al endpoint.
  * **Backend (Node.js):** Endpoint `POST /api/v1/job-requests/:jobId/proposals`. Valida que el pedido esté abierto (`PUBLISHED`/`HAS_OFFERS`), que la seña sea lógica y que el usuario sea profesional.
  * **Base de Datos & Storage (Supabase):** Tabla `proposals` (`id`, `job_request_id FK`, `professional_id FK`, `total_price NUMERIC(12,2)`, `deposit_amount NUMERIC(12,2)`, `proposed_date DATE`, `proposed_time TIME`, `notes TEXT`, `status proposal_status DEFAULT 'pending'`). Restricción `UNIQUE(job_request_id, professional_id)`.
  * **Despliegue / Integración:** N/A.

---

#### HU-26 - Proponer fecha/hora respetando preferencias
* **Rol:** Profesional
* **Épica:** Cotización y Propuestas (`EP-QUOTE`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Profesional enviando una oferta
  * **Quiero** ver las preferencias horarias indicadas por el cliente para proponer mi fecha de visita
  * **Para** sugerir mi disponibilidad más cercana adaptándome a lo que el cliente pidió
* **Criterios de Aceptación:**
  1. En el encabezado del formulario de cotización, se exponen visualmente la Fecha Deseada y la Franja Horaria preferida del cliente.
  2. Los selectores de fecha y hora del profesional vienen pre-cargados orientativamente según esa preferencia, permitiendo ser modificados si el profesional no tiene disponibilidad exacta.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Lógica dentro de `<ProposalFormModal>` leyendo los atributos del job_request cargado.
  * **Backend (Node.js):** Validación para evitar que el profesional envíe una fecha de visita en el pasado (`proposed_date >= CURRENT_DATE`).
  * **Base de Datos & Storage (Supabase):** Campos en tabla `proposals`: `proposed_date DATE NOT NULL`, `proposed_time TIME NOT NULL`.
  * **Despliegue / Integración:** N/A.

---

#### HU-27 - Ver mis cotizaciones enviadas
* **Rol:** Profesional
* **Épica:** Cotización y Propuestas (`EP-QUOTE`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Profesional
  * **Quiero** acceder a un listado que agrupe mis cotizaciones enviadas
  * **Para** hacer seguimiento de mis propuestas y saber su estado actual
* **Criterios de Aceptación:**
  1. El listado muestra tarjetas para cada propuesta enviada con el rubro del pedido, zona, monto total ofertado y estado de la cotización (`pending`, `accepted`, `rejected` o `withdrawn`).
  2. Ordena las cotizaciones desde la última generada.
  3. Permite filtrar para ver rápidamente solamente las propuestas en estado "Pendiente" (`pending`).
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<MyProposalsList>` en `/dashboard/my-proposals`. Fetch a `GET /api/v1/proposals/mine`.
  * **Backend (Node.js):** Endpoint `GET /api/v1/proposals/mine`. Realiza un JOIN desde `proposals` con `job_requests`, `rubros` y `zones` filtrando por `professional_id`.
  * **Base de Datos & Storage (Supabase):** RLS restringe lectura: `professional_id = auth.uid()`.
  * **Despliegue / Integración:** N/A.

---

#### HU-28 - Retirar/cancelar cotización enviada
* **Rol:** Profesional
* **Épica:** Cotización y Propuestas (`EP-QUOTE`)
* **Prioridad:** Should Have
* **Narrativa:**
  * **Como** Profesional
  * **Quiero** retirar una propuesta que envié si la tarea todavía no fue aceptada
  * **Para** liberar mi agenda si me surgió un contratiempo antes de que el cliente decida
* **Criterios de Aceptación:**
  1. Botón "Retirar oferta" visible únicamente cuando el estado en la tabla es `pending` y el pedido está en `HAS_OFFERS`.
  2. Requiere confirmación modal en la interfaz web.
  3. Al retirarse, la propuesta pasa al estado `withdrawn`. Si era la única propuesta para esa publicación, la tarea del cliente retrocede automáticamente a estado `PUBLISHED`.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Botón de borrado/retiro en `<ProposalCard>`. Invoca `PATCH /api/v1/proposals/:id/withdraw`.
  * **Backend (Node.js):** Endpoint `PATCH /api/v1/proposals/:id/withdraw`. Transacción que actualiza `status = 'withdrawn'` y recalcula los contadores para ajustar el estado de `job_requests`.
  * **Base de Datos & Storage (Supabase):** Enum de estado `proposal_status ('pending', 'accepted', 'rejected', 'withdrawn')`.
  * **Despliegue / Integración:** N/A.

---

#### HU-29 - Ver cotizaciones recibidas para una tarea
* **Rol:** Cliente
* **Épica:** Comparación y Aceptación (`EP-ACCEPT`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente
  * **Quiero** ver la lista completa de propuestas de los profesionales sobre una de mis tareas
  * **Para** evaluar y decidir cuál es la más conveniente
* **Criterios de Aceptación:**
  1. En la vista de mi tarea (`/tasks/:id`), una pestaña muestra las cotizaciones activas en estado `pending`.
  2. Cada ítem presenta: Nombre del profesional, Calificación (Estrellas / Reseñas), Precio total ($), Monto de seña ($), Fecha/hora propuesta y su nota descriptiva.
  3. Habilita los botones directos para "Ver Perfil Profesional" y "Aceptar Propuesta".
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<ProposalsListSection>` renderizado en el detalle de pedido para el autor de la tarea.
  * **Backend (Node.js):** Endpoint `GET /api/v1/job-requests/:jobId/proposals`. Filtra mediante JOINs para cruzar la reputación de los especialistas desde `professional_profiles`.
  * **Base de Datos & Storage (Supabase):** RLS garantiza que el cliente únicamente vea propuestas que pertenezcan a publicaciones que él mismo creó.
  * **Despliegue / Integración:** N/A.

---

#### HU-30 - Comparar cotizaciones lado a lado
* **Rol:** Cliente
* **Épica:** Comparación y Aceptación (`EP-ACCEPT`)
* **Prioridad:** Should Have
* **Narrativa:**
  * **Como** Cliente con varias propuestas
  * **Quiero** ver dos o tres cotizaciones seleccionadas en un cuadro comparativo horizontal
  * **Para** confrontar diferencias económicas de presupuesto y tiempo de disponibilidad con facilidad
* **Criterios de Aceptación:**
  1. Casillas de selección en la lista general para marcar hasta 3 cotizaciones.
  2. Botón "Comparar seleccionadas" abre una tabla o modal en columnas que contrapone: Profesional, Reputación, Precio Presupuestado, Monto de Seña y Día Propuesto.
  3. El sistema destaca en color verde la celda del presupuesto total más económico dentro del grupo evaluado.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente modal `<CompareProposalsTable>`. Procesa la matriz de datos en la memoria local del navegador.
  * **Backend (Node.js):** N/A (usa los datos en el store de frontend obtenidos por HU-29).
  * **Base de Datos & Storage (Supabase):** N/A.
  * **Despliegue / Integración:** N/A.

---

#### HU-31 - Aceptar una cotización
* **Rol:** Cliente
* **Épica:** Comparación y Aceptación (`EP-ACCEPT`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente
  * **Quiero** aceptar una de las cotizaciones recibidas
  * **Para** confirmar inmediatamente el turno con el profesional y seleccionar mi medio de pago preferido
* **Criterios de Aceptación:**
  1. Al presionar "Aceptar", se solicita confirmación simple exponiendo: el monto de la seña a pagar, la fecha/hora propuesta y el profesional seleccionado.
  2. Al confirmar, el sistema ejecuta una **transacción atómica** que: (a) crea un registro en `appointments` con estado `CONFIRMED`, (b) crea un registro en `payments` con estado `PENDING`, (c) cambia `job_requests.status` a `ACCEPTED`, (d) marca la propuesta como `accepted` y rechaza las demás (HU-32).
  3. La UI renderiza la confirmación del turno y ofrece la **selección de medio de pago**: Efectivo vs. Mercado Pago.
  4. Si el cliente elige Mercado Pago, se genera la preferencia de Checkout Pro y se redirige a la pasarela.
  5. Si el cliente elige Efectivo, el pago permanece en `PENDING` hasta que el Profesional confirme manualmente el cobro.
  6. El turno queda visible inmediatamente en "Mi Agenda" de ambas partes, **sin depender del resultado del pago**.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Acción principal de `<ProposalCard>`. Llama al endpoint `POST /api/v1/offers/:id/accept`. La respuesta contiene los objetos `appointment` y `payment`. La UI renderiza la confirmación del turno (`CONFIRMED`) y presenta un selector de medio de pago (Efectivo / Mercado Pago). Si elige MP, redirige con `window.location.href = response.init_point`. La pantalla del turno y el detalle en "Mi Agenda" renderizan de forma independiente la insignia de estado del Turno (`CONFIRMED`) y la insignia de estado del Pago (`PENDING` / `PAID`).
  * **Backend (Node.js):** Endpoint `POST /api/v1/offers/:id/accept`. Ejecuta una transacción que crea el registro en `appointments` (`status = 'CONFIRMED'`) y en `payments` (`status = 'PENDING'`), actualiza `job_requests.status = 'ACCEPTED'`, marca la propuesta como `accepted`, rechaza las demás y dispara notificaciones. Devuelve ambos objetos (`appointment` + `payment`). Si `payment_method = 'MERCADOPAGO'`, genera además la preferencia de Checkout Pro.
  * **Base de Datos & Storage (Supabase):** La transacción inserta en `appointments` y `payments` de forma atómica. `payments` incluye FK `appointment_id` vinculando al turno recién creado. `job_requests.status` pasa a `ACCEPTED` inmediatamente (no depende del webhook).
  * **Despliegue / Integración:** Variables con tokens productivos de Mercado Pago: `MP_ACCESS_TOKEN`. Configuración de `back_urls` apuntando a las rutas del frontend.

---

#### HU-32 - Rechazo automático de cotizaciones pendientes
* **Rol:** Sistema
* **Épica:** Comparación y Aceptación (`EP-ACCEPT`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Sistema de Argendar
  * **Quiero** rechazar las demás cotizaciones en cuanto el Cliente acepta una de ellas
  * **Para** notificar a los especialistas descartados y limpiar el estado del marketplace
* **Criterios de Aceptación:**
  1. Al ejecutarse la transacción de aceptación de oferta (HU-31), el sistema selecciona todas las cotizaciones con estado `pending` en ese `job_request_id` que no sean la aceptada.
  2. Transforma masivamente su estado a `status = 'rejected'` dentro de la misma transacción atómica.
  3. Dispara un mensaje de notificación in-app individual para cada uno de los especialistas informando del cierre del pedido (HU-52).
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** N/A (procedimiento puramente de Backend).
  * **Backend (Node.js):** Lógica encapsulada dentro de la transacción del endpoint `POST /api/v1/offers/:id/accept` (HU-31). Se ejecuta al momento de la aceptación, no al confirmarse el pago.
  * **Base de Datos & Storage (Supabase):** Update en lote sobre `proposals` utilizando `WHERE job_request_id = :id AND id != :accepted_id AND status = 'pending'`.
  * **Despliegue / Integración:** N/A.

---

#### HU-33 - Cobro de seña al aceptar cotización
* **Rol:** Cliente
* **Épica:** Pagos — Mercado Pago (`EP-PAY`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente
  * **Quiero** pagar la seña de la cotización aceptada a través de Mercado Pago o en efectivo
  * **Para** cumplir con la obligación de pago asociada al turno ya confirmado
* **Criterios de Aceptación:**
  1. El registro de pago (`payments`) ya existe en estado `PENDING` desde el momento de la aceptación de la oferta (HU-31). El turno ya se encuentra en estado `CONFIRMED` independientemente del pago.
  2. Si el medio de pago seleccionado es Mercado Pago: la preferencia debe tener como ítem el título *"Seña - [Rubro] - Tarea Argendar"*, y el precio unitario (`unit_price`) equivalente a `deposit_amount` de la cotización. Debe configurar `external_reference = payments.id`.
  3. Si el medio de pago seleccionado es Efectivo (`payment_method = 'CASH'`): el pago permanece en `PENDING` hasta la confirmación manual del Profesional (HU-72, CA-8).
  4. La redirección de retorno (`back_urls`) de MP debe incluir direcciones válidas en el frontend para `success`, `pending` y `failure`.
  5. La confirmación del pago en cualquier modalidad actualiza `payments.status` a `PAID` **sin alterar** el estado `CONFIRMED` del turno.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Si `payment_method = 'MERCADOPAGO'`, la UI redirige al link `init_point` generado por el backend. Si `payment_method = 'CASH'`, la UI muestra el estado del pago como `PENDING` con indicación de que el profesional confirmará al recibir el dinero.
  * **Backend (Node.js):** Para pagos MP: uso del SDK oficial de Node.js de Mercado Pago: `const preference = new Preference(client); preference.create({ body: { items: [...], back_urls: {...}, notification_url: MP_WEBHOOK_URL, external_reference: paymentId } })`. Para pagos en efectivo: endpoint `PATCH /api/v1/payments/:id/confirm-cash` (restringido al `professional_id` asignado).
  * **Base de Datos & Storage (Supabase):** Tabla `payments` (columnas: `id UUID PK`, `appointment_id UUID FK`, `job_request_id UUID FK`, `proposal_id UUID FK`, `client_id UUID FK`, `professional_id UUID FK`, `type payment_type ('deposit', 'balance')`, `payment_method payment_method_type ('MERCADOPAGO', 'CASH')`, `mp_preference_id TEXT NULL`, `amount NUMERIC(12,2)`, `status payment_status ('PENDING', 'PROCESSING', 'PAID', 'REJECTED', 'CANCELLED', 'REFUNDED') DEFAULT 'PENDING'`, `retry_deadline TIMESTAMPTZ NULL`). Políticas RLS: lectura permitida únicamente para `client_id` y `professional_id` asociados. Actualización de `status` a `PAID` en efectivo restringida al `professional_id`.
  * **Despliegue / Integración:** Configuración estricta en el servidor para construir y exponer una URL HTTPS accesible para `MP_WEBHOOK_URL`.

---

#### HU-34 - Procesamiento de webhook de pago (seña)
* **Rol:** Sistema
* **Épica:** Pagos — Mercado Pago (`EP-PAY`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Sistema de Backend
  * **Quiero** recibir e interpretar notificaciones asincrónicas de Mercado Pago
  * **Para** confirmar el éxito del cobro de la seña y actualizar únicamente el registro de pago a `PAID`
* **Criterios de Aceptación:**
  1. El endpoint del webhook de Mercado Pago verifica firmas criptográficas de seguridad para impedir pedidos fraudulentos.
  2. Al recibir y consultar en la API que una seña de un `external_reference` cuenta con `status = 'approved'`, el sistema actualiza **únicamente** el registro en `payments` a `status = 'PAID'`. **No modifica** el estado del turno (`appointments.status` permanece en `CONFIRMED`) ni el estado del pedido (`job_requests.status` permanece en `ACCEPTED`), ya que ambos fueron establecidos al momento de la aceptación (HU-31).
  3. Si la transacción llega con `status = 'rejected'`, el sistema actualiza `payments.status` a `REJECTED` e inicia el plazo de reintento para el cliente (HU-35). El turno se mantiene en `CONFIRMED`.
  4. Dispara notificaciones in-app de confirmación de pago a Cliente y Profesional (HU-53).
  5. Todas las transacciones y cambios de estado generan registros de auditoría.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** N/A (sin intervención del cliente web en este momento).
  * **Backend (Node.js):** Endpoint `POST /api/v1/payments/webhook/mercadopago`. Controlador `webhookController.handleMP()`. Utiliza variables del encabezado (`x-signature`) y valida en el servidor con la clave secreta de MP (`MP_WEBHOOK_SECRET`). Utiliza el SDK de Node para consultar `payment.get({ id })` de Mercado Pago por seguridad e idempotencia. La lógica se simplifica: solo actualiza `payments` y dispara notificaciones.
  * **Base de Datos & Storage (Supabase):** Actualiza únicamente la tabla `payments`. No ejecuta cambios en `appointments`, `proposals` ni `job_requests` (ya actualizados en HU-31).
  * **Despliegue / Integración:** El servidor expone HTTPS con certificado en producción. Se registra la ruta completa del endpoint dentro del panel de desarrolladores de Mercado Pago para eventos `payment`.

---

#### HU-35 - Pago fallido y plazo de reintento
* **Rol:** Cliente
* **Épica:** Pagos — Mercado Pago (`EP-PAY`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente que tuvo problemas con su tarjeta
  * **Quiero** tener una ventana de horas para intentar pagar mi seña rechazada
  * **Para** no perder la oferta del profesional por un fallo transitorio de la pasarela
* **Criterios de Aceptación:**
  1. Tras recibir un aviso `rejected` de Mercado Pago, la plataforma otorga al cliente una ventana de reintento configurada por variable de entorno (ej. 24 horas).
  2. En el cabezal de su tarea, se despliega una barra de aviso e informa las horas restantes para cancelar la seña.
  3. Dispone de un botón "Reintentar pago" que emite una nueva preferencia de pago sobre la misma cotización aceptada.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Aviso dentro de `<TaskDetailView>`. Se activa si `payment.status === 'rejected'` y `retry_deadline > new Date()`.
  * **Backend (Node.js):** Endpoint REST `POST /api/v1/payments/:id/retry`. Regenera la preferencia en Mercado Pago Checkout Pro modificando el `mp_preference_id`.
  * **Base de Datos & Storage (Supabase):** Columna `retry_deadline TIMESTAMPTZ` en `payments` populada al iniciarse la primera preferencia de pago sumando las horas configuradas.
  * **Despliegue / Integración:** Variable `.env`: `PAYMENT_RETRY_HOURS=24`.

---

#### HU-36 - Expiración de plazo de reintento
* **Rol:** Sistema
* **Épica:** Pagos — Mercado Pago (`EP-PAY`)
* **Prioridad:** Should Have
* **Narrativa:**
  * **Como** Sistema de supervisión de pagos
  * **Quiero** revocar cotizaciones aceptadas cuyo plazo de reintento expiró sin aprobarse el pago
  * **Para** destrabar pedidos abandonados y reabrir la tarea en el marketplace
* **Criterios de Aceptación:**
  1. Un proceso automatizado escanea en base de datos las órdenes de pago de señas no aprobadas cuya fecha límite en `retry_deadline` es anterior al momento de inspección.
  2. Para las coincidencias, el sistema re-establece `proposals.status = 'pending'`, reabre `job_requests.status = 'HAS_OFFERS'` y anula el intento vencido en `payments`.
  3. Se notifica la caducidad al cliente y profesional implicados mediante alerta in-app.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** N/A.
  * **Backend (Node.js):** Tarea programada o cron (`node-cron`) en el backend corriendo cada 1 hora. Ejecuta query de actualización e invoca servicio de notificaciones.
  * **Base de Datos & Storage (Supabase):** Alternativa sin servidor web: Extensión `pg_cron` o función programada en Supabase que ejecute la stored procedure SQL de expiración.
  * **Despliegue / Integración:** Configurar variables en el runtime o panel de control (ej. Railway Cron o Vercel Cron).

---

#### HU-37 - Cobro de saldo restante al completar servicio
* **Rol:** Cliente
* **Épica:** Pagos — Mercado Pago (`EP-PAY`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente de un servicio concluido
  * **Quiero** pagar la diferencia del saldo restante de mi trabajo a través de Mercado Pago
  * **Para** abonar en su totalidad la tarea técnica que me realizaron
* **Criterios de Aceptación:**
  1. Al presionar "Confirmar completado" en un turno en progreso (HU-45), se inicia el cobro por saldo siempre que el monto del saldo (`total_price - deposit_amount`) sea mayor a $0.
  2. El sistema calcula la diferencia y emite en Mercado Pago una segunda preferencia de Checkout Pro para la misma cotización con la leyenda: *"Saldo Restante - [Rubro] - Argendar"*.
  3. Se crea en la base de datos un nuevo pago en `payments` identificado como de tipo `type = 'balance'`.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Modal emergente de confirmación de servicio en `<AppointmentDetailView>`. Redirige al checkout de saldo.
  * **Backend (Node.js):** Endpoint REST de confirmación `PATCH /api/v1/appointments/:id/complete`. Si hay importe remanente, invoca al controlador del SDK para armar la preferencia por la diferencia.
  * **Base de Datos & Storage (Supabase):** Se registra una nueva fila sobre `payments` (`type = 'balance'`) apuntando al mismo `job_request_id` y `proposal_id`.
  * **Despliegue / Integración:** N/A.

---

#### HU-38 - Procesamiento de webhook de pago (saldo)
* **Rol:** Sistema
* **Épica:** Pagos — Mercado Pago (`EP-PAY`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Sistema del Marketplace
  * **Quiero** procesar la respuesta del webhook para el cobro del saldo remanente
  * **Para** marcar el pago en la cuenta oficial y notificar la cancelación final de la deuda al profesional
* **Criterios de Aceptación:**
  1. El webhook en el endpoint de Mercado Pago verifica y detecta que el `external_reference` analizado corresponde a una entidad en `payments` marcada como `type = 'balance'`.
  2. Si su confirmación en la API figura `approved`, actualiza **únicamente** `payments.status` a `PAID`, sin modificar el turno (que ya se encuentra en `COMPLETED`).
  3. Dispara una notificación final in-app de confirmación al cliente y al profesional confirmando el cierre económico del servicio.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** N/A.
  * **Backend (Node.js):** Reutiliza y amplía la lógica del controlador `webhookController.handleMP()` evaluando el valor en la columna `type` del registro entrante. Solo actualiza `payments`, no modifica `appointments`.
  * **Base de Datos & Storage (Supabase):** Actualiza únicamente `payments.status = 'PAID'` mediante el service role key.
  * **Despliegue / Integración:** N/A.

---

#### HU-39 - Pantalla de resultado de pago
* **Rol:** Cliente
* **Épica:** Pagos — Mercado Pago (`EP-PAY`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente que regresa de Mercado Pago
  * **Quiero** ver de forma inmediata una pantalla que confirme el estado de mi transacción
  * **Para** saber sin demora si mi seña o pago de saldo se procesó de manera adecuada
* **Criterios de Aceptación:**
  1. Si la ruta de retorno es `/payment/success`, muestra indicador de éxito festivo, detalles de la cotización y un botón *"Ir a Mi Agenda"*.
  2. Si es `/payment/failure`, muestra aviso de rechazo y el botón de *"Reintentar pago"*.
  3. Si es `/payment/pending`, informa que la pasarela se encuentra corroborando medios presenciales o bancarios y advierte que se avisará por notificación in-app en cuanto culmine.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componentes presentacionales `<PaymentSuccessView>`, `<PaymentFailureView>`, `<PaymentPendingView>`. Lee los query parameters que anexa Mercado Pago al retornar (`status`, `payment_id`, `external_reference`).
  * **Backend (Node.js):** N/A (el front obtiene todo lo necesario en la consulta por query params y los endpoints estándar de lectura).
  * **Base de Datos & Storage (Supabase):** N/A.
  * **Despliegue / Integración:** Configuración coherente de `back_urls` dentro de las solicitudes para preferencia en la API de Mercado Pago.

---

#### HU-40 - Creación automática de turno agendado
* **Rol:** Sistema
* **Épica:** Agenda y Ejecución (`EP-AGENDA`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Sistema de Argendar
  * **Quiero** crear automáticamente un turno agendado cuando el Cliente acepta una oferta
  * **Para** garantizar la reserva inmediata de la fecha y horario acordados, independientemente del medio de pago seleccionado
* **Criterios de Aceptación:**
  1. Al ejecutarse la transacción de aceptación de oferta (HU-31), el sistema inserta una fila nueva en la tabla `appointments` de forma **inmediata**, sin esperar confirmación de pago.
  2. Su fecha (`scheduled_date`) y su hora (`scheduled_time`) corresponden a `proposed_date` y `proposed_time` que el profesional determinó en la cotización ganadora.
  3. Su estado inicial es `CONFIRMED` y se asocian de forma indivisible: `job_request_id` (Solicitud), `proposal_id` (Oferta), `client_id` (Cliente) y `professional_id` (Profesional).
  4. Simultáneamente, el sistema crea un registro de pago (`payments`) con estado `PENDING` vinculado al turno recién creado.
  5. El estado del Turno se mantiene en `CONFIRMED` aunque el pago continúe en estado `PENDING`.
  6. El Profesional visualiza inmediatamente el Turno dentro de la sección *Mi Agenda → Actividad*.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** N/A (la creación es un proceso atómico de backend dentro de la transacción de HU-31).
  * **Backend (Node.js):** Proceso ejecutado como parte de la transacción atómica del endpoint `POST /api/v1/offers/:id/accept` (HU-31). No depende del webhook de Mercado Pago.
  * **Base de Datos & Storage (Supabase):** Tabla `appointments` (`id UUID PK`, `job_request_id UUID UNIQUE FK`, `proposal_id UUID UNIQUE FK`, `client_id UUID FK`, `professional_user_id UUID FK`, `scheduled_date DATE`, `scheduled_time TIME`, `address TEXT`, `status appointment_status ('PENDING', 'CONFIRMED', 'RESCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'CONFIRMED'`, `completion_requested_at TIMESTAMPTZ NULL`). La máquina de estados del turno es **independiente** de la máquina de estados del pago.
  * **Despliegue / Integración:** N/A.

---

#### HU-41 - Vista "Mi Agenda" del Cliente
* **Rol:** Cliente
* **Épica:** Agenda y Ejecución (`EP-AGENDA`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente
  * **Quiero** ingresar a la sección "Mi Agenda"
  * **Para** ver todos mis turnos programados en el calendario y consultar el registro histórico
* **Criterios de Aceptación:**
  1. Presenta los turnos en dos pestañas separadas: *"Próximos"* (`CONFIRMED`, `IN_PROGRESS`) y *"Pasados"* (`COMPLETED`, `CANCELLED`).
  2. Muestra tarjetas que exponen: Rubro del trabajo, Nombre del Profesional, Fecha del Turno, Franja Horaria, **insignia de estado del Turno** (`CONFIRMED` / `IN_PROGRESS`) e **insignia de estado del Pago** (`PENDING` / `PAID`) de forma independiente y con código de colores diferenciado.
  3. Cada tarjeta es un elemento clickeable que dirige al usuario al detalle específico del turno (`/appointments/:id`).
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<AgendaView>` en `/dashboard/agenda`. Sistema de pestañas de filtrado con los items mapeados en `<AppointmentCard>`. Cada tarjeta renderiza de forma independiente la insignia de estado del Turno y la insignia de estado del Pago.
  * **Backend (Node.js):** Endpoint `GET /api/v1/appointments`. Consulta con WHERE filtrando por `client_id = auth.uid()`. Incluye un JOIN con `payments` para devolver el estado del pago asociado.
  * **Base de Datos & Storage (Supabase):** RLS en `appointments` asegurando que los clientes solo tengan lectura sobre filas de sus propios servicios contratados.
  * **Despliegue / Integración:** N/A.

---

#### HU-42 - Vista "Mi Agenda" del Profesional
* **Rol:** Profesional
* **Épica:** Agenda y Ejecución (`EP-AGENDA`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Profesional técnico
  * **Quiero** tener un panel de "Mi Agenda" que recopile los turnos que logré cerrar en el marketplace
  * **Para** organizar los trabajos de mi jornada laboral de manera eficiente
* **Criterios de Aceptación:**
  1. Reutiliza el mismo esquema en pestañas de la agenda (*Próximos / Pasados*) pero mostrando como contraparte el Nombre y Dirección del Cliente.
  2. Cada tarjeta renderiza de forma independiente la **insignia de estado del Turno** (`CONFIRMED` / `IN_PROGRESS`) e **insignia de estado del Pago** (`PENDING` / `PAID`).
  3. Ordena cronológicamente los turnos desde la fecha de cita más cercana.
  4. Al presionar en un trabajo agendado, permite ingresar al detalle completo y las acciones de progreso.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<AgendaView>` con comportamiento dinámico condicionado a que la sesión global sea `role === 'professional'`. Renderiza insignias de estado de turno y pago de forma independiente.
  * **Backend (Node.js):** El endpoint `GET /api/v1/appointments` procesa el token entrante y condiciona la búsqueda al filtro WHERE `professional_user_id = auth.uid()`. Incluye JOIN con `payments` para devolver el estado del pago.
  * **Base de Datos & Storage (Supabase):** RLS configurada para los dos roles implicados en una misma tupla del turno.
  * **Despliegue / Integración:** N/A.

---

#### HU-43 - Detalle de turno agendado
* **Rol:** Cliente / Profesional
* **Épica:** Agenda y Ejecución (`EP-AGENDA`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente o Profesional con un trabajo programado
  * **Quiero** ingresar al detalle de un turno específico en mi agenda
  * **Para** ver la dirección exacta, el diagnóstico, los datos de contacto, el estado del turno y el estado del pago
* **Criterios de Aceptación:**
  1. Al estar el turno en estado `CONFIRMED`, esta vista libera la Dirección Callejera y el Teléfono de la contraparte para ambas partes (la información de contacto se revela al aceptar la oferta, no al pagar).
  2. Repasa la información técnica del trabajo: Respuestas del Cuestionario Dinámico, Galería Completa de Fotos del problema y Notas del Presupuesto.
  3. Desglosa los estados financieros: Presupuesto Total ($), Monto de Seña ($) y Saldo Remanente a cobrar al finalizar ($).
  4. Renderiza de forma independiente dos insignias: **Estado del Turno** (`CONFIRMED` / `IN_PROGRESS` / `COMPLETED` / `CANCELLED`) e **Estado del Pago** (`PENDING` / `PAID` / `REJECTED`).
  5. **Vista del Profesional:** Muestra un botón dinámico *"Confirmar cobro en efectivo"* disponible únicamente si `payment_method = 'CASH'` y `payments.status = 'PENDING'`.
  6. Muestra un bloque de Botones de Acción variable y exclusivo según el rol y la fase en la que esté la tarea (HU-44, HU-45, HU-46).
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<AppointmentDetailView>` en `/appointments/:id`. Llama a `GET /api/v1/appointments/:id`. Renderiza insignias de estado de turno y pago de forma separada. Muestra botón *"Confirmar cobro en efectivo"* condicionalmente para el Profesional.
  * **Backend (Node.js):** Endpoint `GET /api/v1/appointments/:id`. Hace un JOIN de `appointments` contra `job_requests`, `proposals`, `payments` y `profiles` (para exponer en JSON el contacto, el estado del pago y la información del turno).
  * **Base de Datos & Storage (Supabase):** Políticas SQL RLS protegen la privacidad de este detalle para que ningún usuario ajeno a la orden pueda llamar al ID en la API.
  * **Despliegue / Integración:** N/A.

---

#### HU-44 - Marcar pedido como "En progreso"
* **Rol:** Profesional
* **Épica:** Agenda y Ejecución (`EP-AGENDA`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Profesional que acude al domicilio del cliente
  * **Quiero** pulsar "Marcar como en progreso" dentro del detalle del turno
  * **Para** indicar a la plataforma y al cliente que inicié efectivamente la ejecución de la tarea técnica
* **Criterios de Aceptación:**
  1. El botón "Marcar como en progreso" se muestra únicamente para el especialista técnico en un turno en estado `CONFIRMED`.
  2. Al confirmar con el botón, el turno cambia su estado a `IN_PROGRESS` en la tabla `appointments` y en el registro base en `job_requests`.
  3. La interfaz se actualiza revelando el botón de pedido de finalización de trabajo (HU-55).
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Botón principal de acción en `<AppointmentDetailView>`. Gatilla la mutación `PATCH /api/v1/appointments/:id/start`.
  * **Backend (Node.js):** Endpoint `PATCH /api/v1/appointments/:id/start`. Valida al usuario profesional con su sesión y actualiza atómicamente el campo `status` a `'IN_PROGRESS'`.
  * **Base de Datos & Storage (Supabase):** RLS validando que el modificador coincida con el `professional_user_id` de ese registro.
  * **Despliegue / Integración:** N/A.

---

#### HU-45 - Confirmar servicio completado
* **Rol:** Cliente
* **Épica:** Agenda y Ejecución (`EP-AGENDA`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente
  * **Quiero** presionar un botón para confirmar que el profesional realizó el trabajo correctamente
  * **Para** declarar la tarea como terminada en el sistema y proceder con el pago del saldo
* **Criterios de Aceptación:**
  1. El botón "Confirmar completado" está visible en la vista del cliente únicamente en turnos que estén en estado `IN_PROGRESS` donde el profesional solicitó cierre (`completion_requested_at IS NOT NULL`).
  2. Requiere confirmación simple para que el cliente declare la conformidad.
  3. Al confirmar, el turno asume el estado de cierre definitivo `COMPLETED`, marcando a su vez `COMPLETED` en la tarea base.
  4. El sistema emite inmediatamente la preferencia de pago para liquidar el Saldo Remanente en Mercado Pago (ver HU-37) y manda un aviso de término al especialista.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Botón de aceptación final en `<AppointmentDetailView>`. Gatilla el endpoint `PATCH /api/v1/appointments/:id/complete` y evalúa redirigir a Checkout si hay diferencia económica por cobrar.
  * **Backend (Node.js):** Endpoint REST de culminación en el controlador de turnos. Valida la autoría de `client_id` y actualiza transaccionalmente `appointments.status = 'COMPLETED'` y `job_requests.status = 'COMPLETED'`.
  * **Base de Datos & Storage (Supabase):** Cambios de estado perpetuados en `appointments` y `job_requests`.
  * **Despliegue / Integración:** N/A.

---

#### HU-46 - Cancelar pedido
* **Rol:** Cliente / Profesional
* **Épica:** Agenda y Ejecución (`EP-AGENDA`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente o Profesional
  * **Quiero** poder cancelar una solicitud o cita que no llegó a completarse
  * **Para** anular la tarea si existe un impedimento de fuerza mayor para su ejecución
* **Criterios de Aceptación:**
  1. Se exponen opciones visibles para cancelar en pedidos y turnos activos (estados abiertos o `IN_PROGRESS` en MVP, según decisión §3.3).
  2. Requiere rellenar un cuadro modal de confirmación solicitando el motivo opcional.
  3. Transforma el estado general del trabajo en `CANCELLED` y del turno (si está creado) en `CANCELLED`, marcando al usuario responsable (`cancelled_by`).
  4. Al ser un MVP (ver decisión §2.5), no se programan reintegros en Mercado Pago; la devolución se asume y gestiona fuera de la plataforma en forma manual.
  5. Se emite una alerta in-app notificando al usuario que figura en la contraparte.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Botón de cancelación accesible desde vistas de publicación y turnos. Llama a `PATCH /api/v1/job-requests/:id/cancel` o `PATCH /api/v1/appointments/:id/cancel`.
  * **Backend (Node.js):** Endpoints y lógica compartida del servicio de cancelación. Realiza transacciones en SQL actualizando la información de auditoría del cese.
  * **Base de Datos & Storage (Supabase):** Columnas de auditoría (`cancelled_by UUID`, `cancellation_reason TEXT`).
  * **Despliegue / Integración:** N/A.

---

#### HU-47 - Historial de trabajos realizados
* **Rol:** Cliente / Profesional
* **Épica:** Agenda y Ejecución (`EP-AGENDA`)
* **Prioridad:** Should Have
* **Narrativa:**
  * **Como** Cliente o Profesional
  * **Quiero** acceder al archivo de la pestaña "Pasados" en mi agenda
  * **Para** consultar los detalles de los trabajos culminados y anulados en ocasiones anteriores
* **Criterios de Aceptación:**
  1. Filtra los turnos ordenando aquellos en estado `COMPLETED` y `CANCELLED` por fecha de cita descendente.
  2. Expone en formato de lista condensada: Fecha de ejecución, Profesional/Cliente, Rubro técnico y Monto transaccionado.
  3. Todos los ítems de historial permiten ingresar a lectura de su detalle congelado.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Pestaña "Pasados" en `<AgendaView>`. Realiza petición para la lista inactiva.
  * **Backend (Node.js):** Endpoint REST `GET /api/v1/appointments?history=true` filtrando en SQL mediante cláusula `WHERE status IN ('COMPLETED', 'CANCELLED')`.
  * **Base de Datos & Storage (Supabase):** Índices en `(client_id, status)` y `(professional_user_id, status)` para optimizar las consultas en listas crecientes.
  * **Despliegue / Integración:** N/A.

---

#### HU-48 - Campana de notificaciones in-app
* **Rol:** Cliente / Profesional
* **Épica:** Notificaciones (`EP-NOTIF`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** usuario activo en la aplicación
  * **Quiero** ver un ícono de campana en el margen superior de la pantalla con el contador de pendientes
  * **Para** saber en forma instintiva si recibí eventos del sistema por revisar
* **Criterios de Aceptación:**
  1. El ícono de campana de notificaciones se ubica visiblemente en la esquina superior derecha del menú en todos los dispositivos.
  2. Presenta un badge color rojo con el conteo acumulado de notificaciones con campo `read = false` pertenecientes a la sesión en curso.
  3. El contador se actualiza dinámicamente o cada 30 segundos mediante polling (o conexión en tiempo real con Supabase).
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<NotificationBell>` situado en `<Navbar>`. Utiliza un hook local para suscribirse a los cambios o sondear llamadas a `GET /api/v1/notifications?unread_count=true`.
  * **Backend (Node.js):** Endpoint rápido que retorna la cuenta entera sin armar payloads de objetos en JSON: `SELECT COUNT(*) FROM notifications WHERE user_id = auth.uid() AND read = false`.
  * **Base de Datos & Storage (Supabase):** Tabla `notifications` (`id UUID PK`, `user_id UUID FK`, `type notification_type ENUM`, `title TEXT`, `message TEXT`, `read BOOLEAN DEFAULT false`, `related_entity_type TEXT`, `related_entity_id UUID`, `created_at TIMESTAMPTZ DEFAULT now()`).
  * **Despliegue / Integración:** Habilitar el módulo y replicación real-time de PostgreSQL en la tabla `notifications` desde la consola de Supabase.

---

#### HU-49 - Dropdown de notificaciones
* **Rol:** Cliente / Profesional
* **Épica:** Notificaciones (`EP-NOTIF`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** usuario activo en la aplicación
  * **Quiero** hacer clic sobre el ícono de la campana
  * **Para** abrir un panel flotante de notificaciones y revisar las alertas recientes
* **Criterios de Aceptación:**
  1. Al hacer clic, se despliega un panel flotante (dropdown) exponiendo las últimas 20 alertas generadas.
  2. Cada entrada exhibe: Ícono según tipo de alerta, Título general, Mensaje corto explicativo y el intervalo de tiempo relativo de creación (ej. *"hace 10 minutos"*).
  3. Se diferencia visualmente en negrita a las filas no leídas (`read = false`).
  4. Al hacer clic sobre cualquier mensaje del dropdown, la alerta cambia a `read = true` en segundo plano y transporta al usuario directamente al detalle de la entidad relacionada (tarea o turno).
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<NotificationDropdown>` posicionado bajo `<NotificationBell>`. Invoca al endpoint REST `GET /api/v1/notifications?limit=20` al abrirse. Al pulsar un ítem, ejecuta `PATCH /api/v1/notifications/:id/read` y dispara un `useNavigate()`.
  * **Backend (Node.js):** Endpoints para lectura de listas y actualización condicional de flag de lectura en Node.js.
  * **Base de Datos & Storage (Supabase):** Índices por usuario y marca temporal (`user_id, created_at DESC`).
  * **Despliegue / Integración:** N/A.

---

#### HU-50 - Notificación: Nueva cotización recibida
* **Rol:** Cliente
* **Épica:** Notificaciones (`EP-NOTIF`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente con tareas abiertas
  * **Quiero** recibir una alerta in-app cada vez que un especialista envíe una oferta a mi publicación
  * **Para** enterarme con premura y entrar a comparar presupuestos
* **Criterios de Aceptación:**
  1. El sistema inserta esta notificación cuando el backend concreta la creación exitosa de un registro en `proposals` (HU-25).
  2. Configura: `type = 'new_proposal'`, Título: *"Nueva cotización en tu tarea"*, Mensaje descriptivo con el rubro y el presupuesto inicial.
  3. El enlace de la alerta enlaza a la vista de la tarea (`/tasks/:id`).
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Visualizada dentro del ítem renderizado en `<NotificationDropdown>`.
  * **Backend (Node.js):** El controlador `jobRequestController.createProposal()` escribe una tupla nueva en `notifications` apuntando al `client_id` de la tarea original.
  * **Base de Datos & Storage (Supabase):** RLS que se respeta porque es generada mediante `SUPABASE_SERVICE_ROLE_KEY` del backend autenticado.
  * **Despliegue / Integración:** N/A.

---

#### HU-51 - Notificación: Cotización aceptada
* **Rol:** Profesional
* **Épica:** Notificaciones (`EP-NOTIF`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Profesional que cotizó un trabajo
  * **Quiero** recibir una notificación si el cliente aceptó mi propuesta
  * **Para** agendar el compromiso y prever la salida hacia el domicilio del cliente
* **Criterios de Aceptación:**
  1. Se inserta en forma automática y transaccional cuando el Cliente acepta una oferta y se ejecuta la transacción atómica de creación del turno (HU-31).
  2. Configura: `type = 'proposal_accepted'`, Título: *"¡Tu cotización fue aceptada!"*, Mensaje explicativo informando rubro, zona y fecha/hora acordadas.
  3. Su enlace interior dirige en un clic hacia la ficha técnica del nuevo turno (`/appointments/:id`).
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** N/A (generado por backend y visualizado globalmente en el dropdown web).
  * **Backend (Node.js):** Acción incluida dentro del bloque atómico del endpoint `POST /api/v1/offers/:id/accept` (HU-31).
  * **Base de Datos & Storage (Supabase):** Insert dirigido al identificador de usuario encuadrado en `professional_profiles.user_id`.
  * **Despliegue / Integración:** N/A.

---

#### HU-52 - Notificación: Cotización rechazada
* **Rol:** Profesional
* **Épica:** Notificaciones (`EP-NOTIF`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Profesional con cotizaciones enviadas
  * **Quiero** recibir una notificación en la campana cuando el cliente se decante por otro especialista
  * **Para** saber de inmediato que no obtuve el trabajo y liberar mi calendario
* **Criterios de Aceptación:**
  1. El sistema inserta este aviso transaccional en lote (Batch) sobre el resto de las cotizaciones con estado pendiente tras ejecutarse la aceptación de la oferta por parte del cliente (HU-32).
  2. Configura: `type = 'proposal_rejected'`, Título: *"Cotización no seleccionada"*, Mensaje confirmando que el encargo por el rubro en cuestión fue cubierto por otro profesional.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** N/A.
  * **Backend (Node.js):** Inserción por lote dentro de la misma transacción atómica de aceptación de oferta (`POST /api/v1/offers/:id/accept`).
  * **Base de Datos & Storage (Supabase):** `INSERT INTO notifications` iterando los `user_id` de las filas en `proposals` afectadas con `status = 'rejected'`.
  * **Despliegue / Integración:** N/A.

---

#### HU-53 - Notificación: Pago confirmado
* **Rol:** Cliente / Profesional
* **Épica:** Notificaciones (`EP-NOTIF`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** usuario del Marketplace
  * **Quiero** recibir un comprobante por notificación ante la aprobación del cobro de seña y del cobro de saldo
  * **Para** que ambas partes confirmemos las transacciones
* **Criterios de Aceptación:**
  1. Al confirmarse el pago por webhook (`approved`), se crean 2 alertas idénticas apuntando al cliente y al profesional implicados.
  2. Configura: `type = 'payment_confirmed'`, Título: *"Pago en Mercado Pago confirmado"*, indicando el monto total abonado ($) en la operación.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** N/A.
  * **Backend (Node.js):** Disparado en `handleMP()` para flujos en los rubros de seña (`type = 'deposit'`) y liquidación remanente (`type = 'balance'`).
  * **Base de Datos & Storage (Supabase):** Creación simultánea de tuplas sobre `notifications`.
  * **Despliegue / Integración:** N/A.

---

#### HU-54 - Notificación: Recordatorio 24h antes del turno
* **Rol:** Cliente / Profesional
* **Épica:** Notificaciones (`EP-NOTIF`)
* **Prioridad:** Should Have
* **Narrativa:**
  * **Como** Cliente o Profesional con una cita próxima
  * **Quiero** que la campana in-app emita una alarma de recordatorio con 24 horas de antelación
  * **Para** no pasar por alto mis compromisos y prevenir descuidos del turno
* **Criterios de Aceptación:**
  1. Una rutina programada en el servidor analiza el calendario e identifica las filas cuya fecha agendada de visita equivalga al día siguiente.
  2. Para cada ocurrencia con estado agendado, inyecta notificaciones al cliente y profesional en base de datos.
  3. Configura: `type = 'reminder_24h'`, Título: *"Recordatorio de servicio técnico para mañana"*, expresando el rubro del turno y el horario.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** N/A.
  * **Backend (Node.js):** Cron o proceso de fondo (`node-cron`) en el backend evaluando: `SELECT * FROM appointments WHERE scheduled_date = CURRENT_DATE + 1 AND status = 'CONFIRMED'`.
  * **Base de Datos & Storage (Supabase):** Alternativa externa con `pg_cron` en la propia base PostgreSQL de Supabase insertando alertas sin consumo excesivo de backend.
  * **Despliegue / Integración:** Automatización o workers persistentes del entorno Cloud en producción.

---

#### HU-55 - Notificación: Trabajo completado (solicitud)
* **Rol:** Cliente
* **Épica:** Notificaciones (`EP-NOTIF`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente con una reparación en curso
  * **Quiero** recibir una alerta tan pronto como el especialista marque "Solicitar cierre" en mi cita
  * **Para** ingresar con celeridad a validar y emitir mi aprobación de la labor realizada
* **Criterios de Aceptación:**
  1. Se inserta en la base cuando un especialista autenticado activa la solicitud de culminación de trabajo (`PATCH /api/v1/appointments/:id/request-completion`).
  2. Configura: `type = 'job_completed'`, Título: *"El profesional reporta trabajo finalizado"*, instruyendo en el cuerpo al cliente para acudir a la vista del turno (`/appointments/:id`) y liberar el cobro final.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Botón del profesional para "Solicitar cierre" en la vista `<AppointmentDetailView>`.
  * **Backend (Node.js):** Endpoint REST `PATCH /api/v1/appointments/:id/request-completion`. Actualiza la columna timestamp `completion_requested_at` en el turno e inserta en paralelo la alerta de culminación al cliente.
  * **Base de Datos & Storage (Supabase):** Columna de control `completion_requested_at TIMESTAMPTZ` en tabla `appointments`.
  * **Despliegue / Integración:** N/A.

---

#### HU-56 - Notificación: Pedido cancelado
* **Rol:** Cliente / Profesional
* **Épica:** Notificaciones (`EP-NOTIF`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Cliente o Profesional
  * **Quiero** ser notificado sin retrasos si mi contraparte cancela nuestra tarea o cita de agenda
  * **Para** estar informado inmediatamente y tomar determinaciones con mi tiempo
* **Criterios de Aceptación:**
  1. Es emitida dentro del controlador de cancelación de pedidos (ver HU-46).
  2. Se despacha inequívocamente al `user_id` en la contraparte (nunca enviada a quien originó la cancelación).
  3. Configura: `type = 'job_cancelled'`, Título: *"Cancelación en pedido"*, especificando qué rubro o turno ha sido finalizado de forma anticipada.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** N/A.
  * **Backend (Node.js):** Logística en el controlador genérico de cambios de estado `jobRequestController.cancel()`.
  * **Base de Datos & Storage (Supabase):** Inserción simple orientada por RLS.
  * **Despliegue / Integración:** N/A.

---

#### HU-57 - Marcar notificación como leída
* **Rol:** Cliente / Profesional
* **Épica:** Notificaciones (`EP-NOTIF`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** usuario del sistema
  * **Quiero** marcar notificaciones leídas individualmente o presionar "Marcar todas como leídas"
  * **Para** mantener orden en mis avisos pendientes y resetear el contador rojo del cabezal
* **Criterios de Aceptación:**
  1. El menú emergente de campana permite hacer clic en el botón *"Marcar todo como leído"*, que actualiza de manera masiva en `read = true` las entradas no leídas del usuario en la base de datos.
  2. Hacer clic sobre una fila individual de la lista invoca en paralelo la mutación para marcar leída la respectiva alerta.
  3. El contador rojo y el diseño visual de los ítems en el frontend se refrescan al instante de forma local para no causar pausas de red.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Botón de lectura global en `<NotificationDropdown>`. Dispara al endpoint de actualización por API e implementa optimismo visual.
  * **Backend (Node.js):** Endpoints REST `PATCH /api/v1/notifications/:id/read` y la variante `PATCH /api/v1/notifications/read-all`.
  * **Base de Datos & Storage (Supabase):** Sentencia SQL masiva `UPDATE notifications SET read = true WHERE user_id = auth.uid() AND read = false`.
  * **Despliegue / Integración:** N/A.

---

#### HU-58 - Widget flotante del chatbot
* **Rol:** Cliente / Profesional
* **Épica:** Chatbot FAQ (`EP-CHAT`)
* **Prioridad:** Should Have
* **Narrativa:**
  * **Como** usuario con dudas
  * **Quiero** ver un ícono flotante interactivo (widget de ayuda) disponible en cualquier pantalla
  * **Para** abrir rápidamente un asistente y resolver mis dudas
* **Criterios de Aceptación:**
  1. El widget (Botón de Acción Flotante) se encuentra visiblemente anclado a la esquina inferior derecha de la interfaz del usuario.
  2. Al presionar en el botón, el asistente emerge suavemente como un contenedor modal tipo chat sin abandonar o redirigir la pantalla en uso.
  3. Permite minimizar o cerrar el panel presionado de nuevo su disparador y conserva abierta la última consulta ante cambios de pantalla.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente independiente `<ChatbotWidget>` inyectado en un nivel alto del árbol DOM (`<App>`) empleando posicionamiento CSS absoluto (`fixed bottom-6 right-6 z-50`).
  * **Backend (Node.js):** N/A.
  * **Base de Datos & Storage (Supabase):** N/A.
  * **Despliegue / Integración:** N/A.

---

#### HU-59 - Interacción con árbol de preguntas frecuentes
* **Rol:** Cliente / Profesional
* **Épica:** Chatbot FAQ (`EP-CHAT`)
* **Prioridad:** Should Have
* **Narrativa:**
  * **Como** usuario interactuando con el bot FAQ
  * **Quiero** seleccionar opciones interactivas de un menú en árbol de decisiones
  * **Para** autodiagnosticar y encontrar respuesta a mis preguntas sin requerir soporte manual
* **Criterios de Aceptación:**
  1. Al iniciar la sesión de ayuda, el widget presenta opciones de preguntas iniciales mediante botones (ej. *"¿Cómo publico una tarea?"*, *"¿Cómo operan los cobros?"*).
  2. Pulsar en una categoría de alto nivel carga sub-categorías asociadas que permiten refinar la duda paso a paso.
  3. Pulsar sobre una pregunta terminal presenta un mensaje de texto explicativo estructurado para solucionar el inconveniente.
  4. La cabecera del chat dispone de un botón permanente *"← Menú Anterior"* para retroceder en la estructura jerárquica del bot.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente de diálogo `<ChatbotTreeNavigator>` renderizado por el widget. Ejecuta peticiones dinámicas en segundo plano con `GET /api/v1/chatbot/intents` (para consultar las opciones del menú actual).
  * **Backend (Node.js):** Endpoints para lectura del árbol en base de datos: `GET /api/v1/chatbot/intents` y `GET /api/v1/chatbot/intents/:id/children`.
  * **Base de Datos & Storage (Supabase):** Tabla `chatbot_intents` (columnas: `id UUID PK`, `parent_id UUID FK NULL`, `intent_key TEXT UNIQUE`, `display_text TEXT`, `response_text TEXT NULL`, `display_order INTEGER`). Estructura auto-referencial (`parent_id REFERENCES chatbot_intents(id)`).
  * **Despliegue / Integración:** Script SQL para rellenar de base en la base de datos el esquema del árbol con todas las preguntas más frecuentes (FAQs).

---

#### HU-60 - Respuesta automática a FAQ
* **Rol:** Cliente / Profesional
* **Épica:** Chatbot FAQ (`EP-CHAT`)
* **Prioridad:** Should Have
* **Narrativa:**
  * **Como** usuario de la plataforma
  * **Quiero** leer textos de respuesta claros y formateados dentro del hilo del chat
  * **Para** entender con facilidad y precisión la resolución a mi consulta
* **Criterios de Aceptación:**
  1. Los bloques con explicaciones e instrucciones se insertan simulando burbujas visuales de conversación de asistente.
  2. El campo explicativo (`response_text`) soporta y renderiza negritas y enlaces clickeables de ayuda que llevan a documentación externa.
  3. Detrás de una respuesta explicativa, el hilo de chat ofrece los controles rápidos: *"¿Te sirvió la respuesta? Sí / No"* y *"← Volver al menú inicial"*.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente presentacional de globos `<ChatMessageBubble>`. Soporta renderización básica de links HTML o sintaxis Markdown.
  * **Backend (Node.js):** El texto explicativo viaja embebido en el campo `response_text` emitido por el servicio de consulta en HU-59.
  * **Base de Datos & Storage (Supabase):** Almacenado como cadenas en `chatbot_intents.response_text`.
  * **Despliegue / Integración:** N/A.

---

#### HU-61 - Mensaje de fallback del chatbot
* **Rol:** Cliente / Profesional
* **Épica:** Chatbot FAQ (`EP-CHAT`)
* **Prioridad:** Should Have
* **Narrativa:**
  * **Como** usuario del Chatbot FAQ
  * **Quiero** recibir una alternativa cordial si el asistente pre-configurado no encuentra o resuelve mi duda
  * **Para** saber qué vía institucional utilizar para comunicar mi reclamo al equipo
* **Criterios de Aceptación:**
  1. Si un intent explorado no contuviera ramas descendentes ni textos de respuesta (o ante clics negativos en *"¿Te sirvió la respuesta?"*), el widget debe gatillar un mensaje predeterminado de respaldo.
  2. El texto de fallback orienta e instruye diciendo: *"No tengo esa información en mi sistema. Podés escribirnos a soporte@argendar.com para recibir asistencia"*.
  3. El contenido literal de dicho fallo es fácilmente actualizable desde un registro en la base de datos sin requerir puestas en producción.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Evaluador condicional dentro de `<ChatbotTreeNavigator>` al recibir nodos vacíos en el fetch.
  * **Backend (Node.js):** N/A.
  * **Base de Datos & Storage (Supabase):** Tupla raíz con `intent_key = 'fallback'` aprovisionada desde el inicio en la tabla de intents.
  * **Despliegue / Integración:** N/A.

---

#### HU-62 - Acceso al panel de administrador
* **Rol:** Administrador
* **Épica:** Dashboard de Administrador (`EP-ADMIN`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Administrador (super-admin) de Argendar
  * **Quiero** acceder a una sección protegida tras mi login
  * **Para** poder gestionar y moderar las tareas y las cuentas registradas en el marketplace
* **Criterios de Aceptación:**
  1. La ruta de administración en la web `/admin` exige comprobación de que en el perfil del usuario figure rígidamente la propiedad de rol `role === 'admin'`.
  2. Si una cuenta de Cliente o Profesional altera la URL e intenta ingresar, el guard intercepta la solicitud y redirige a su respectiva vista pública.
  3. Expone un menú lateral administrativo que divide accesos hacia: Usuarios, Tareas/Moderación, Métricas, y Transacciones de Mercado Pago.
  4. Respetando el alcance del MVP (decisión §4.3), solo existirá un rol único super-admin, sin jerarquías ni permisos acotados en esta iteración.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Guard de enrutamiento `<AdminRouteGuard>`. Componente marco `<AdminDashboardLayout>` que contiene `<AdminSidebar>`.
  * **Backend (Node.js):** Middleware expreso en la arquitectura Node.js `requireAdmin()` que valida los tokens JWT comparando los metadatos y en `profiles` por `role = 'admin'`.
  * **Base de Datos & Storage (Supabase):** Inserción por script SQL de inicialización o comando manual para otorgar privilegios al usuario administrador del fundador en `profiles`.
  * **Despliegue / Integración:** Protección y restricción por red en entornos productivos.

---

#### HU-63 - Listado y búsqueda de usuarios
* **Rol:** Administrador
* **Épica:** Dashboard de Administrador (`EP-ADMIN`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Administrador
  * **Quiero** consultar una tabla general de todas las cuentas registradas con campo de búsqueda
  * **Para** localizar en segundos la información completa de cualquier cliente o especialista
* **Criterios de Aceptación:**
  1. Muestra en formato tabular: Nombre, Correo, Rol, Fecha de creación en el sistema y Estado operativo de la cuenta (Activa o Suspendida).
  2. Integra una barra superior con cuadro de texto para filtrar cuentas dinámicamente en servidor (por coincidencia parcial de texto en nombre y email).
  3. Contiene filtro de rol para desglosar la tabla visualizando exclusivamente a "Clientes" o "Profesionales".
  4. La consulta pagina los resultados en series de 20 cuentas con navegación numérica y por flechas.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente de administración `<AdminUsersTableView>` en `/admin/users`.
  * **Backend (Node.js):** Endpoint REST `GET /api/v1/admin/users?search=&role=&page=&limit=`. Controlador `adminController.listUsers()`. Utiliza `SUPABASE_SERVICE_ROLE_KEY` del backend para sobrepasar RLS y hacer un JOIN total entre las tablas `profiles` y `auth.users`.
  * **Base de Datos & Storage (Supabase):** Índices en SQL sobre campos comunes (`first_name`, `last_name`, y en el email) para asegurar la velocidad de búsqueda.
  * **Despliegue / Integración:** N/A.

---

#### HU-64 - Suspender / reactivar cuenta de usuario
* **Rol:** Administrador
* **Épica:** Dashboard de Administrador (`EP-ADMIN`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Administrador
  * **Quiero** suspender en el acto cuentas infractoras y reactivarlas cuando el incidente se resuelva
  * **Para** resguardar la seguridad de la plataforma
* **Criterios de Aceptación:**
  1. Cada usuario en la tabla muestra en su respectiva fila un botón con interruptor *"Suspender"* (para cuentas activas) o *"Reactivar"* (para cuentas infractoras bloqueadas).
  2. Su ejecución requiere validación simple en pantalla mediante diálogo de confirmación.
  3. Al confirmarse el cambio, se actualiza la propiedad `is_suspended = true` (o `false`) del usuario.
  4. Si una cuenta se suspende, se bloquean las autorizaciones para iniciar sesión (HU-03).
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Controles en `<AdminUsersTableView>`. Gatillan endpoints en mutación REST.
  * **Backend (Node.js):** Endpoints `PATCH /api/v1/admin/users/:id/suspend` y `PATCH /api/v1/admin/users/:id/reactivate`. Modifican la propiedad `is_suspended` desde un query autenticado con clave administrativa (`SUPABASE_SERVICE_ROLE_KEY`).
  * **Base de Datos & Storage (Supabase):** Columna booleana `profiles.is_suspended DEFAULT false`.
  * **Despliegue / Integración:** N/A.

---

#### HU-65 - Listado de tareas publicadas (moderación)
* **Rol:** Administrador
* **Épica:** Dashboard de Administrador (`EP-ADMIN`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Administrador de Argendar
  * **Quiero** consultar una tabla general de supervisión con todas las solicitudes de trabajo que ingresaron a la plataforma
  * **Para** monitorear la salud operativa del marketplace y detectar posibles irregularidades en las publicaciones
* **Criterios de Aceptación:**
  1. La tabla exhibe: ID único del trabajo, Nombre del cliente creador, Rubro del servicio, Zona, Estado actual, Fecha de publicación original y total acumulado de cotizaciones.
  2. Permite filtrar los registros en servidor por rubro, zona operativa o estados particulares del ciclo de vida (ej. ver todos los que estén en `PUBLISHED`).
  3. Al presionar sobre un código o fila de tarea, abre una pantalla de detalle de inspección para que el Administrador revise el contenido del cuestionario, fotos adjuntas e historial de propuestas recibidas.
  4. Cuenta con paginación progresiva y navegación.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<AdminTasksTableView>` en `/admin/tasks`. Integración de selectores múltiples para aplicar filtros.
  * **Backend (Node.js):** Endpoint REST de moderación `GET /api/v1/admin/job-requests?status=&rubro_id=&page=`. Emplea un JOIN masivo desde `job_requests` junto a `profiles`, `rubros`, `zones` y `proposals`.
  * **Base de Datos & Storage (Supabase):** Acceso libre sin restricciones RLS en backend usando el service role key.
  * **Despliegue / Integración:** N/A.

---

#### HU-66 - Ocultar / eliminar publicación
* **Rol:** Administrador
* **Épica:** Dashboard de Administrador (`EP-ADMIN`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Administrador en funciones de moderador
  * **Quiero** ocultar o eliminar una publicación infractora que vulnere normas comunitarias
  * **Para** depurar el contenido en pantalla y salvaguardar los estándares del marketplace
* **Criterios de Aceptación:**
  1. El botón de acción *"Ocultar"* transacciona el cambio del estado a `'CANCELLED'`, estableciendo la columna del auditor en `cancelled_by = admin_id`.
  2. El botón de acción *"Eliminar (Irreversible)"* borra la publicación por completo junto a las entidades dependientes adjuntas.
  3. Ambas opciones están protegidas por cuadros modales de confirmación explícita.
  4. Tras ocultar o purgar una tarea, los especialistas con ofertas recibidas o en proceso son notificados de que la publicación se removió por motivos de moderación.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Botones administrativos de acción en `<AdminTasksTableView>` y en su modal de inspección.
  * **Backend (Node.js):** Endpoints REST `PATCH /api/v1/admin/job-requests/:id/hide` y la purga por `DELETE /api/v1/admin/job-requests/:id`. El método DELETE ejecuta invocaciones al Storage para borrar archivos multimedia huérfanos antes del borrado en SQL.
  * **Base de Datos & Storage (Supabase):** Claves foráneas (Foreign Keys) en `job_photos`, `job_request_answers` y `proposals` configuradas con la regla relacional `ON DELETE CASCADE`.
  * **Despliegue / Integración:** N/A.

---

#### HU-67 - Dashboard de métricas (KPIs)
* **Rol:** Administrador
* **Épica:** Dashboard de Administrador (`EP-ADMIN`)
* **Prioridad:** Should Have
* **Narrativa:**
  * **Como** Administrador
  * **Quiero** disponer de un panel de métricas consolidado con los indicadores clave del negocio (KPIs)
  * **Para** monitorear el desempeño del marketplace e impulsar decisiones basadas en datos
* **Criterios de Aceptación:**
  1. Muestra tarjetas con métricas operativas clave de Argendar:
     - Total de tareas publicadas.
     - Tasa de conversión de tareas (Porcentaje de `ACCEPTED`/`COMPLETED` sobre el total en el marketplace).
     - Cantidad total de profesionales activos e integrados en el sistema (`is_onboarding_complete = true`).
     - Volumen financiero recaudado por la plataforma en concepto de señas pagadas por Mercado Pago (`SUM(amount)` para señas aprobadas).
     - Promedio de cotizaciones enviadas por publicación de tarea.
  2. Permite filtrar métricas acotando por ventana de tiempo (7 días, 30 días, 90 días o todo el historial).
  3. Incluye un gráfico analítico de líneas temporales ilustrando el volumen de nuevas tareas creadas día por día durante los últimos 30 días.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<AdminMetricsView>` en `/admin/metrics`. Gráfico implementado con librerías ligeras de datos para React (ej. `recharts`).
  * **Backend (Node.js):** Endpoint centralizado de Business Intelligence `GET /api/v1/admin/metrics?from=&to=`. Procesa en paralelo consultas agrupadas de SQL devolviendo un payload JSON unificado con los contadores estadísticos de la plataforma.
  * **Base de Datos & Storage (Supabase):** Consultas avanzadas agregadas en PostgreSQL: `COUNT(*)`, `SUM(amount) FILTER (...)`, `AVG(proposal_count)`, y la función cronológica `DATE_TRUNC('day', created_at)`.
  * **Despliegue / Integración:** N/A.

---

#### HU-68 - Historial de pagos (transacciones MP)
* **Rol:** Administrador
* **Épica:** Dashboard de Administrador (`EP-ADMIN`)
* **Prioridad:** Should Have
* **Narrativa:**
  * **Como** Administrador de finanzas
  * **Quiero** acceder a una tabla maestra del historial de pagos y cobros transaccionados por Mercado Pago
  * **Para** conciliar liquidaciones, supervisar las operaciones y gestionar manualmente las transferencias hacia las cuentas bancarias de los profesionales
* **Criterios de Aceptación:**
  1. La tabla muestra en columnas: ID interno, Tipo (`seña` o `saldo`), Medio de Pago (`MERCADOPAGO` / `CASH`), Importe ($), Estado (`PENDING`, `PROCESSING`, `PAID`, `REJECTED`, `CANCELLED`, `REFUNDED`), Fecha/hora de cobro, Cliente, Profesional pagado, ID de Tarea e Identificador externo de cobro de Mercado Pago (cuando aplica).
  2. Permite filtrar por tipo de pago (`deposit` / `balance`), medio de pago (`MERCADOPAGO` / `CASH`), estados, e intervalos cronológicos de fecha.
  3. Contiene paginación de lista completa.
  4. El administrador dispone de un botón *"Exportar CSV"* en el cabezal que descarga de inmediato la base filtrada en un archivo `.csv` para manejo contable manual.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Componente `<AdminPaymentsTableView>` en `/admin/payments`. Permite descargar un reporte tabular mediante llamada paramétrica `format=csv`.
  * **Backend (Node.js):** Endpoint REST `GET /api/v1/admin/payments?status=&type=&payment_method=&format=`. Realiza un JOIN relacionando la tabla de pagos con clientes, especialistas, rubros de servicio y datos de tarea. Si se recibe `format=csv`, el controlador retorna el contenido formateado y establece el encabezado de respuesta HTTP `Content-Type: text/csv`.
  * **Base de Datos & Storage (Supabase):** Consultas de lectura total mediante clave administrativa, apoyadas con índices en la tabla `payments` (`created_at`, `status`, `type`, `payment_method`).
  * **Despliegue / Integración:** N/A.

---

#### HU-72 - Confirmación del Turno independiente del pago
* **Rol:** Sistema / Cliente
* **Épica:** Agenda y Pagos (`EP-AGENDA` / `EP-PAY`)
* **Prioridad:** Must Have
* **Narrativa:**
  * **Como** Sistema de Argendar
  * **Quiero** crear automáticamente un Turno cuando el Cliente acepta una Oferta
  * **Para** garantizar la reserva de la fecha y horario acordados independientemente del medio de pago seleccionado
* **Criterios de Aceptación:**
  1. Al aceptar una Oferta, el sistema crea automáticamente un Turno (`appointments`) en estado `CONFIRMED`.
  2. El Turno se crea de forma inmediata sin depender de si el pago ya se ejecutó.
  3. El Turno queda asociado a: `job_request_id` (Solicitud), `proposal_id` (Oferta), `client_id` (Cliente) y `professional_id` (Profesional).
  4. Simultáneamente, el sistema crea un registro de pago (`payments`) con estado `PENDING`.
  5. El estado del Turno se mantiene en `CONFIRMED` aunque el pago continúe en estado `PENDING`.
  6. El Profesional visualiza inmediatamente el Turno dentro de la sección *Mi Agenda → Actividad*.
  7. **Pagos Digitales (Mercado Pago / Tarjetas):** El sistema aguarda el webhook del proveedor de pagos para actualizar el registro a `PAID`.
  8. **Pago en Efectivo:** El pago permanece en `PENDING` hasta que el Profesional presiona manualmente el botón "Confirmar cobro en efectivo", cambiando el estado a `PAID`.
  9. La confirmación del pago en cualquiera de las modalidades actualiza el registro a `PAID` sin alterar el estado `CONFIRMED` del Turno.
  10. Todas las transacciones y cambios de estado generan registros de auditoría.
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** Al hacer clic en "Aceptar Oferta", la UI invoca el endpoint `POST /api/v1/offers/:id/accept`, renderiza la confirmación del Turno y ofrece la selección del medio de pago (Efectivo vs. Mercado Pago). La pantalla del Turno y el detalle en "Mi Agenda" renderizan de forma independiente la insignia de estado del Turno (`CONFIRMED`) y la insignia de estado del Pago (`PENDING` / `PAID`). Vista del Profesional: Botón dinámico *"Confirmar cobro en efectivo"* disponible únicamente si `payment_method = 'CASH'` y `payments.status = 'PENDING'`.
  * **Backend (Node.js):**
    - Endpoint `POST /api/v1/offers/:id/accept`: Ejecuta una transacción atómica que crea el registro en `appointments` (`status = 'CONFIRMED'`) y en `payments` (`status = 'PENDING'`), actualiza `job_requests.status = 'ACCEPTED'`, marca la propuesta como `accepted`, rechaza las demás cotizaciones pendientes y dispara notificaciones. Devuelve ambos objetos (`appointment` + `payment`).
    - Endpoint `PATCH /api/v1/payments/:id/confirm-cash`: Permite al Profesional autenticado confirmar la recepción del dinero en efectivo (`payments.status → 'PAID'`). Valida que el solicitante sea el `professional_id` asignado al turno.
    - Endpoint `POST /api/v1/payments/webhook/mercadopago`: Escucha las notificaciones IPN/Webhooks de Mercado Pago para actualizar únicamente la tabla `payments` (no modifica `appointments`).
  * **Base de Datos & Seguridad (Supabase PostgreSQL):**
    - Tablas `appointments` y `payments` separadas con clave foránea `appointment_id` en `payments`.
    - Máquina de estados del Turno (`appointments.status`): `PENDING` | `CONFIRMED` | `RESCHEDULED` | `IN_PROGRESS` | `COMPLETED` | `CANCELLED`.
    - Máquina de estados del Pago (`payments.status`): `PENDING` | `PROCESSING` | `PAID` | `REJECTED` | `CANCELLED` | `REFUNDED`.
    - Políticas RLS:
      - Lectura de `appointments` y `payments` permitida únicamente para el `client_id` y `professional_id` asociados.
      - Actualización de `payments.status` a `PAID` en pagos en efectivo restringida estrictamente al `professional_id` asignado.
    - Registros de auditoría para todas las transacciones y cambios de estado.
  * **Despliegue / Integración:** Variables `.env`: `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`. Endpoint HTTPS accesible para webhooks de Mercado Pago.

---

## 4. CONCLUSIÓN Y TRAZABILIDAD DEL REPORTE

### 4.1 Verificación del Alcance contra el Prompt Maestro

La matriz y el listado del presente informe cumplen con la cobertura exhaustiva y el desglose de todas las funcionalidades solicitadas:

1. **Roles del sistema:** Clientes, Profesionales y Administrador único en el MVP (`HU-01`, `HU-02`, `HU-05`, `HU-62`).
2. **Registro diferenciado y Autenticación Supabase:** Registro por rol, inicio de sesión seguro, control de suspensión y flujo de reseteo de contraseña (`HU-01` a `HU-06`).
3. **Onboarding Profesional:** Pasos de configuración de perfil con rubros especializados (Frigoristas, Plomeros y Electricistas), zonas de cobertura por barrios y datos públicos de contacto (`HU-07` a `HU-10`).
4. **Flujo de Publicación de Tarea (Cliente):** Confirmación de dirección/barrio, selección de rubro, cuestionario dinámico según rubro y falla, carga de fotos al bucket `job-photos`, y pantalla de resumen final (`HU-11` a `HU-20`).
5. **Feed y Exploración de Trabajos (Profesional):** Explorador de tareas abiertas por rubro/zona con filtrado por filtros rápidos, consulta del detalle, visor con zoom y ocultamiento del domicilio callejero por privacidad (`HU-21` a `HU-24`).
6. **Sistema de Cotizaciones/Propuestas (Profesional):** Formulario modal para emitir oferta formal de importe total y seña propuesta, fecha/hora sugerida de visita, historial personal y opción de retirar presupuesto (`HU-25` a `HU-28`).
7. **Comparación, Aceptación y Turno Desacoplado (Cliente/Sistema):** Visualización general de cotizaciones, matriz de comparación horizontal por atributos, aceptación con creación inmediata del turno (`CONFIRMED`) y registro de pago (`PENDING`) en transacción atómica, selección de medio de pago (Mercado Pago / Efectivo), y rechazo automático de cotizaciones no ganadoras al momento de la aceptación (`HU-29` a `HU-32`, `HU-72`).
8. **Agenda de Turnos (`appointments` separada, desacoplada del pago):** Creación inmediata del turno al aceptar oferta (sin esperar pago), estados independientes del turno (`CONFIRMED` → `IN_PROGRESS` → `COMPLETED` / `CANCELLED`), insignias de estado de turno y pago renderizadas de forma independiente, botón "Confirmar cobro en efectivo" para el Profesional, apartados de *Próximos* y *Pasados* para cliente y profesional, detalle compartido con revelación de datos de contacto (`HU-40` a `HU-47`, `HU-72`).
9. **Integración con Pasarela de Pagos y Medios de Cobro:** Cobro de seña mediante Mercado Pago o Efectivo (desacoplado del turno), segundo cobro por saldo remanente al completarse la visita, procesamiento de webhooks HTTPS que actualiza **únicamente** `payments` (no `appointments`), confirmación manual de cobro en efectivo por el Profesional, plazo de reintento para cobros rechazados, expiración programada y rutas de respuesta. Máquina de estados del pago independiente: `PENDING` → `PROCESSING` → `PAID` | `REJECTED` | `CANCELLED` | `REFUNDED` (`HU-33` a `HU-39`, `HU-72`).
10. **Notificaciones In-App:** Ícono con campana superior en cabezal y menú flotante (dropdown) con notificaciones y lectura por ítem o masiva, cubriendo los 7 eventos estipulados (`HU-48` a `HU-57`).
11. **Chatbot FAQ (MVP 1.0):** Asistente flotante accesible globalmente sin consumo de LLM externo, basado en árbol jerárquico de preguntas y respuestas en SQL, respuestas en formato de chat y alternativa por defecto (`HU-58` a `HU-61`).
12. **Dashboard de Administrador:** Panel protegido para super-admin para buscar cuentas, suspender/reactivar accesos, supervisar todas las tareas, moderar oculta o definitivamente publicaciones y consultar indicadores (KPIs) e historial exportable de cobros con filtro por medio de pago (`HU-62` a `HU-68`).
