# Reporte de Correcciones - Sistema de Autenticación y Registro

Este documento detalla todas las correcciones implementadas en el sistema de autenticación de **Argendar** tras el análisis y Code Review realizado. Se han resuelto bugs críticos de seguridad, robustez, arquitectura y buenas prácticas de Node.js.

---

## 🛡️ 1. Seguridad y Exposición de Datos
* **Problema:** En [auth.controller.js], los bloques `catch` devolvían directamente detalles del error interno de base de datos o SDK de Supabase al cliente (como `details: error.message || error`), exponiendo la estructura del sistema.
* **Corrección:** Se modificaron los controladores para ocultar los errores de infraestructura y base de datos. Ante fallos inesperados, ahora se responde con un mensaje genérico seguro: `"Ocurrió un error interno al registrar el usuario."` o `"Error interno al recuperar los datos del usuario."`, registrando el error real únicamente en los logs del servidor (`console.error`).

---

## ⚡ 2. Robustez y Manejo de Errores
* **Problema 1 (Punto de Quiebre en Login):** En [auth.service.js], la obtención del perfil de usuario (`getUserProfileById`) al iniciar sesión no estaba envuelta en un bloque `try/catch`. Si la base de datos de perfiles fallaba por red o retardo, la autenticación fallaba por completo a pesar de que las credenciales de Supabase Auth eran válidas.
* **Corrección:** Se encapsuló la consulta de perfil en `loginUser` dentro de un bloque `try/catch` aislado. Ahora, si la consulta al perfil falla, se loggea un aviso (`console.warn`) pero el flujo de autenticación continúa de forma exitosa usando la metadata de Supabase Auth.
* **Problema 2 (Mapeo Semántico de Errores):** Los errores de usuario duplicado se devolvían con un código genérico `400 Bad Request`.
* **Corrección:** Se mapearon correctamente los errores del SDK de Supabase. El error por email duplicado ahora se responde con un código semántico `409 Conflict`.
* **Problema 3 (Falta de Manejo Global de Errores):** No existía un manejador de excepciones global en Express.
* **Corrección:** Se integró un **Middleware Global de Manejo de Errores** (Express Error Handler) al final de [index.js]. Las rutas y funciones que fallan ahora pueden delegar el error mediante `next(error)` para centralizar la respuesta HTTP y el formateo de errores.

---

## 📐 3. Arquitectura y Limpieza
* **Problema 1 (Violación de Capas):** En `obtenerUsuarioActual` ([auth.controller.js]), el controlador importaba y llamaba directamente al modelo `getUserProfileById` de `userModel.js`, rompiendo la arquitectura de capas (*Ruta -> Controlador -> Servicio -> Modelo*).
* **Corrección:** Se creó el servicio `getCurrentUserProfile(userId)` en [auth.service.js], permitiendo que el controlador interactúe exclusivamente con la capa de servicios.
* **Problema 2 (Instanciación Duplicada de Supabase):** En el punto de entrada [index.js], se creaba un nuevo cliente de Supabase duplicando la lógica de [supabase.js].
* **Corrección:** Se eliminó la inicialización local y se importó la instancia singleton exportada por `supabase.js`, centralizando la configuración.

---

## 🟢 4. Buenas Prácticas de Node.js
* **Problema 1 (Carga Frágil de Variables de Entorno):** Las rutas se importaban en `index.js` antes de la ejecución de `dotenv.config()`, lo cual podía causar que las variables de entorno estuvieran indefinidas al evaluar los módulos.
* **Corrección:** Se reordenó `index.js` colocando `dotenv.config()` en las primeras dos líneas del archivo, garantizando la disponibilidad inmediata de las variables de entorno.
* **Problema 2 (Falta de Fail-Fast):** Si faltaban las credenciales de Supabase en el archivo `.env`, la aplicación no fallaba de forma temprana y lanzaba avisos sin detener el proceso.
* **Corrección:** En [supabase.js], se implementó un chequeo estricto que lanza un error crítico y detiene la aplicación inmediatamente si faltan `SUPABASE_URL` o `SUPABASE_ANON_KEY`, evitando comportamientos inestables posteriores.

---

## 📂 Resumen de Archivos Modificados

1. **[backend/config/supabase.js]:**
   * Agregado de estrategia Fail-Fast para variables de entorno críticas.
2. **[backend/services/auth.service.js]:**
   * Manejo resiliente en el login al obtener perfiles.
   * Implementación de la función de servicio `getCurrentUserProfile`.
3. **[backend/controllers/auth.controller.js]**
   * Integración de `getCurrentUserProfile` respetando las 4 capas.
   * Limpieza de exposición de errores internos al cliente.
   * Mapeo de códigos HTTP (`409 Conflict`, `401 Unauthorized`, `500 Internal Server Error`).
4. **[backend/index.js]**
   * Reorganización de `dotenv.config()` al inicio absoluto.
   * Importación de la instancia singleton de Supabase.
   * Implementación de middleware global de errores.
   * Corrección de la ruta `/api/v1/usuarios` para delegar fallos a `next(error)`.
