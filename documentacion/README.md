# 📚 Documentación Técnica Integral — Argendar

Bienvenido a la documentación oficial del sistema **Argendar (Plataforma Integrada de Servicios Técnicos)**. Este repositorio centraliza todos los reportes de especificación funcional, diseño técnico, arquitectura backend, esquemas de persistencia en Supabase PostgreSQL, colecciones de pruebas y reportes de QA automatizado, organizados de forma modular.

---

## 🗂️ Estructura de Módulos

La documentación se encuentra segmentada por módulo y ámbito funcional:

| Módulo | Directorio | Historias de Usuario | Roles Involucrados | Reportes Incluidos |
| :--- | :--- | :--- | :--- | :--- |
| **00. Registro y Autenticación** | [`00-autenticacion-y-registro`](./00-autenticacion-y-registro/) | `HU-01` a `HU-05` | Cliente, Profesional, Admin | Especificación Backend (`EP-AUTH`), Reporte QA Automation (33 tests), Colección Postman v2.1 |
| **01. Turnos (Profesional)** | [`01-turnos-profesional`](./01-turnos-profesional/) | `HU-40`, `HU-42`, `HU-43`, `HU-44`, `HU-46`, `HU-47`, `HU-72` | Profesional | Especificación funcional y técnica de Mi Agenda (Profesional) |
| **02. Perfil Profesional** | [`02-perfil-profesional`](./02-perfil-profesional/) | `HU-02`, `HU-07`, `HU-08`, `HU-09`, `HU-10` | Profesional, Cliente | Wizard de Onboarding (3 pasos), Perfil Público, Calificaciones |
| **03. Notificaciones Profesional** | [`03-notificaciones-profesional`](./03-notificaciones-profesional/) | `HU-48`, `HU-49`, `HU-51`, `HU-52`, `HU-53`, `HU-54`, `HU-56`, `HU-57` | Profesional | Campana In-App, Dropdown, Eventos de cotización, pagos y alertas |
| **04. Marketplace (Cliente)** | [`04-marketplace-cliente`](./04-marketplace-cliente/) | `HU-11` a `HU-20`, `HU-29` a `HU-39` | Cliente, Profesional | Publicación de tareas, cuestionario dinámico, comparador de ofertas, Checkout Mercado Pago |
| **05. Perfil (Cliente)** | [`05-perfil-cliente`](./05-perfil-cliente/) | `HU-01`, `HU-03`, `HU-04`, `HU-05`, `HU-06` | Cliente | Registro, login, redirección a tareas, gestión de datos personales |
| **06. Turnos (Cliente)** | [`06-turnos-cliente`](./06-turnos-cliente/) | `HU-40`, `HU-41`, `HU-43`, `HU-45`, `HU-46`, `HU-47`, `HU-72` | Cliente | Mi Agenda (Cliente), confirmación de cierre, liquidación de saldo MP, historial |
| **07. Notificaciones (Cliente)** | [`07-notificaciones-cliente`](./07-notificaciones-cliente/) | `HU-48`, `HU-49`, `HU-50`, `HU-53`, `HU-54`, `HU-55`, `HU-56`, `HU-57` | Cliente | Campana In-App, avisos de propuestas, confirmación de pagos y saldo pendiente |
| **Transversal y Arquitectura** | [`transversal-y-arquitectura`](./transversal-y-arquitectura/) | Todas (`HU-01` a `HU-72`) | Todos | User Story Mapping MVP, Definiciones de Negocio, Prompt Maestro, Reporte Consolidado |

---

## 🚀 Arquitectura General del Sistema

- **Backend:** Node.js + Express (API RESTful modular).
- **Base de Datos & Auth:** Supabase PostgreSQL con RLS (Row Level Security) nativo y Supabase Auth integrado.
- **Frontend:** React JS + Vite + Tailwind CSS / Vanilla CSS optimizado.
- **Pasarela de Pagos:** Mercado Pago (Checkout Pro y Webhooks transaccionales para cobro de Seña y Liquidación de Saldo).
- **Testing & QA:** Node.js Native Test Runner (`node:test`) + `supertest` + Suite Postman v2.1.
