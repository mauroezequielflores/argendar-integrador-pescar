Pantallas: Mi Perfil - Administrar privacidad

1. Rol: Cliente

2. Ruta: /client/profile/profile-privacy/cookie-settings

3. Narrativa:

Como cliente autenticado,
quiero acceder a la configuración de "Administrar servicios de privacidad",
para poder gestionar mis permisos (como la localización) y controlar cómo interactúa la aplicación con mi dispositivo.

4. Criterios de aceptación

CA01 — Navegación y Encabezado Principal
Al acceder a la ruta especificada, el sistema debe mostrar un rastro de navegación (breadcrumbs) en la parte superior izquierda con el formato: "Mi perfil > Privacidad > Administrar privacidad".
El contenedor principal debe mostrar el título destacado "Administrar servicios de privacidad".
Debajo del título, debe incluirse el texto informativo: "Estos cambios pueden tardar en confirmarse en nuestro sistema.".

CA02 — Control de Permisos de Localización
Dentro del contenedor principal, debe existir una tarjeta o fila interactiva para la gestión de ubicación.
Esta tarjeta debe contener el título "Permisos de localización".
Debajo del título, debe mostrarse el texto explicativo: "Mantené activo el permiso de localización desde la configuración de tu dispositivo para acceder a solicitudes disponibles en tu área.".
A la derecha de la tarjeta, debe renderizarse un componente de tipo "Switch" (interruptor encendido/apagado) para que el usuario pueda alternar el estado del permiso.
*(Nota técnica: El estado visual del switch debe reflejar si el permiso está concedido o denegado).*

CA03 — Botones de Acción 
En la parte inferior del contenedor, deben renderizarse dos botones con estilo secundario (borde outline):
Botón "Volver" (alineado a la izquierda, con ícono `<-`): Al hacer clic en 'Volver', el sistema debe redirigir al usuario a la pantalla anterior, es decir, a la ruta `/client/profile/profile-privacy`.
Botón "Cancelar" (alineado a la derecha): Al hacer clic, el sistema debe descartar cualquier cambio no guardado en los switches y tener el mismo comportamiento de redirección que el botón "Volver".


