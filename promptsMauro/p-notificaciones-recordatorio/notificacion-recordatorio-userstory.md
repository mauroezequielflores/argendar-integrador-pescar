Historia de Usuario: Notificación de Recordatorio y Resumen del Turno

1. Rol: professional

2. Ruta: /professional/notifications

3. Narrativa:
Como profesional autenticado,
quiero recibir notificaciones de recordatorio sobre mis turnos próximos,
para poder visualizar rápidamente de qué trabajo se trata y acceder a los detalles completos para organizarme.

4. Criterios de Aceptación:

CA01 — Visualización de la Tarjeta de Notificación (Recordatorio)
Dado que el profesional se encuentra en la ruta /professional/notifications,
Cuando el sistema gatilla una alerta de proximidad de un turno (ej. el día anterior),
Entonces se debe renderizar en la lista el componente base de notificación configurado con los siguientes datos:
Ícono (Izquierda): Un avatar circular de fondo blanco puro, conteniendo un ícono de calendario en color naranja.
Título: El texto "Recordatorio" en fuente blanca regular/bold.
Subtítulo/Cuerpo: El texto "Tenés un turno programado para mañana." en color gris claro/apagado (muted text).
Timestamp: El texto "AYER" (o el tiempo relativo que corresponda) en fuente pequeña, mayúsculas y color gris apagado.
Navegación: Un ícono de chevron apuntando a la derecha (`>`) en el extremo derecho.

CA02 — Comportamiento: Clic en la notificación
Dado que el profesional visualiza la notificación "Recordatorio",
Cuando hace clic sobre toda el área interactiva de la tarjeta,
Entonces el sistema debe redirigirlo a una ventana/pantalla intermedia que muestra un resumen más detallado de la oferta aceptada vinculada a ese turno.

CA03 — UI: Ventana de Detalles y Tarjeta Central de Resumen
Dado que el usuario ingresó a la ventana de detalles,
Entonces la interfaz debe renderizar sobre un fondo claro una tarjeta central (card) con fondo gris oscuro y bordes redondeados, que contenga la siguiente estructura interna:
Avatar (Izquierda): Fotografía o imagen circular del usuario asociado al turno.
Título principal: El nombre de la solicitud/servicio (ej. "Instalación eléctrica") en texto blanco y negrita.
Badge de Estado: Pegado al título, una etiqueta con borde perimetral (outline) y el texto "PENDIENTE" en mayúsculas y fuente pequeña.
Subtítulo: El nombre de la persona ("Ricardo Gómez") en texto blanco debajo del título.
Fecha y Hora (Abajo Izquierda): Un ícono de calendario pequeño en color naranja, seguido de la fecha y hora ("28/07/2026 15:30 hs") en texto gris claro.
Antigüedad (Arriba Derecha): Un ícono de reloj de línea acompañado del texto de tiempo relativo ("hace 2 días") alineado a la derecha en color gris apagado.
Botón de Acción (Abajo Derecha): Un botón interactivo transparente con borde blanco (outline button), texto "Ver detalle" y una flecha "->" (o ícono de flecha) apuntando a la derecha.

CA04 — Comportamiento: Navegación "Ver detalle ->"
Dado que el profesional visualiza la tarjeta central en la ventana de resumen,
Cuando hace clic en el botón "Ver detalle ->",
Entonces el sistema debe capturar el ID del turno y redirigir al usuario a una nueva ventana o ruta que despliegue la totalidad de los datos del turno programado (ej. dirección exacta, mapa, chat con el cliente).

CA05 — UI y Comportamiento: Footer y Botón Volver
La ventana de detalles debe contar obligatoriamente con un footer (barra inferior) persistente a lo ancho de la pantalla, que contenga:
Estilo: Fondo sólido en tono gris o translúcido oscuro, separándolo del resto del contenido.
Botón Izquierdo: Un botón secundario (outline) alineado a la izquierda con el ícono de flecha hacia la izquierda y el texto "Volver". 
Acción "Volver": Al hacer clic en este botón izquierdo, el sistema debe redirigir al usuario hacia la ruta origen /professional/notifications.
Botón Derecho: Un botón secundario (outline) alineado a la derecha con el texto "Cancelar" (preparado visualmente para futuras funcionalidades de cancelación).
