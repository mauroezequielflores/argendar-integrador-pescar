Pantallas: Mi Perfil - Configurar perfil

1. Rol: Cliente

2. Ruta: /client/profile/profile-settings

3. Narrativa:

Como cliente autenticado,
quiero acceder a la pantalla de "Configurar perfil",
para poder visualizar el estado de mi información personal, ubicación y datos de contacto/cuenta, y acceder a su edición.

4. Criterios de aceptación

CA01 — Navegación y Encabezado Principal
Al acceder a la ruta `/client/profile/profile-settings`, el sistema debe mostrar un rastro de navegación (breadcrumbs) en la parte superior izquierda con el formato: "Mi perfil > Configurar perfil".
El contenedor principal debe mostrar el título "Configurar perfil" y debajo la descripción: "Podés agregar, modificar o corregir tu información personal y los datos de la cuenta.".
Alineado a la derecha, en la misma fila del título, debe renderizarse un botón secundario con el texto "Editar" acompañado de un ícono de lápiz.

CA02 — Sección "Información personal"
Dentro del contenedor, debe existir un bloque agrupador con el subtítulo "Información personal".
Este bloque debe contener una lista de filas (ítems) con los siguientes datos de solo lectura:
Fila 1: Ícono representativo (ej. tarjeta de identificación), el nombre del usuario (ej. "Hernan Castro") como texto principal, y "Nombre y apellido." como texto secundario. Si el dato está validado/completo, debe mostrar un ícono de "check" circular de color verde alineado a la derecha.
Fila 2: Ícono representativo, el DNI del usuario (ej. "00000000") como texto principal, y "Número de DNI." como texto secundario.

CA03 — Sección "Ubicación"
Debe existir un bloque agrupador con el subtítulo "Ubicación".
Este bloque debe contener al menos una fila con:
Fila 1: Ícono representativo (ej. documento/ubicación), el texto principal "Ubicación principal", y el texto secundario "Condición verificada." (o el estado correspondiente).





CA04 — Sección "Datos de la cuenta"
Debe existir un bloque agrupador con el subtítulo "Datos de la cuenta".
Este bloque debe contener las siguientes filas:
Fila 1: Ícono de sobre (email), la dirección de correo (ej. "correoejemplo@gmail.com") como texto principal, y "E-mail donde recibís comunicaciones." como texto secundario. Mostrar ícono de "check" verde a la derecha si está verificado.
Fila 2: Ícono de teléfono, el número de celular (ej. "+5411908272675") como texto principal, y "Número donde recibís códigos de verificación y comunicaciones." como texto secundario. Mostrar ícono de "check" verde a la derecha si está verificado.
Fila 3: Ícono de usuario/seguridad, el texto principal "Cambiar contraseña", y "Contraseña guardada." como texto secundario. Mostrar ícono de "check" verde a la derecha.

CA05 — Botones de Acción y Retorno 
En la parte inferior del contenedor principal de configuración (a modo de pie de tarjeta o footer), deben renderizarse dos botones de acción con estilo secundario (outline/borde):
 Alineado a la izquierda: Un botón con el texto "Volver" acompañado de un ícono de flecha hacia la izquierda (`<-`).
 Alineado a la derecha: Un botón con el texto "Cancelar".
La acción de ambos botones ("Volver" y "Cancelar") debe retornar al usuario a la pantalla anterior, sin aplicar cambios (ej. regresar a la pestaña de "Información de perfil" en `/client/profile`).

