# Reporte de Especificación Técnica — Módulo Marketplace (Cliente)

**Proyecto:** Argendar — Plataforma Integrada de Servicios Técnicos  
**Módulo:** Marketplace, Publicación de Tareas y Contratación  
**Historias de Usuario:** `HU-11` a `HU-20`, `HU-29` a `HU-39`  
**Roles Involucrados:** Cliente (Publicación y Pago) / Profesional (Cotización)  
**Versión:** 1.0.0  

---

## 1. Objetivo
Permitir a los clientes solicitar servicios técnicos publicando tareas mediante un wizard estructurado (ubicación, rubro, cuestionario dinámico, horarios y fotos), administrar sus publicaciones, recibir y comparar propuestas económicas de profesionales, aceptar la cotización óptima y concretar la reserva pagando la seña a través de Mercado Pago.

---

## 2. Usuarios Principales
* **Cliente**

---

## 3. Entrada al Flujo
* Botón **"Publicar Tarea"** desde la barra principal o la landing page.
* Sección **"Mis Tareas"** (`/tasks`) para consultar solicitudes creadas.

---

## 3.1 Contratos de la API REST (Backend Request / Response)

### A. Crear Tarea (`POST /api/v1/tasks`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `token` | JWT | Sí | Token del cliente autenticado |
| `zone_id` | UUID | Sí | ID de la localidad/barrio seleccionada |
| `address` | String | Sí | Dirección exacta de la visita técnica |
| `rubro_id` | UUID | Sí | ID del rubro del servicio técnico |
| `problem_type` | String | Sí | Tipo de falla o necesidad |
| `questionnaire_answers` | JSON | Sí | Respuestas al cuestionario dinámico del rubro |
| `preferred_date` | Date | Sí | Fecha deseada para la visita |
| `preferred_time_slot` | Enum | Sí | Franja horaria (`MORNING`, `AFTERNOON`, `EVENING`) |
| `photo_urls` | Array[String] | No | URLs de fotos cargadas sobre el problema |

### B. Consultar Mis Tareas (`GET /api/v1/tasks/my-tasks`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `token` | JWT | Sí | Token del cliente autenticado |
| `status` | Enum | No | Filtra por estado (`PUBLISHED`, `HAS_OFFERS`, `ACCEPTED`, `CANCELLED`) |

### C. Aceptar Cotización (`POST /api/v1/offers/:id/accept`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `proposalId` | UUID | Sí | Identificador de la propuesta elegida |
| `token` | JWT | Sí | Token del cliente autenticado |

### D. Crear Preferencia de Pago de Seña (`POST /api/v1/payments/checkout`)
| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `proposalId` | UUID | Sí | Identificador de la propuesta aceptada |
| `token` | JWT | Sí | Token del cliente |

**Validaciones del Backend:**
* Cuestionario dinámico validado según el esquema del rubro seleccionado.
* Edición de tarea únicamente permitida si `status = 'PUBLISHED'` (sin cotizaciones recibidas).
* Aceptar cotización genera transacción atómica: rechaza otras ofertas (`proposal_rejected`), reserva el turno y genera la preferencia de cobro de Mercado Pago.
* Procesamiento de Webhook MP (`APPROVED`) confirma la transacción y genera el turno formal en `appointments`.

---

## 4. Componentes de las Pantallas

### A. Wizard de Publicación de Tarea (HU-11 a HU-17)
* **Paso 1 — Ubicación (HU-11):** Campo de texto para dirección, selector de barrio/zona.
* **Paso 2 — Rubro y Problema (HU-12):** Selección de rubro técnico (Frigorista, Plomero, Electricista) y tipo de falla.
* **Paso 3 — Cuestionario Dinámico (HU-13):** Formulario generado dinámicamente según el rubro con preguntas específicas de diagnóstico.
* **Paso 4 — Fecha y Horario (HU-14):** Selector de fecha en calendario y franja horaria preferida.
* **Paso 5 — Carga de Fotos (HU-15):** Uploader de fotos con vista previa y opción de eliminar.
* **Paso 6 — Resumen y Publicación (HU-16, HU-17):** Ficha resumen de los datos ingresados y botón *"Confirmar y Publicar"*.

### B. Pantalla HU-18 — Mis Tareas Creadas
* Lista de tareas publicadas con badges de estado (`PUBLISHED`, `HAS_OFFERS`, `ACCEPTED`, `CANCELLED`) y contador de cotizaciones recibidas.

### C. Pantalla HU-29 y HU-30 — Comparador de Cotizaciones
* Vista de cotizaciones recibidas para una tarea.
* Botón *"Comparar Lado a Lado"* (HU-30) que despliega una tabla comparativa con: Nombre del profesional, Calificación en estrellas, Presupuesto total, Monto de seña, Fecha/hora propuesta y notas.
* Botón *"Aceptar Cotización"* por cada propuesta.

### D. Checkout y Resultado de Pago (HU-33, HU-39)
* Integración con Mercado Pago Checkout Pro / SDK.
* Pantalla HU-39 de resultado del pago: Indicador de aprobación/rechazo de seña y botón *"Ver Mi Agenda"*.

---

## 5. Matriz de Estados de la UI
* **Wizard:** Formularios por paso, Subiendo fotos (ProgressBar), Guardando tarea.
* **Tarea:** Publicada sin ofertas, Con cotizaciones recibidas, Cotización aceptada (esperando seña), Turno Agendado, Cancelada.
* **Pago:** Generando preferencia, Checkout MP en curso, Pago Aprobado, Pago Fallido / Reintento.

---

## 6. Requisitos y Reglas de Negocio
1. El Cuestionario Dinámico se ajusta estrictamente al rubro seleccionado.
2. Las tareas solo pueden editarse mientras no posean cotizaciones de profesionales.
3. La aceptación de una oferta exige el pago exitoso de la seña cotizada por el profesional para agendar formalmente el turno.
4. Si el cliente falla el pago de seña, se otorga un plazo de reintento antes de liberar la cotización.

---

## 7. Eventos del Usuario
* **Navegar en Wizard:** "Continuar" / "Volver".
* **Subir Fotos:** Selecciona archivos de imagen para adjuntar.
* **Click en "Comparar Cotizaciones":** Abre la vista comparativa lado a lado.
* **Click en "Aceptar Cotización":** Inicia la transacción de reserva y deriva al checkout de pago de seña.
