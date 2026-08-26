Pantallas: Mi Perfil - Editar configuraciones de perfil


1. Rol: Cliente

2. Ruta: /client/profile/profile-settings/edit-profile-settings

3. Narrativa:
Como cliente autenticado,
quiero acceder a la vista de "Editar configuraciones de perfil",
para poder modificar mi información personal, ubicación, datos de contacto y gestionar mis permisos de comunicación.

4. Criterios de aceptación

CA01 — Navegación y Encabezado
Al acceder a la ruta especificada, se debe mostrar el rastro de navegación (breadcrumbs): "Mi perfil > Configurar perfil > Editar configuraciones de perfil".
El título de la pantalla debe ser "Editar configuraciones de perfil", acompañado de la bajada: "Podés agregar, modificar o corregir tu información personal y los datos de la cuenta.".

CA02 — Sección "Información personal"
Debe existir un bloque titulado "Información personal" con el texto introductorio: "Ahora podés modificar tus datos.
Este bloque debe contener:
Campo "Nombre": Mostrar etiqueta con ícono de check de validación verde. El input (solo lectura por defecto) muestra el nombre actual (ej. "Hernán"). A la derecha, un botón con ícono de lápiz para habilitar su edición.
Campo "Apellido": Misma estructura que Nombre (etiqueta con check verde, input bloqueado con el apellido, y botón de lápiz).
Alerta informativa: Un bloque gris con ícono de información (`i`) indicando: "Asegurate de que el nombre coincida con tu documento de identidad...".
Campo "Número de documento *": Mostrar etiqueta de obligatoriedad (* rojo). El input debe incluir un prefijo "DNI" y el valor actual (o placeholder "Ingresa tu número de documento"). A la derecha, el botón de lápiz.
Alerta informativa: Bloque gris debajo del DNI indicando: "Tu número de documento nos ayuda a verificar tu identidad.".

CA03 — Sección "Ubicación" y Conexión Futura
Debe existir un bloque titulado "Ubicación" con el texto: "Seleccionar una ubicación en nuestro mapa:".
A la derecha del título, debe haber un botón general con ícono de lápiz para editar la ubicación.
El bloque debe mostrar una tarjeta con la ubicación actual seleccionada, incluyendo un ícono de pin (mapa), la etiqueta principal (ej. "UBICACIÓN PRINCIPAL") y la dirección formateada (Calle, Número, Piso, Barrio, Ciudad).
Regla de negocio: Al hacer clic en editar y seleccionar una ubicación en el mapa, la funcionalidad quedará preparada para una futura integración vía API de Google Maps.

CA04 — Sección "Datos de la cuenta"
Debe existir un bloque titulado "Datos de la cuenta".Este bloque debe contener:
Campo "Correo electrónico": Etiqueta con check verde, input con el email y botón de lápiz.
Switch "Permisos de comunicaciones": Un componente tipo toggle (encendido/apagado) para el email, acompañado del texto explicativo "Nos permiten enviarte comunicaciones de soporte.".
Campo "Número de teléfono *": Etiqueta de obligatoriedad, input con el teléfono registrado y botón de lápiz. *(Nota de diseño: El placeholder en la imagen dice "Hernán", debe mostrar el número)*.
Switch "Permisos de comunicaciones o verificación": Un toggle para SMS/Teléfono, con su texto explicativo.
Campo "Contraseña *": Etiqueta de obligatoriedad, input ofuscado o con el texto "Cambiar contraseña", y botón de lápiz.
Alerta informativa: Bloque gris indicando: "En caso de cambiar contraseña deberá realizar la verificación de dos pasos.".

CA05 — Botones de Acción y Retorno
En la parte inferior de la pantalla deben existir los botones de pie de página.
Botón "Volver" (alineado a la izquierda): Al hacer clic, debe retornar al usuario a la vista anterior (`/client/profile/profile-settings`).
Botón "Cancelar" (alineado a la derecha): Al hacer clic, descarta cualquier edición en curso.
Botón/Acción "Guardar": Cuando el usuario aplique y guarde cambios exitosamente (ya sea de forma global o tras confirmar la edición de un campo específico), el sistema debe redirigirlo a la vista raíz del perfil (`/client/profile`).
