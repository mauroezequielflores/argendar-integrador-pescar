# 🔔 Módulo 03: Notificaciones (General y Profesional)

## 📋 Resumen del Módulo
Provee un sistema de alertas y notificaciones in-app centralizado en la barra superior (Header) que informa al Profesional en tiempo real sobre los eventos clave de su actividad (cotizaciones aceptadas, ofertas rechazadas en lote al elegirse otro postulante, confirmación de pagos de seña y saldo, recordatorios automáticos 24 horas previas a la cita y cancelaciones de pedidos).

### 🎯 Historias de Usuario Cubiertas
* **`HU-48`:** Campana In-App con badge y contador dinámico de no leídas.
* **`HU-49`:** Dropdown desplegable (`<NotificationDropdown>`) con historial de alertas.
* **`HU-51`:** Notificación: Cotización aceptada por el cliente.
* **`HU-52`:** Notificación: Cotización rechazada en lote (tarea asignada a otro profesional).
* **`HU-53`:** Notificación: Acreditación de pago de seña o saldo.
* **`HU-54`:** Notificación: Recordatorio de servicio técnico 24 horas antes.
* **`HU-56`:** Notificación: Cancelación de pedido por parte del cliente.
* **`HU-57`:** Acción de marcar notificación individual o todas como leídas.

---

## 📁 Archivos y Reportes de este Módulo

1. 📄 **[Reporte de Especificación Técnica: Notificaciones Profesional](./Reporte_Especificacion_Notificaciones_Profesional.md)**
   * Arquitectura de notificaciones transaccionales disparadas por el backend.
   * Inserción masiva en batch para `proposal_rejected`.
   * Contratos de endpoints REST (`GET /notifications`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`).
   * Componentes visuales (`HU-48` Campana, `HU-49` Dropdown).
   * Actualización optimista de UI y redirecciones inteligentes al turno/cotización.
