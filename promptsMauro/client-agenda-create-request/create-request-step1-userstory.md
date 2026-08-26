Pantallas: Mi Agenda - Crear solicitud (Paso 1: Detalle)

Historia de Usuario — Crear solicitud: Detalle

1. Rol: Cliente

2. Ruta: /client/agenda/create-request

3. Narrativa:
Como cliente autenticado,
quiero iniciar el flujo de creación de una nueva solicitud y proveer los detalles técnicos y disponibilidad,
para que un profesional pueda entender mi problema y ofrecerme un servicio adecuado.

4. Criterios de aceptación

CA01 — Navegación y Encabezado
Al acceder a la ruta, el sistema debe mostrar un rastro de navegación (breadcrumbs): "Solicitud > Categoría".
En la parte superior, debe renderizarse un indicador de progreso (Stepper) con 3 pasos: "1. Detalle" (activo), "2. Ubicación" y "3. Revisión".
El encabezado debe contener el título "Detalla tu solicitud.", la bajada "Elegí la categoría que mejor represente tu problema." y una etiqueta a la derecha que indique "PASO 1 DE 3".

CA02 — Selección de Categoría
Debe existir una sección titulada "Seleccioná categoría y completa la encuesta.".
Debajo de esta, se debe renderizar una lista horizontal de tarjetas de categorías (ej. Plomería, Electricidad, Climatización).
Cada tarjeta debe incluir un ícono, el nombre de la categoría y una breve descripción.
El usuario debe poder seleccionar una única categoría. La categoría seleccionada debe destacarse visualmente (ej. borde color naranja), como se muestra con "Electricidad" en el diseño.

CA03 — Formulario de Detalles Generales
Debajo de las categorías, se deben renderizar los siguientes campos:
1. Input de texto obligatorio: "Ingrese un título breve que resuma tu situación." (con su respectivo placeholder descriptivo).
2. Textarea opcional: "¿Necesitas ser más especifico? Describí tu situación". Debe incluir un indicador "OPCIONAL" y un contador dinámico de caracteres con un límite de "0 / 500 caracteres".
3. Input numérico opcional: "¿Cuántos años de antigüedad tiene el equipo o instalación?". Debe incluir el indicador "OPCIONAL" y mostrar la unidad "años" fija en el extremo derecho del input.
4. Fila con dos selects (dropdowns) obligatorios:
"¿Es una emergencia?": Opciones "SI" y "NO".
"¿Tiene los materiales?": Opciones "SI" y "NO".

CA04 — Formulario de Disponibilidad (Reglas específicas)
Deben existir dos campos desplegables (dropdowns) para la disponibilidad:
"¿Para cuándo necesitas un turno?": Al desplegarse, debe mostrar exactamente estas opciones:
Esta semana
Lo antes posible
Este fin de semana
Soy Flexible

"¿Qué horario se acomoda a tu agenda?": Al desplegarse, debe mostrar exactamente estas opciones:
Mañana 08:00 - 12:00
Tarde 12:00 - 17:00
Noche 17:00 - 21:00
Cualquier horario

CA05 — Subida de Fotografías
Debe existir una sección titulada "Adjuntá fotografías" con el subtítulo "Las imágenes ayudarán al Profesional a comprender mejor el problema".
Zona de subida: Debe existir un área de "Drag & Drop" (Arrastrar y soltar) con un botón "Subir imágenes" que permita abrir el explorador de archivos del sistema.
Restricciones: Debe indicarse claramente "Máximo 5 MB por imagen. Formatos: JPG, PNG, WEBP".
Límite y Contador: Se debe permitir un máximo de 3 imágenes. Debe existir un contador dinámico "X/3 imágenes" (ej. "2/3 imágenes").
Previsualización: Las imágenes cargadas deben mostrarse como miniaturas en el lado derecho.
Gestión de archivos: Los archivos subidos deben listarse con el formato "Nombre archivo X", permitiendo eliminarlos al hacer clic en la "X".

CA06 — Botones de Acción (Footer) y Validación
En la parte inferior de la pantalla deben existir tres botones:
 "Volver" (Alineado a la izquierda): Al hacer clic, debe redirigir al usuario a la ruta `/client/agenda`, cancelando la creación de la solicitud.
 "Cancelar" (Alineado a la derecha): Al hacer clic, descarta la solicitud (mismo comportamiento que Volver o según defina el flujo global).
 "Continuar ->" (Botón principal naranja, alineado a la derecha).
Regla de Validación: Al hacer clic en "Continuar", el sistema DEBE verificar que todos los campos obligatorios (título, emergencia, materiales, fecha y horario, y categoría) estén completos. Si falta alguno, se debe impedir el avance al Paso 2 y resaltar los campos faltantes con un estado de error.

