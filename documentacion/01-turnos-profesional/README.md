# 📅 Módulo 01: Turnos y Agenda (Rol Profesional)

## 📋 Resumen del Módulo
Permite que los profesionales de servicios técnicos administren integralmente sus turnos asignados desde su panel principal **"Mi Agenda"**, marcando el inicio del servicio ("En progreso"), consultando la ficha de diagnóstico completa y los datos de contacto del cliente (visibles únicamente post-seña), solicitando el cierre del trabajo realizado, gestionando cancelaciones justificadas y consultando el historial de actividades finalizadas o canceladas.

### 🎯 Historias de Usuario Cubiertas
* **`HU-40`:** Gestión integral de turnos confirmados y en curso.
* **`HU-42`:** Pantalla "Mi Agenda" del Profesional (Actividad, Ofertas Pendientes e Historial).
* **`HU-43`:** Detalle completo del turno (diagnóstico, cliente post-seña, montos de seña y saldo).
* **`HU-44`:** Acción de marcar servicio "En progreso" el día de la cita.
* **`HU-46`:** Cancelación justificada de turnos con notificación automática.
* **`HU-47`:** Historial de turnos finalizados y cancelados con datos congelados.
* **`HU-72`:** Solicitud de cierre de trabajo realizado para habilitar la liquidación final.

---

## 📁 Archivos y Reportes de este Módulo

1. 📄 **[Reporte de Especificación Técnica: Turnos Profesional](./Reporte_Especificacion_Turnos_Profesional.md)**
   * Objetivos, actores y puntos de entrada al flujo.
   * Contratos de Request/Response de la API REST (`GET /appointments`, `GET /appointments/:id`, `PATCH /in-progress`, `PATCH /request-completion`, `POST /cancel`).
   * Políticas RLS y validaciones del backend.
   * Especificación visual de pantallas (`HU-42`, `HU-43`, Modal `HU-46`).
   * Matriz de estados y ciclo de vida del turno.
   * Reglas de negocio e interacciones del usuario.
