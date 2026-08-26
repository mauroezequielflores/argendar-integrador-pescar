Pantallas: Mi Perfil - Editar perfil público

1. Rol: Cliente

2. Ruta: /client/profile/edit-profile

3. Narrativa:
Como cliente autenticado,
quiero acceder a la pantalla de edición de mi perfil público,
para poder personalizar mi información visible (foto, portada, biografía) y consultar el historial y resumen de las calificaciones que he otorgado a profesionales.

4. Criterios de aceptación

CA01 — Acceso y Navegación Principal
Al ingresar al modo de edición, la interfaz debe mostrar la pestaña "Editar perfil público" (con un ícono de lápiz) como activa y destacada.
En el extremo superior derecho del encabezado del perfil, debe estar visible de forma permanente el botón secundario con el texto "Guardar y volver a Mi perfil".
Al hacer clic en "Guardar y volver a Mi perfil", el sistema debe aplicar los cambios generales realizados en esta sección y redirigir al usuario a la vista principal de su perfil.

CA02 — Edición de Imágenes (Foto de Perfil y Portada)
La imagen de portada (fondo oscuro superior) debe contar con un botón superpuesto centrado, que contenga un ícono de cámara fotográfica, indicando la acción de editar/cambiar portada.
La foto de perfil del usuario (avatar circular) debe mostrar también un botón superpuesto centrado con un ícono de cámara fotográfica.
Al hacer clic en cualquiera de estos íconos, el sistema debe abrir el selector de archivos del sistema operativo para que el usuario pueda cargar una nueva imagen.

CA03 — Sección "Sobre mí" (Biografía Personal)
Debe existir una tarjeta principal titulada "Sobre mí".
Dentro de esta tarjeta, se debe renderizar un área de texto multilínea (textarea) con el label "Biografía personal" y un estilo de campo delineado (outline).
En la esquina inferior derecha del área de texto, debe existir un contador dinámico de caracteres con el formato "X / 1000" (ej: "0 / 1000").
Debajo del área de texto, alineado a la derecha, se debe renderizar un botón primario de color naranja con el texto "Guardar cambios".
La acción de "Guardar cambios" en este botón debe estar acotada a actualizar exclusivamente el contenido de la biografía.






CA04 — Aviso Informativo sobre Calificaciones
Justo debajo de la sección "Sobre mí", debe renderizarse un bloque de alerta informativa de ancho completo.
El bloque debe tener un ícono circular de información ("i") a la izquierda y texto descriptivo.
El texto debe indicar exactamente: "Las calificaciones no se pueden modificar. Si sentís que hay algún error comunicate con Soporte en soporte@argendar.com ó navega a nuestra sección de Ayuda."
Tanto el correo ("soporte@argendar.com") como la palabra ("Ayuda") deben visualizarse como hipervínculos clickeables subrayados.

CA05 — Resumen de Calificaciones (Solo Lectura)
Debe existir una tarjeta titulada "Resumen de Calificaciones".
Esta tarjeta debe incluir: 
 El número de calificación promedio en gran tamaño (ej. "0.0").
 Un componente de 5 estrellas representando visualmente ese promedio.
 Un texto indicativo de la cantidad de calificaciones: "Basado en X opiniones".
 Un desglose vertical de barras de progreso, mostrando la distribución para las puntuaciones de 5, 4, 3, 2 y 1 estrella(s).
Esta sección no es editable por el usuario en esta vista.

CA06 — Opiniones Recientes y Estado Vacío
Debe existir una tarjeta contigua al resumen, titulada "Opiniones recientes".
Si el usuario no tiene opiniones registradas, esta sección debe renderizar un "Empty State" (estado vacío) compuesto por:
 Un ícono representativo circular (ej. una estrella con fondo gris oscuro) centrado.
 Un título central destacado: "Aún no enviaste ninguna opinión".
 Un párrafo explicativo secundario: "Tus opiniones a profesionales aparecerán aquí cuando comiences a calificar un servicio."
 Un botón primario centrado de color naranja con el texto "Solicitar servicio".
Al hacer clic en el botón "Solicitar servicio", el sistema debe redirigir al usuario al flujo de búsqueda de profesionales o inicio de agenda (/client/marketplace).
