# Plan de Implementación: Crear Solicitud (Paso 3: Revisión)

Este plan describe la construcción de la pantalla final de "Revisión", manteniendo consistencia y fidelidad con las reglas de diseño globales.

## Cambios Propuestos

### Módulo de Agenda (`src/features/agenda/`)
#### [NEW] `features/agenda/pages/CreateRequestRevisionPage.jsx`
- Pantalla que despliega un resumen de los datos ingresados en los pasos 1 y 2.
- **Header**: Breadcrumbs extendidos, Stepper en paso 3 (pasos 1 y 2 con Check), y título "Revisá tu Solicitud" con badge "PASO 3 DE 3".
- **Contenido Principal**: Bloques de resumen divididos verticalmente por un `border-b border-[#3f3f3f]`.
- Cada bloque contará con:
  - Título y su icono (color `#A8A8AA`), texto en blanco y negrita.
  - Botón "Editar" a la derecha (ícono de lápiz, borde outline, hover interactivo), que redirige al paso correspondiente (`/client/agenda/create-request` o `/client/agenda/create-request/location`).
  - Contenido dinámico (que en esta fase será mockeado estáticamente utilizando las variables del diseño, hasta tener un store/contexto global si no existe).
- **Secciones Específicas**:
  - `UBICACIÓN`: Dirección ingresada.
  - `CATEGORÍA`: Ícono y título de la solicitud.
  - `CUESTIONARIO DE DETALLES`: Grid de dos columnas con los datos técnicos (emergencia, antigüedad, materiales, descripción).
  - `DISPONIBILIDAD`: Rango horario.
  - `FOTOS`: Fila de miniaturas de imágenes simuladas (cajas grises o placeholder).
- **Footer**: Botones "Volver" (Paso 2), "Cancelar" (Agenda) y "Publicar Solicitud" (botón primario `#F78736`).
- **Acción**: Al hacer click en Publicar, lanzaremos un alert simulando éxito y redirigiremos a `/client/agenda`.

### Enrutamiento (`src/app/router/`)
#### [MODIFY] `AppRouter.jsx`
- Agregar la ruta estática `/client/agenda/create-request/revision` que renderice el nuevo componente.

### Integración en Pasos Anteriores
#### [MODIFY] `CreateRequestLocationPage.jsx`
- Conectar el `onSubmit` del paso 2 (Ubicación) para que navegue directamente hacia `/client/agenda/create-request/revision`.

## Verificación
1. Validar visualmente el layout y el acomodo de cada bloque.
2. Comprobar que los colores, fuentes y grosores de texto sean correctos.
3. Asegurar que todos los botones de "Editar" redireccionan a las vistas correctas.
4. Validar el flujo continuo de `Paso 1 -> Paso 2 -> Paso 3 -> Publicar`.
