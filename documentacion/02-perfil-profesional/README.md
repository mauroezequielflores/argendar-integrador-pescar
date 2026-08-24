# 👷 Módulo 02: Perfil Profesional, Onboarding y Cobertura Geodésica

## 📋 Resumen del Módulo
Permite a los profesionales completar su perfil mediante un onboarding ágil en 2 pasos (datos básicos + rubros), fijar su ubicación base y radio de cobertura geodésica mediante Google Maps API (restringido a CABA y Provincia de Buenos Aires), y ofrecer un perfil público con calificaciones, insignias de matrícula y reseñas. La cobertura se calcula por distancia radial (Haversine) eliminando la selección manual de zonas.

### 🎯 Historias de Usuario Cubiertas
* **`HU-02`:** Registro inicial de cuenta profesional.
* **`HU-07`:** Onboarding Paso 1 — Teléfono validado, bio técnica (20–500 chars), ubicación Google Maps y radio de cobertura geodésica (1–50 km). Campos opcionales post-onboarding: avatar, disponibilidad, matrícula.
* **`HU-08`:** Onboarding Paso 2 — Selección de rubros técnicos (mín. 1) y activación de `onboarding_completo = true`.
* **`HU-10`:** Perfil público con reputación, rubros, cobertura y reseñas. Protección estricta de datos privados.

---

## 📁 Archivos del Módulo

1. 📄 **[Reporte de Especificación Técnica](./Reporte_Especificacion_Perfil_Profesional.md)**
   * Flujo de onboarding ágil en 2 pasos con campos MVP obligatorios y opcionales post-onboarding.
   * Selector de ubicación transversal con Google Maps API (CABA y PBA).
   * Algoritmo de matching geodésico (Haversine) y función SQL.
   * Contratos REST completos con request/response JSON para todos los endpoints.
   * Esquema DDL en español con CHECK constraints, seed de rubros y políticas RLS.
   * Validación de coordenadas en backend (bounds operativos CABA/PBA).
   * Suite completa de 25+ tests propuestos (E2E, privacidad, Haversine, Storage).
   * Especificaciones de Storage: límites de tamaño y formatos para avatares y certificados.
