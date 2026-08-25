Historia de Usuario: Tarjeta de Notificación (Componente Reutilizable)

1. Rol: professional

2. Ruta: /professional/notifications

3. Narrativa:
Como profesional autenticado,
quiero visualizar mis actualizaciones mediante tarjetas de notificación claras e interactivas,
para identificar rápidamente qué sucedió con mis propuestas y acceder fácilmente a los detalles de cada novedad.

4. Criterios de Aceptación:

CA01 — Renderizado de la Tarjeta de Notificación (Componente Base)
Dado que el profesional se encuentra en la vista de notificaciones (/professional/notifications),
Entonces el sistema debe renderizar un componente de lista iterativo (tarjeta/row horizontal) para cada notificación registrada.
Este componente funcionará como una plantilla base donde solo variará el contenido (íconos y textos) según el tipo de notificación.

CA02 — UI: Estructura Visual del Componente (Caso: Oferta no seleccionada)
El componente de tarjeta debe respetar la siguiente estructura y estilos (basados en dark mode):
Contenedor Principal: Un rectángulo con fondo gris oscuro (surface color), bordes redondeados (border-radius) y un padding interno uniforme. Debe tener un comportamiento interactivo (efecto hover sutil y cursor pointer).
Sección Izquierda (Avatar/Ícono): Un contenedor circular con fondo blanco puro. En el centro debe renderizar un ícono que represente la acción (en el caso de la imagen: un círculo verde relleno con una pequeña "x" blanca en su interior).
Sección Central (Contenido Textual): Un contenedor flex/column con alineación a la izquierda que incluye:
Título: El texto representativo de la acción (ej. "Oferta no seleccionada") renderizado en color blanco, con fuente de peso regular o medium.
Subtítulo/Descripción: Un breve mensaje explicativo (ej. "El trabajo fue adjudicado a otro profesional.") debajo del título, en fuente de tamaño regular y color gris claro/apagado (muted text) para establecer una jerarquía secundaria.
Timestamp: En la parte inferior, la estampa de tiempo relativo (ej. "HACE 30 MIN") renderizada en fuente pequeña, todo en mayúsculas y en color gris apagado.
Sección Derecha (Navegación): Un ícono de chevron apuntando a la derecha (`>`), alineado verticalmente al centro en el extremo derecho de la tarjeta. Su color debe ser gris claro/apagado y sirve como indicador visual de que el elemento lleva a otra pantalla.



CA03 — Comportamiento: Navegación al Hacer Clic
Dado que el profesional visualiza la tarjeta de notificación en su lista,
Cuando hace clic sobre cualquier parte del área interactiva de dicha tarjeta,
Entonces el sistema debe capturar el ID de la notificación u oferta y redirigir al usuario a una nueva ventana/ruta que muestre los detalles completos de la notificación (ej. /professional/notifications/{id}/details).
