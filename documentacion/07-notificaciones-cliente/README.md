# 🔔 Módulo 07: Notificaciones (Cliente)

## 📋 Resumen del Módulo
Alerta al Cliente de manera inmediata e in-app en la campana del header sobre eventos relevantes de sus solicitudes de servicio y turnos agendados (nueva cotización recibida, confirmación de pagos de seña o liquidación de saldo, recordatorio preventivo 24h previas a la visita, reporte de trabajo finalizado por el técnico para su validación y pago, y cancelaciones).

### 🎯 Historias de Usuario Cubiertas
* **`HU-48`:** Campana In-App con badge y contador de no leídas.
* **`HU-49`:** Dropdown desplegable (`<NotificationDropdown>`) con historial de notificaciones.
* **`HU-50`:** Notificación: Nueva cotización recibida en tarea publicada (con enlace directo al comparador).
* **`HU-53`:** Notificación: Pago de seña o saldo confirmado.
* **`HU-54`:** Notificación: Recordatorio de turno programado para mañana.
* **`HU-55`:** Notificación: Profesional reporta servicio completado (con enlace al turno para liquidar saldo).
* **`HU-56`:** Notificación: Pedido cancelado por el profesional técnico.
* **`HU-57`:** Marcar notificaciones individuales o masivamente como leídas.

---

## 📁 Archivos y Reportes de este Módulo

1. 📄 **[Reporte de Especificación Técnica: Notificaciones Cliente](./Reporte_Especificacion_Notificaciones_Cliente.md)**
   * Tipos de eventos y lógica de despacho transaccional desde backend.
   * Contratos de endpoints REST (`GET /notifications`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`).
   * Componentes de pantalla (`HU-48` Campana, `HU-49` Dropdown).
   * Redirecciones directas contextuales y actualización optimista de contadores.
