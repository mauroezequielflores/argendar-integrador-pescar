Pantallas: Mi Perfil - Privacidad

1. Rol: Cliente

2. Ruta: /client/profile/profile-privacy

3. Narrativa:
Como cliente autenticado,
quiero acceder a la pantalla de "Privacidad" dentro de la configuración de mi perfil,
para poder gestionar mis preferencias sobre el uso de mis datos y la configuración de cookies.

4. Criterios de aceptación

CA01 — Navegación y Encabezado Principal
Al acceder a la ruta `/client/profile/profile-privacy`, el sistema debe mostrar un rastro de navegación (breadcrumbs) en la parte superior izquierda con el formato: "Mi perfil > Privacidad".
El contenedor principal debe mostrar el título destacado "Privacidad" y, justo debajo, la descripción: "Preferencias y control sobre el uso de tus datos.".

CA02 — Panel de Gestión de Privacidad
Dentro del contenedor principal, debe existir un bloque o sección con el título secundario "Gestioná la privacidad de tu cuenta".
Este bloque debe contener una lista de opciones (tarjetas) clickeables para la configuración para las opciones de CA03 y CA04.

CA03 — Opción "Administrar permisos"
Debe existir una tarjeta interactiva con el ícono representativo de perfil/identidad, el título principal "Administrar permisos" y el texto secundario "Controlá los permisos de privacidad para ofrecerte contenido personalizado.".
A la derecha de la tarjeta debe mostrarse un ícono de flecha (chevron `>`) indicando navegación.
Regla de navegación: Al hacer clic en esta tarjeta, el sistema debe redirigir al usuario a la ruta `/client/profile/profile-privacy/manage-privacy`.

CA04 — Opción "Configurar Cookies"
Debe existir una segunda tarjeta interactiva con el ícono representativo de opciones/credencial, el título principal "Configurar Cookies" y el texto secundario "Consulta los tipos de cookies que usamos y configurá tus preferencias.".
A la derecha de la tarjeta debe mostrarse un ícono de flecha (chevron `>`) indicando navegación.
Regla de navegación: Al hacer clic en esta tarjeta, el sistema debe redirigir al usuario a la ruta `/client/profile/profile-privacy/cookie-settings`.




CA05 — Botones de Acción (Pie del contenedor)
En la parte inferior del contenedor principal, deben renderizarse dos botones con estilo secundario (borde):
 Botón "Volver" (alineado a la izquierda, con ícono `<-`): Al hacer clic, el sistema debe retornar al usuario a la vista raíz del perfil (ruta `/client/profile/`).
Botón "Cancelar" (alineado a la derecha): Al hacer clic, debe comportarse de la misma manera que el botón Volver o cancelar cualquier interacción en curso, redirigiendo a la pantalla anterior.
