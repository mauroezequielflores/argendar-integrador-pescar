# CONTEXTO Y ROL
Actúa como un equipo combinado de Lead Product Owner, Fullstack Software Architect (React + Node.js) y Lead DevOps Engineer especializado en productos SaaS web y marketplaces On-Demand desplegados en la nube, usando Supabase PostgreSQL e integraciones con Mercado Pago.

# OBJETIVO
Ejecutar un proceso de análisis iterativo (Loop de 3 fases) para generar el reporte completo del Product Backlog, la arquitectura técnica y la matriz de User Story Mapping para la plataforma "Argendar", estructurada como un Marketplace de Solicitudes y Cotizaciones para servicios técnicos (inicialmente Frigoristas, Plomeros y Electricistas) orientada a un despliegue en producción en la nube.

### NOTA CLAVE: Pivote del Modelo de Negocio
**Modelo anterior (descartado):** Argendar funcionaba como una plataforma de reserva directa: el cliente buscaba un profesional en un catálogo, veía sus horarios disponibles y agendaba un turno directamente. El flujo era: **Buscar → Seleccionar turno → Pagar → Turno agendado**.

**Modelo nuevo (vigente para este backlog):** Argendar ahora opera como un **Marketplace de Solicitudes y Cotizaciones**. El flujo se invierte: el cliente publica una necesidad/tarea, los profesionales la ven y envían cotizaciones, y el cliente elige la mejor oferta. El flujo es: **Publicar tarea → Recibir cotizaciones → Comparar → Aceptar oferta → Turno agendado + Pago**.

> ⚠️ **Directiva para el agente:** Todas las HU, componentes y endpoints generados deben seguir exclusivamente el modelo de Marketplace de Solicitudes y Cotizaciones. No generar HU de catálogo de profesionales con selección directa de turno, ni matrices de horarios semanales configuradas por el profesional.

---

## STACK TECNOLÓGICO Y ARQUITECTURA DE DESPLIEGUE
- **Frontend:** React (JavaScript).
- **Backend:** Node.js (API REST).
- **Base de datos & Servicios:** Supabase (PostgreSQL, Supabase Auth, Supabase Storage para fotos de trabajos, RLS).
- **Integraciones:** Pasarela de pagos Mercado Pago (Checkout Pro / Webhooks) y Chatbot/IA.
- **Entorno / Despliegue:** Despliegue en producción en la nube (Vercel/Render/Railway/Supabase Cloud), considerando CORS, variables de entorno (`.env`), tokens JWT y endpoints HTTPS para webhooks.

---

## INPUTS DEL PROYECTO (Scope del MVP - Marketplace de Cotizaciones)
Las funcionalidades a cubrir en el reporte son:
1. **Roles del sistema:** Cliente, Profesional y Administrador.
2. **Registro diferenciado:** Registro y login para Cliente y Profesional.
3. **Autenticación:** Gestionada mediante Supabase PostgreSQL (Email/Password, Supabase Auth).
4. **Onboarding Profesional:** Completado de perfil profesional (rubros iniciales: Frigoristas, Plomeros, Electricistas; zonas de cobertura y datos de contacto).
5. **Flujo de Publicación de Tarea (Cliente):**
   - Confirmación de ubicación/dirección del servicio.
   - Selección de rubro/elemento averiado.
   - Cuestionario dinámico según el servicio (preguntas específicas como tipo de equipo, frigorías, ubicación, fecha deseada y franja horaria).
   - Carga de imágenes/fotos del problema (almacenamiento en Supabase Storage).
   - Pantalla de resumen y confirmación con botón "Publicar tarea".
6. **Feed y Explorador de Trabajos (Profesional):** Visualización de publicaciones abiertas por clientes, filtrables por zona y rubro, con detalle completo de fotos y respuestas del cuestionario.
7. **Sistema de Cotizaciones/Propuestas (Profesional):** Envío de oferta detallada por parte del profesional (precio estimado, monto de seña propuesto, propuesta de fecha/hora respetando las preferencias del cliente, perfil y calificación).
8. **Comparación y Aceptación de Ofertas (Cliente):** Visualización de múltiples propuestas de profesionales para una misma tarea, comparación y aceptación por parte del cliente.
   **8b. Flujo Post-Aceptación (Transición Cotización → Turno Agendado — Desacoplado del Pago):**
   - Al aceptar una cotización, el sistema ejecuta de forma **inmediata y atómica** dos acciones simultáneas:
     - **Crea un registro en `appointments`** con estado `CONFIRMED` usando la fecha/hora propuesta por el profesional en su cotización.
     - **Crea un registro en `payments`** con estado `PENDING` vinculado al turno recién creado.
   - El turno (`CONFIRMED`) aparece inmediatamente en "Mi Agenda" tanto del Cliente como del Profesional, **sin esperar la confirmación del pago**.
   - Las demás cotizaciones pendientes para esa tarea se rechazan automáticamente al momento de la aceptación y se notifica a los profesionales descartados.
   - El estado del pedido cambia a `ACCEPTED` al aceptar la oferta (no al confirmarse el pago).
   - **Selección de medio de pago:** La UI ofrece al cliente la opción de pagar vía Mercado Pago (digital) o Efectivo:
     - **Pagos digitales (Mercado Pago / Tarjetas):** Se genera la preferencia de Checkout Pro y el sistema aguarda el webhook para actualizar `payments.status` a `PAID`.
     - **Pago en efectivo:** El pago permanece en `PENDING` hasta que el Profesional confirma manualmente la recepción del dinero mediante el botón "Confirmar cobro en efectivo", cambiando `payments.status` a `PAID`.
   - La confirmación del pago en cualquier modalidad actualiza únicamente `payments.status` a `PAID`, **sin alterar** el estado `CONFIRMED` del turno.
   - **Pago restante:** Al completarse el servicio (`COMPLETED`), se genera una segunda transacción por el saldo restante (precio total − seña) con la misma lógica de medios de pago.
9. **Sección "Mi Agenda":** Vista de trabajos agendados/confirmados (consultando la tabla `appointments`), historial y detalle de turnos para Cliente y Profesional.
10. **Sistema de Notificaciones:**
    - **Canal MVP:** Solo notificaciones in-app mediante un ícono de campana desplegable (dropdown) visible en todas las pantallas.
    - **Eventos que disparan notificación:**
      - Nueva cotización recibida → al Cliente.
      - Cotización aceptada → al Profesional.
      - Cotización rechazada → al Profesional.
      - Pago confirmado → a ambos (Cliente y Profesional).
      - Recordatorio 24h antes del turno → a ambos.
      - Trabajo marcado como completado → al Cliente.
      - Pedido cancelado → a la contraparte.
    - **Modelo de datos:** Tabla `notifications` con campos: `id`, `user_id`, `type` (enum de eventos), `title`, `message`, `read` (boolean), `related_entity_id`, `created_at`.
11. **Chatbot / IA (incluido en MVP - Release 1.0):**
    - Asistente virtual tipo widget flotante disponible en todas las pantallas de la aplicación.
    - **Alcance funcional MVP:** Responde únicamente preguntas frecuentes (FAQ) genéricas sobre el uso de la plataforma. **No** tiene acceso a datos personalizados del usuario (no puede responder "¿cuándo es mi próximo turno?").
    - **Stack MVP:** Flujo de decisión basado en árbol de intents predefinidos (sin costo de API externa). En releases futuros se evalúa integración con API de LLM (Gemini/OpenAI) con restricciones de uso.
12. **Dashboard de Administrador:**
    - **Modelo de permisos:** Un único super-admin (equipo fundador). No se implementan roles diferenciados de administración en el MVP.
    - **Gestión de usuarios:** Listado, búsqueda, y capacidad de suspender/reactivar cuentas de Clientes y Profesionales.
    - **Moderación de publicaciones:** Visualización de todas las tareas publicadas con capacidad de ocultar o eliminar publicaciones que violen las normas de uso.
    - **Rubros y categorías:** Los rubros y preguntas del cuestionario dinámico se definen en código/BD y solo un desarrollador los modifica. **No** hay CRUD de rubros en el panel de Admin en el MVP.
    - **Disputas:** No se gestionan dentro de la plataforma en el MVP. Las disputas entre Cliente y Profesional se resuelven fuera de la plataforma.
    - **Métricas clave (KPIs):** Total de tareas publicadas, tasa de conversión (publicadas → aceptadas), cantidad de profesionales activos, revenue por señas cobradas, y promedio de cotizaciones por tarea.
    - **Historial de pagos:** Consulta de transacciones de Mercado Pago con estado y monto.
13. **Pasarela de Pagos y Medios de Cobro:**
    - **Modelo de cobro (dos transacciones, desacopladas del turno):**
      - **Seña (al aceptar cotización):** Se cobra al cliente el monto de seña definido por el profesional en su cotización. **El turno se crea inmediatamente al aceptar la oferta sin esperar el pago** (ver §8b).
      - **Saldo restante (al completar servicio):** Una vez que el cliente marca el servicio como `COMPLETED`, se genera una segunda transacción por el monto restante (precio total − seña).
    - **Medios de pago soportados (MVP):**
      - **Mercado Pago Checkout Pro (digital):** Redirect a la pasarela. El backend genera la `preference` con `back_urls` y `notification_url` (webhook HTTPS). Al confirmarse vía webhook, `payments.status` → `PAID`.
      - **Efectivo:** El pago se registra con `payment_method = 'CASH'` y permanece en `PENDING` hasta que el Profesional asignado presiona el botón "Confirmar cobro en efectivo" desde la vista del turno. Solo el `professional_id` del turno puede ejecutar esta acción.
    - **Receptor del dinero:** En el MVP, todos los pagos digitales van a una cuenta de la plataforma. El settlement (transferencia al profesional) se gestiona manualmente fuera de la plataforma.
    - **Máquina de estados del Pago (`payments.status`):** `PENDING` → `PROCESSING` → `PAID` | `REJECTED` | `CANCELLED` | `REFUNDED`. Los estados del pago son independientes de los estados del turno.
    - **Webhook events a procesar:** `payment.created`, `payment.updated` → el backend valida el `status` (`approved`, `rejected`, `pending`) y actualiza **únicamente** el registro en `payments`, sin alterar `appointments.status`.
    - **Flujo de fallo:** Si el pago es `rejected`, el turno se mantiene en estado `CONFIRMED` y se le otorga al cliente un **plazo de reintento** (configurable, ej. 24 horas). Vencido el plazo sin pago aprobado, se evalúa la cancelación del turno.
    - **Reembolsos:** No se contemplan reembolsos automáticos en el MVP. Cualquier devolución se gestiona manualmente fuera de la plataforma.
    - **Auditoría:** Todas las transacciones y cambios de estado en `payments` generan registros de auditoría.

---

## INSTRUCCIONES DE EJECUCIÓN DEL LOOP (Fases de procesamiento)

### 🔄 FASE 1: Análisis y Redacción del Borrador (Generación)
- Diseña el **Backbone del User Story Map**: Define las Épicas/Actividades de usuario y Tareas de usuario secuenciales para los 3 roles (Cliente, Profesional, Admin) siguiendo el flujo del marketplace.
- Escribe el listado crudo de Historias de Usuario (HU) asegurando cubrir todos los puntos del MVP sin omitir ninguno.

### 🔍 FASE 2: Crítica de Calidad y Refinamiento Técnico Fullstack (Revisión)
Analiza el borrador generado en la Fase 1 y aplica los siguientes filtros de control:
1. **Formato Estándar:** Reescribe cada HU bajo la estructura: *Como [Rol], quiero [Funcionalidad] para [Beneficio]*.
2. **Criterios de Aceptación:** Agrega mínimo 3 criterios de aceptación verificables por cada HU.
3. **Detalle Técnico Fullstack:** Especifica componentes de React (JS), endpoints en Node.js, esquema en Supabase PostgreSQL (tablas como `job_requests`, `proposals`, `job_photos`, políticas RLS, buckets de Storage) y logística de pagos/webhooks de Mercado Pago.
4. **Consideraciones de Despliegue:** Contempla tokens JWT, variables `.env`, políticas CORS, manejo de archivos multimedia en producción y estados del ciclo de vida del pedido (`PUBLISHED`, `HAS_OFFERS`, `ACCEPTED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).
5. **Máquinas de Estados Desacopladas:** Validar que las transiciones sigan estas reglas independientes:
   
   **5a. Máquina de Estados del Pedido (`job_requests.status`):**
   - `PUBLISHED` → `HAS_OFFERS` (automático al recibir la primera cotización).
   - `HAS_OFFERS` → `ACCEPTED` (al aceptar cotización — se crea turno y pago simultáneamente).
   - `ACCEPTED` → `IN_PROGRESS` (el **profesional** lo marca cuando llega al domicilio/inicia el trabajo).
   - `IN_PROGRESS` → `COMPLETED` (el **cliente** confirma que el servicio se realizó correctamente).
   - `PUBLISHED` / `HAS_OFFERS` / `ACCEPTED` / `IN_PROGRESS` → `CANCELLED` (ambas partes pueden cancelar sin restricciones en el MVP).
   - **No** existe estado `EXPIRED`. Si una tarea no recibe cotizaciones, el cliente la cancela manualmente.
   
   **5b. Máquina de Estados del Turno (`appointments.status`) — Independiente del pago:**
   - `PENDING` | `CONFIRMED` | `RESCHEDULED` | `IN_PROGRESS` | `COMPLETED` | `CANCELLED`
   - Al aceptar una oferta, el turno se crea directamente en estado `CONFIRMED`.
   - El estado del turno **no depende** del estado del pago. Un turno `CONFIRMED` puede coexistir con un pago `PENDING`.
   
   **5c. Máquina de Estados del Pago (`payments.status`) — Independiente del turno:**
   - `PENDING` | `PROCESSING` | `PAID` | `REJECTED` | `CANCELLED` | `REFUNDED`
   - El pago se crea con estado `PENDING` al aceptar la oferta.
   - **Pagos digitales (MP):** El webhook actualiza a `PAID` al recibir confirmación.
   - **Pago en efectivo:** El Profesional confirma manualmente la recepción, cambiando a `PAID`.
   - La confirmación del pago **no altera** el estado del turno.

6. **Modelo de Datos Clave:** Verificar la existencia y relación de las tablas `job_requests`, `proposals`, `appointments` (tabla separada para turnos agendados, vinculada a `job_requests` y `proposals`), `notifications`, `job_photos`, y `payments` (tabla separada con FK `appointment_id` vinculando al turno, además de `job_request_id` y `proposal_id` para trazabilidad).

### 📊 FASE 3: Consolidación y Formato Final (Salida)
Organiza toda la información procesada en la estructura final del reporte que se especifica abajo.

> **DIRECTIVA CRÍTICA:** NO resumas, NO omitas, NO compactes información. Cada Historia de Usuario del backlog DEBE tener su ficha completa con TODOS los campos del formato especificado (narrativa, criterios de aceptación y desglose técnico fullstack). Si el reporte es extenso, eso es correcto y esperado. Privilegia la exhaustividad sobre la brevedad.

---

## FORMATO DE SALIDA REQUERIDO EN EL REPORTE FINAL

Genera el reporte final estructurado estrictamente con las siguientes 3 secciones:

### 1. Matriz de User Story Map
Presenta una tabla o diagrama textual organizado en:
- **Eje Horizontal:** Flujo de usuario (Publicación -> Feed/Cotización -> Comparación/Aceptación -> Ejecución/Agenda).
- **Eje Vertical:** 
  - *Corte MVP (Release 1.0):* Funcionalidades esenciales para operar los 3 rubros iniciales.
  - *Corte Fase 1.1 / Futuro:* Funcionalidades avanzadas diferidas (ej. Chat en vivo, filtros complejos, pagos por hito).

### 2. Tabla Resumen del Product Backlog
Una tabla general con las columnas:
`| ID HU | Épica | Nombre de la Historia | Rol | Prioridad (Must/Should/Could) | Estimación (Pts) | Release |`

### 3. Fichas Detalladas de Historias de Usuario
Para **cada una** de las Historias de Usuario del backlog, genera la siguiente ficha:

---
#### [ID_HU] - [Nombre de la Historia]
* **Rol:** [Cliente / Profesional / Administrador]
* **Épica:** [Nombre de la Épica]
* **Prioridad:** [Must Have / Should Have / Could Have]
* **Narrativa:**
  * **Como** [Rol]
  * **Quiero** [Acción/Funcionalidad]
  * **Para** [Beneficio/Objetivo]
* **Criterios de Aceptación:**
  1. [Criterio 1]
  2. [Criterio 2]
  3. [Criterio 3]
* **Desglose Técnico Fullstack:**
  * **Frontend (React JS):** [Componentes, vistas, formularios dinámicos, subida de archivos]
  * **Backend (Node.js):** [Endpoints, controladores, servicios REST]
  * **Base de Datos & Storage (Supabase):** [Tablas, claves foráneas, políticas RLS, buckets de Storage]
  * **Despliegue / Integración:** [Webhooks de Mercado Pago, variables `.env`, servidor en producción]
---