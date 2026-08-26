# Walkthrough: Crear Solicitud (Paso 1) - Rediseño Fiel a Mockups

## Cambios realizados
Se reconstruyó por completo la interfaz visual de la pantalla `CreateRequestPage` y sus componentes dependientes para alcanzar **100% de fidelidad** con el diseño adjuntado (imágenes de referencia).

1. **Stepper Gráfico (Refactorizado)**
   - El componente `Stepper.jsx` dejó de ser un simple texto y pasó a ser un indicador gráfico con círculos numerados, líneas conectoras y labels alineados debajo de cada paso ("DETALLE", "UBICACIÓN", "REVISIÓN").

2. **Categorías (Refactorizado)**
   - `CategoryCard.jsx` ahora centra su contenido y posee íconos más grandes para lograr un aspecto de "tarjeta cuadrada/alta" (como en el mockup), manteniendo el efecto de borde naranja (`#FD7B03`) cuando es seleccionada.

3. **Dropdowns Personalizados (Nuevos)**
   - Se construyó el componente `RadioSelect.jsx` desde cero para los campos de disponibilidad ("¿Para cuándo necesitas un turno?" y "Horario").
   - Este componente simula un selector pero despliega un menú flotante con opciones en forma de lista, integrando un diseño de *radio buttons* a la derecha de cada ítem, tal cual se mostraba en los menús de las imágenes 2 y 3.

4. **Zona de Subida de Archivos (Refactorizado)**
   - `FileUpload.jsx` fue reestructurado por completo en un layout flex-row.
   - El área de "Arrastrá tus fotos aquí" posee las tipografías y el botón de subir imagen con fondo gris.
   - La lista de previsualización ahora se muestra a la derecha con un formato de miniaturas grandes cuadradas.
   - El texto informativo de advertencia ("Máximo 5 MB...") y el contador se movieron debajo del área de drag & drop, junto con los tags/chips de "Archivos subidos".

5. **Página Principal `CreateRequestPage.jsx`**
   - El encabezado fue ajustado para incluir la etiqueta "PASO 1 DE 3" con el badge naranja exacto.
   - Los campos de texto y "Opcional" fueron alineados y dimensionados de manera fiel. El sufijo "años" ahora se renderiza perfectamente dentro del input numérico.
   - Los botones del footer ("Volver" con su flecha a la izquierda, y "Cancelar" y "Continuar" a la derecha) se reorganizaron visualmente.

## Validación
- [x] El Stepper gráfico renderiza correctamente el estado actual.
- [x] Los dropdowns de selección única actúan como radio buttons nativos bajo la misma experiencia UI del mockup.
- [x] Las proporciones, colores y alineación concuerdan completamente con las capturas de pantalla del usuario.
