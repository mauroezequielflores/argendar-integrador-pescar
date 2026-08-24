# Preguntas Abiertas y Decisiones Pendientes — Argendar

**Origen:** Auditoría de [prompt_maestro.md](file:///wsl.localhost/Ubuntu/home/maur/argendar/argendar-integrador-pescar/docs/prompt_maestro.md)
**Objetivo:** Resolver estas definiciones **antes** de ejecutar la generación del Product Backlog y User Story Map para evitar ambigüedades.

---

## 1. Flujo Post-Aceptación y Agenda

> [!IMPORTANT]
> Estas preguntas definen el corazón de la conversión del marketplace: qué pasa entre que el cliente acepta una cotización y el turno aparece como "agendado".

| # | Pregunta | Opciones sugeridas | Decisión |
|---|----------|--------------------|----------|
| 1.1 | **¿La fecha/hora propuesta por el profesional en su cotización se convierte automáticamente en el turno confirmado?** | **A)** Sí, automáticamente al aceptar. **B)** No, requiere una confirmación adicional del profesional antes de agendar. | __________ |
| 1.2 | **¿Existe una tabla `appointments` separada o el turno agendado se modela dentro de `job_requests` con estado `ACCEPTED`?** | **A)** Tabla `appointments` separada (normalizado).  | __________ |
| 1.3 | **¿El profesional puede proponer una contra-oferta de fecha/hora si el cliente pidió una distinta?** | **A)** Sí, el profesional propone su propia fecha y horaen la cotización respetando las preferencias del cliente que indico al crear el pedido.  | __________ |
| 1.4 | **¿Qué pasa con las demás cotizaciones cuando el cliente acepta una?** | **A)** Se rechazan automáticamente y se notifica a los profesionales. | __________ |

---

## 2. Pasarela de Pagos (Mercado Pago)

> [!WARNING]
> Estas decisiones impactan directamente las HU de pagos, los webhooks y el flujo de estados del pedido.

| # | Pregunta | Opciones sugeridas | Decisión |
|---|----------|--------------------|----------|
| 2.1 | **¿Cuándo se cobra al cliente?** | **C)** Seña al aceptar + pago restante al completar (dos transacciones). | __________ |
| 2.2 | **¿Cuál es el monto de la seña?** (si aplica) | **C)** Lo define el profesional en su cotización. | __________ |
| 2.3 | **¿Quién recibe el dinero?** | **C)** En el MVP el pago va a una cuenta de la plataforma y el settlement es manual. | __________ |
| 2.4 | **¿Qué pasa si el pago falla (`rejected`)?** | **C)** Se le da un plazo de X horas para reintentar antes de liberar. | __________ |
| 2.5 | **¿Se contempla reembolso en caso de cancelación post-pago?** | **C)** No en el MVP, se gestiona manualmente. | __________ |

---

## 3. Máquina de Estados del Pedido (`job_requests`)

> [!NOTE]
> Ya se aplicaron los estados `PUBLISHED`, `HAS_OFFERS`, `ACCEPTED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`. Quedan estas definiciones complementarias:

| # | Pregunta | Opciones sugeridas | Decisión |
|---|----------|--------------------|----------|
| 3.1 | **¿Quién puede marcar un pedido como `IN_PROGRESS`?** | **A)** El profesional cuando llega al domicilio.  | __________ |
| 3.2 | **¿Quién puede marcar un pedido como `COMPLETED`?** |  **B)** El cliente confirma que el servicio se realizó. | __________ |
| 3.3 | **¿Quién puede cancelar y en qué momentos?** | **C)** Ambas partes sin restricciones en el MVP. | __________ |
| 3.4 | **¿Existe un estado `EXPIRED` para tareas sin cotizaciones tras X días?** | **B)** No, el cliente cancela manualmente si quiere. | __________ |

---

## 4. Dashboard de Administrador

| # | Pregunta | Opciones sugeridas | Decisión |
|---|----------|--------------------|----------|
| 4.1 | **¿El Admin puede gestionar los rubros y preguntas del cuestionario dinámico desde el panel?** | **B)** No, los rubros y preguntas se definen en código/BD y solo un desarrollador los cambia. | __________ |
| 4.2 | **¿El Admin puede intervenir en disputas entre Cliente y Profesional?** | **B)** No en el MVP, disputas se resuelven fuera de la plataforma. | __________ |
| 4.3 | **¿Cuántos usuarios tendrán rol Admin?** (impacta la complejidad de permisos) | **A)** Un solo super-admin (el equipo fundador). | __________ |

---

## 5. Chatbot / IA

| # | Pregunta | Opciones sugeridas | Decisión |
|---|----------|--------------------|----------|
| 5.1 | **¿El chatbot está confirmado para Release 1.1 (no MVP)?** |  **B)** Queremos un chatbot FAQ básico ya en el MVP. | __________ |
| 5.2 | **¿El chatbot tendrá acceso a datos del usuario?** (ej. "¿Cuándo es mi próximo turno?") | **A)** No, solo responde FAQs genéricas. | __________ |
| 5.3 | **¿Se usará un LLM externo (OpenAI/Gemini) o un flujo de decisión tipo árbol?** | **A)** Árbol de decisión con intents predefinidos (sin costo de API), podria llegar a implementarse algun LLM externo con restricciones. | __________ |

---

## 6. Notificaciones

| # | Pregunta | Opciones sugeridas | Decisión |
|---|----------|--------------------|----------|
| 6.1 | **¿Qué canal de notificaciones se usa en el MVP?** | **A)** Solo notificaciones in-app (dentro de la plataforma).| __________ |
| 6.2 | **¿Se contemplan notificaciones push (móvil/browser) en el MVP?** |  **B)** Sí, notificaciones dentro de la aplicación mediante una campana desplegable. | __________ |
| 6.3 | **¿Cuáles son los eventos que disparan notificación?** Marcá todos los que apliquen: 
|     Si☐ Nueva cotización recibida (al Cliente) | |
| | | Si☐ Cotización aceptada (al Profesional) | |
| | | Si☐ Cotización rechazada (al Profesional) | |
| | |Si☐ Pago confirmado (a ambos) | |
| | | Si☐ Recordatorio 24h antes del turno (a ambos) | |
| | | Si☐ Trabajo marcado como completado (al Cliente) | |
| | | Si☐ Pedido cancelado (a la contraparte) | |

---

## Instrucciones

> [!TIP]
> Completá la columna **Decisión** de cada tabla con la letra de la opción elegida (A, B, C...) o escribí tu propia respuesta si ninguna opción encaja. Una vez completado, devolvé este documento y actualizaré `prompt_maestro.md` con las definiciones finales antes de lanzar la generación.
