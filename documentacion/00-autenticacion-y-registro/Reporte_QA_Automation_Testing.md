# Reporte de QA Automation y Testing Backend — Argendar (EP-AUTH)

**Proyecto:** Argendar — Plataforma Integrada de Servicios Técnicos  
**Épica:** Registro y Autenticación (`EP-AUTH`)  
**Historias de Usuario Cubiertas:** `HU-01`, `HU-02`, `HU-03`, `HU-04`, `HU-05`  
**Base de Datos:** Supabase PostgreSQL (Cloud Managed)  
**Framework de Pruebas:** Node.js Native Test Runner (`node:test`) + `supertest` + `node:assert/strict`  
**Fecha de Ejecución:** Agosto 2026  
**Resultado Global:** ✅ **33/33 Tests Pasando (100% de Éxito)**

---

## 1. Resumen Ejecutivo de Cobertura de Pruebas

Se diseñó e implementó una suite completa de pruebas End-to-End (E2E) e integración que valida los flujos de registro, inicio de sesión, recuperación de contraseña y políticas de seguridad/middlewares directamente contra los endpoints de la API de Express y con persistencia real en la base de datos de Supabase PostgreSQL.

### Métricas de Ejecución
| Métrica | Valor |
| :--- | :--- |
| **Total de Suites de Prueba** | 3 suites (10 sub-suites) |
| **Total de Casos de Prueba (Tests)** | 33 casos |
| **Casos Exitosos (Pass)** | 33 (100%) |
| **Casos Fallidos (Fail)** | 0 (0%) |
| **Tiempo Total de Ejecución** | ~2.7 segundos |
| **Persistencia en BD Real** | Activa y verificada |

---

## 2. Detalle de Casos de Prueba Ejecutados

### 2.1. Registro de Usuarios (HU-01 y HU-02)
| ID Caso | Descripción del Caso | Endpoint | Payload / Condición | Status Esperado | Status Obtenido | Resultado |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: |
| **TC-REG-01** | Registro exitoso de Cliente con datos válidos | `POST /api/v1/auth/register` | Email dinámico, rol `client`, password fuerte | `201 Created` | `201 Created` | ✅ PASS |
| **TC-REG-02** | Registro exitoso de Profesional con onboarding pendiente | `POST /api/v1/auth/register` | Email dinámico, rol `professional`, `is_onboarding_complete = false` | `201 Created` | `201 Created` | ✅ PASS |
| **TC-REG-03** | Rechazo por correo electrónico ya registrado | `POST /api/v1/auth/register` | `test_permanente_cliente@argendar.com` | `409 Conflict` | `409 Conflict` | ✅ PASS |
| **TC-REG-04** | Rechazo por contraseña débil (< 8 car., sin mayús./núm.) | `POST /api/v1/auth/register` | Password: `"debil"` | `400 Bad Request` | `400 Bad Request` | ✅ PASS |
| **TC-REG-05** | Rechazo por campos obligatorios faltantes (nombre/apellido) | `POST /api/v1/auth/register` | `first_name: ""`, `last_name: ""` | `400 Bad Request` | `400 Bad Request` | ✅ PASS |
| **TC-REG-06** | Rechazo por formato de correo inválido (sin `@` o dominio) | `POST /api/v1/auth/register` | `email: "correo-invalido"` | `400 Bad Request` | `400 Bad Request` | ✅ PASS |

---

### 2.2. Inicio de Sesión (HU-03)
| ID Caso | Descripción del Caso | Endpoint | Payload / Condición | Status Esperado | Status Obtenido | Resultado |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: |
| **TC-LOG-01** | Login exitoso de Cliente Permanente con JWT | `POST /api/v1/auth/login` | `test_permanente_cliente@argendar.com` + `Password123!` | `200 OK` | `200 OK` | ✅ PASS |
| **TC-LOG-02** | Login exitoso de Profesional con estado de onboarding | `POST /api/v1/auth/login` | `test_permanente_profesional@argendar.com` + `Password123!` | `200 OK` | `200 OK` | ✅ PASS |
| **TC-LOG-03** | Rechazo por credenciales incorrectas (contraseña inválida) | `POST /api/v1/auth/login` | Email válido + Password errónea | `401 Unauthorized` | `401 Unauthorized` | ✅ PASS |
| **TC-LOG-04** | Rechazo por credenciales vacías | `POST /api/v1/auth/login` | `email: ""`, `password: ""` | `400 Bad Request` | `400 Bad Request` | ✅ PASS |
| **TC-LOG-05** | Rechazo de login para usuario suspendido (`is_suspended = true`) | `POST /api/v1/auth/login` | `test_suspendido@argendar.com` + `Password123!` | `403 Forbidden` | `403 Forbidden` | ✅ PASS |

---

### 2.3. Recuperación de Contraseña (HU-04)
| ID Caso | Descripción del Caso | Endpoint | Payload / Condición | Status Esperado | Status Obtenido | Resultado |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: |
| **TC-REC-01** | Solicitud de restablecimiento con correo registrado | `POST /api/v1/auth/recover-password` | `email: "test_permanente_cliente@argendar.com"` | `200 OK` | `200 OK` | ✅ PASS |
| **TC-REC-02** | Protección de privacidad y anti-enumeración de usuarios | `POST /api/v1/auth/recover-password` | Retorna mensaje genérico sin filtrar existencia | `200 OK` | `200 OK` | ✅ PASS |
| **TC-REC-03** | Rechazo de solicitud con formato de correo inválido | `POST /api/v1/auth/recover-password` | `email: "invalido"` | `400 Bad Request` | `400 Bad Request` | ✅ PASS |

---

### 2.4. Middlewares de Seguridad y Endpoints Protegidos
| ID Caso | Descripción del Caso | Endpoint | Header / Condición | Status Esperado | Status Obtenido | Resultado |
| :--- | :--- | :--- | :--- | :---: | :---: | :---: |
| **TC-SEC-01** | Obtener usuario actual con JWT válido | `GET /api/v1/auth/me` | `Authorization: Bearer <cliente_token>` | `200 OK` | `200 OK` | ✅ PASS |
| **TC-SEC-02** | Bloqueo de acceso sin token de autenticación | `GET /api/v1/auth/me` | Sin header Authorization | `401 Unauthorized` | `401 Unauthorized` | ✅ PASS |
| **TC-SEC-03** | Bloqueo de acceso con token inválido/malformado | `GET /api/v1/auth/me` | `Authorization: Bearer token_falso` | `401 Unauthorized` | `401 Unauthorized` | ✅ PASS |
| **TC-SEC-04** | Bloqueo a feed de solicitudes si el profesional no completó onboarding | `GET /api/v1/job-requests/feed` | `Authorization: Bearer <prof_token>` (`is_onboarding_complete = false`) | `403 Forbidden` (`ONBOARDING_INCOMPLETE`) | `403 Forbidden` | ✅ PASS |
| **TC-SEC-05** | Validación de restricción de roles (`requireRole`) | Middleware | Acceso exclusivo por rol permitido | `403 Forbidden` | `403 Forbidden` | ✅ PASS |

---

## 3. Evidencia de Datos de Prueba Persistidos en Base de Datos Real (Supabase)

A diferencia de suites convencionales con `teardown`, se ha aprovisionado y dejado persistido un catálogo diverso de **13 usuarios activos y especializados** en la base de datos de Supabase PostgreSQL para pruebas manuales, integración de frontend (marketplace, feed de profesionales, turnos) y validación de seguridad:

### Tabla de Credenciales y Perfiles en Base de Datos Real (Supabase)

| Rol / Perfil | Nombre Completo | Email | Password | UUID en Supabase | Onboarding | Suspendido | Especialidad / Notas |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **Cliente** | Carlos Paz | `test_permanente_cliente@argendar.com` | `Password123!` | `d62c9e22-74db-4647-932e-ec6aadc1f9c7` | N/A | No | Cliente permanente para tests E2E |
| **Cliente** | Sofía Martínez | `cliente.sofia@argendar.com` | `Password123!` | `c8525049-c441-4e73-8032-e56748ec4c78` | N/A | No | Propietaria en Belgrano, CABA |
| **Cliente** | Lucas Benítez | `cliente.lucas@argendar.com` | `Password123!` | `c8054b56-5db8-4ceb-b5e8-a72332ee770f` | N/A | No | Particular en Palermo, CABA |
| **Cliente** | Valeria Rossi | `cliente.valeria@argendar.com` | `Password123!` | `5c2e2ce0-20ed-4fb1-bde8-72c211e58c1b` | N/A | No | Administradora de consorcios |
| **Profesional Activo** | Esteban Morales | `pro.electricista@argendar.com` | `Password123!` | `cec390c9-9c3d-4a28-9b83-8a12994a1b54` | Completo | No | Electricista Matriculado (Rating 4.90) |
| **Profesional Activo** | Martín Navarro | `pro.plomero@argendar.com` | `Password123!` | `f59586b1-0bb2-4796-856c-306bd856325a` | Completo | No | Plomero y Gasista (Rating 4.85) |
| **Profesional Activa** | Camila Domínguez | `pro.climatizacion@argendar.com` | `Password123!` | `79e9a3f1-a909-40c6-ba0d-7076406019b7` | Completo | No | Climatización / Refrigeración (Rating 5.00) |
| **Profesional Activo** | Roberto Alonso | `pro.cerrajero@argendar.com` | `Password123!` | `d05fcd94-7b5c-4e86-b3c4-9a79b5535248` | Completo | No | Cerrajería 24hs (Rating 4.75) |
| **Profesional Nuevo** | Mario Rossi | `test_permanente_profesional@argendar.com` | `Password123!` | `64f8bfd0-d72d-47a4-8975-70436f97b304` | Pendiente | No | Mantenimiento General (Onboarding `false`) |
| **Profesional Nuevo** | Nicolás Funes | `pro.nuevo.pintor@argendar.com` | `Password123!` | `9fbfe7ee-219d-4761-a0df-3f97973e592b` | Pendiente | No | Pintura y Durlock (Onboarding `false`) |
| **Cliente Suspendido** | Usuario Suspendido | `test_suspendido@argendar.com` | `Password123!` | `2afadba9-cd4e-4b04-9b92-f19f38431624` | N/A | **SÍ** | Validación de bloqueo de login (403) |
| **Profesional Sancionado** | Profesional Sancionado | `pro.suspendido@argendar.com` | `Password123!` | `1cfa531d-b40b-4fec-a5e7-d0318e2a8fe4` | Completo | **SÍ** | Validación de suspensión en profesional |
| **Administrador** | Super Admin | `admin.argendar@argendar.com` | `Password123!` | `88d68102-2582-4d96-abcd-53fdd9d9b4a3` | N/A | No | Administración y gestión del sistema |

### Comprobación de Integridad en Tablas Canónicas
1. **`auth.users`:** Usuarios registrados con confirmación de correo activa y metadatos sincronizados.
2. **`public.profiles` / Fallback de Identidad:** Vinculación $1:1$ mediante UUID, control de estado `esta_suspendido` (`is_suspended`) y roles (`client` / `professional` / `admin`).
3. **`public.professional_profiles`:** Registros con banderas `onboarding_completo` (`is_onboarding_complete`) y reputación (`calificacion_promedio`) que alimentan el feed y control de accesos.



---

## 4. Colección de Postman (`Argendar_Auth_Tests.postman_collection.json`)

Se generó y guardó en la raíz del repositorio el archivo **`Argendar_Auth_Tests.postman_collection.json`** compatible con la especificación **Postman Collection v2.1**.

### Características de la Colección:
* **Variables Dinámicas y de Entorno Preconfiguradas:**
  * `{{base_url}}`: `http://localhost:5000`
  * `{{jwt_token}}`: Captura automáticamente el JWT tras el login exitoso del cliente.
  * `{{prof_jwt_token}}`: Captura automáticamente el JWT del profesional.
  * `{{permanent_client_email}}`: `test_permanente_cliente@argendar.com`
  * `{{permanent_prof_email}}`: `test_permanente_profesional@argendar.com`
  * `{{suspended_email}}`: `test_suspendido@argendar.com`
  * `{{default_password}}`: `Password123!`
* **Pruebas Automatizadas Integradas (`pm.test`):**
  * Verificación de status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `409 Conflict`).
  * Validación de estructura JSON (`pm.expect(jsonData.status).to.eql('success')`).
  * Inyección automática del token Bearer en las peticiones posteriores (`/api/v1/auth/me`, `/api/v1/job-requests/feed`).

### Instrucciones de Importación y Uso en Postman:
1. Abre Postman y haz clic en el botón **Import** (arriba a la izquierda).
2. Selecciona el archivo `Argendar_Auth_Tests.postman_collection.json` ubicado en la raíz del proyecto.
3. Asegúrate de que el backend esté ejecutándose (`npm run dev` en el directorio `backend` en el puerto `5000`).
4. Haz clic derecho sobre la colección **"Argendar — EP-AUTH QA Automation Suite (v2.1)"** y selecciona **Run collection** para ejecutar todos los tests de forma secuencial.

---

## 5. Instrucciones para Ejecutar la Suite de Pruebas Automatizadas

Para reproducir la ejecución de los 33 tests automatizados desde la terminal:

```bash
# 1. Navegar al directorio backend
cd backend

# 2. Ejecutar la suite completa de pruebas
npm test
```

### Salida Esperada:
```
# Subtest: Pruebas E2E de Endpoints REST (EP-AUTH)
  ...
  ok 1 - Pruebas E2E de Endpoints REST (EP-AUTH)
# Subtest: Épica de Registro y Autenticación (EP-AUTH) - Suite E2E Real con Persistencia en Base de Datos
  ...
  ok 2 - Épica de Registro y Autenticación (EP-AUTH) - Suite E2E Real con Persistencia en Base de Datos
# Subtest: Suite de Pruebas EP-AUTH (Argendar Backend)
  ...
  ok 3 - Suite de Pruebas EP-AUTH (Argendar Backend)
# tests 33
# suites 10
# pass 33
# fail 0
# duration_ms ~2700
```
