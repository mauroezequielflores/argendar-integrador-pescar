# Plan de Implementación Actualizado: Crear Solicitud (Paso 1)

Este plan detalla los pasos para rehacer la pantalla de creación de solicitudes (Paso 1) para ser **100% fiel** al diseño adjunto.

## Cambios a Realizar

### Componentes UI Reutilizables
#### [MODIFY] `Stepper.jsx`
- Se rediseñará para ser un stepper gráfico: 
  - Círculos con el número del paso (fondo gris para inactivos, borde blanco para el activo).
  - Líneas conectoras entre los pasos.
  - Texto descriptivo ("DETALLE", "UBICACIÓN", "REVISIÓN") debajo de cada círculo en mayúsculas y fuente pequeña.

#### [NEW] `CustomDropdown.jsx`
- Reemplazará al `Select` nativo para los campos "¿Para cuándo necesitas un turno?" y "¿Qué horario se acomoda a tu agenda?".
- Permitirá mostrar un menú desplegable con opciones que incluyen *radio buttons* a la derecha (según las imágenes 2 y 3).
- Soportará íconos en el estado cerrado (ej. 📅 y 🕒).

#### [MODIFY] `FileUpload.jsx`
- Se ajustará el layout para coincidir exactamente con el diseño:
  - Izquierda: Caja principal de Drag & Drop con ícono de nube, textos específicos y botón "Subir imágenes".
  - Derecha: Cuadrícula/columna de miniaturas de imágenes (cuadradas, con bordes redondeados).
  - Abajo: "Archivos subidos (X/3)" y los chips grises `[📎 Nombre archivo X]`.

### Módulo Agenda (`CreateRequestPage.jsx`)
#### [MODIFY] `CreateRequestPage.jsx`
- **Encabezado**: Agregar el badge naranja "PASO 1 DE 3" alineado a la derecha en el `PageHeader` (o como elemento hermano).
- **Categorías**: Ajustar el diseño de las tarjetas, tamaños de íconos y textos.
- **Formulario**:
  - Título y Descripción (Textarea con "0 / 500 caracteres").
  - Edad del equipo: Ajustar el input numérico para que "años" esté alineado a la derecha dentro del contenedor oscuro de forma limpia.
  - Emergencia / Materiales: Usar el `Select` o `CustomDropdown` según corresponda.
  - Integrar los `CustomDropdown` para fechas y horarios.
- **Botones**: 
  - `<- Volver` a la izquierda.
  - `Cancelar` y `Continuar ->` a la derecha.

## Verification Plan
1. Revisar que el Stepper muestre círculos y líneas de progreso.
2. Validar que el badge "PASO 1 DE 3" luzca como en la imagen.
3. Abrir los dropdowns de fecha/hora y verificar que se desplieguen como menús personalizados con *radio buttons*.
4. Cargar archivos y comprobar que las miniaturas aparezcan a la derecha y los tags debajo.
