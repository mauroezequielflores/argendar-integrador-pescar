# 📅 Módulo 06: Turnos y Agenda (Rol Cliente)

## 📋 Resumen del Módulo
Ofrece al Cliente un panel integrado (**"Mi Agenda"**) para supervisar sus turnos de servicio técnico agendados, consultar el detalle del turno y del profesional asignado, solicitar la cancelación si es necesario, confirmar la finalización del trabajo (liberando el cobro del saldo remanente a través de Mercado Pago) y acceder a un historial inmutable de servicios terminados o cancelados.

### 🎯 Historias de Usuario Cubiertas
* **`HU-40`:** Supervisión y control integral de citas agendadas.
* **`HU-41`:** Pantalla "Mi Agenda" del Cliente (pestañas de Actividad e Historial).
* **`HU-43`:** Detalle completo del turno (profesional, teléfono visible post-seña, saldo pendiente).
* **`HU-45`:** Confirmación de trabajo finalizado con liquidación del saldo restante vía Mercado Pago.
* **`HU-46`:** Cancelación justificada de turno con aviso al profesional.
* **`HU-47`:** Historial de turnos finalizados o cancelados con datos congelados.
* **`HU-72`:** Validación del reporte de cierre emitido por el profesional.

---

## 📁 Archivos y Reportes de este Módulo

1. 📄 **[Reporte de Especificación Técnica: Turnos Cliente](./Reporte_Especificacion_Turnos_Cliente.md)**
   * Contratos de endpoints REST (`GET /appointments`, `POST /confirm-completion`, `POST /cancel`).
   * Flujo de liquidación del saldo final mediante checkout / cobro diferido en Mercado Pago.
   * Componentes de pantalla (`HU-41` Mi Agenda, `HU-43` Detalle, Modal `HU-46`).
   * Políticas de seguridad RLS por `client_id = auth.uid()`.
   * Matriz de estados y transiciones de turnos.
