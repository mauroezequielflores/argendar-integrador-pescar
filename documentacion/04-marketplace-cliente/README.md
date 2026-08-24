# 🛒 Módulo 04: Marketplace y Publicación de Tareas (Cliente)

## 📋 Resumen del Módulo
Permite a los clientes publicar solicitudes de servicios técnicos mediante un wizard guiado y estructurado (ubicación, rubro, cuestionario dinámico de diagnóstico, franja horaria preferida y fotos del problema), administrar sus publicaciones, recibir y comparar propuestas económicas lado a lado, aceptar la oferta más conveniente y concretar la reserva pagando la seña a través de la integración con Mercado Pago.

### 🎯 Historias de Usuario Cubiertas
* **`HU-11` a `HU-17`:** Wizard de Publicación de Tarea (Ubicación, Rubro, Cuestionario, Agenda, Fotos y Resumen).
* **`HU-18`:** Pantalla "Mis Tareas" con estados (`PUBLISHED`, `HAS_OFFERS`, `ACCEPTED`, `CANCELLED`).
* **`HU-19`:** Detalle de Tarea con cotizaciones recibidas.
* **`HU-20`:** Edición de Tarea publicada (mientras no tenga ofertas de profesionales).
* **`HU-29` y `HU-30`:** Comparador de Cotizaciones recibido y comparación lado a lado (rating, presupuesto, seña, notas).
* **`HU-31` y `HU-32`:** Aceptación de cotización elegida y rechazo automático del resto de propuestas.
* **`HU-33` a `HU-39`:** Generación de preferencia de cobro, Checkout de Seña con Mercado Pago, procesamiento de Webhooks y confirmación del turno agendado.

---

## 📁 Archivos y Reportes de este Módulo

1. 📄 **[Reporte de Especificación Técnica: Marketplace Cliente](./Reporte_Especificacion_Marketplace_Cliente.md)**
   * Ciclo de vida completo de la tarea y máquina de estados.
   * Contratos de endpoints REST (`POST /tasks`, `GET /tasks/my-tasks`, `POST /offers/:id/accept`, `POST /payments/checkout`).
   * Integración con la pasarela de pagos Mercado Pago (Checkout Pro y Webhooks).
   * Componentes del Wizard de 6 pasos y comparador lado a lado.
   * Transacciones atómicas de reserva y confirmación.
