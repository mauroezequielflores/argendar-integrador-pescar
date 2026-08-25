Pantallas: Mi Agenda - Crear solicitud (Paso 2: Ubicación)

Historia de Usuario — Crear solicitud: Ubicación

1. Rol: Cliente

2. Ruta: /client/agenda/create-request/location

3. Narrativa:
Como cliente autenticado en proceso de crear una solicitud,
quiero ingresar y confirmar la dirección donde se realizará el trabajo,
para que el profesional sepa la ubicación exacta y pueda presupuestar o asistir correctamente.

4. Criterios de aceptación

CA01 — Navegación y Encabezado
Al acceder a la ruta, el sistema debe mostrar el rastro de navegación (breadcrumbs): "Solicitud > Detalle > Ubicación".
El indicador de progreso (Stepper) debe actualizarse: el paso "1. Detalle" debe mostrarse completado (con un ícono de check o tilde), el paso "2. Ubicación" debe estar activo, y "3. Revisión" inactivo.
El encabezado principal debe mostrar el título "Selecciona la ubicación de tu solicitud.", acompañado de la bajada "Ingresá la dirección donde el Profesional deberá realizar el trabajo." y la etiqueta destacada "PASO 2 DE 3".

CA02 — Formulario de Ingreso de Dirección (Lado Izquierdo)
Debe existir un formulario con los siguientes campos para recolectar la ubicación:
Dirección completa (Obligatorio): Input de texto con ícono de pin de mapa y placeholder "Ej: Av. Corrientes 1234, CABA".
Apartamento / Hogar (Opcional): Input de texto con placeholder "Ej: Piso 3, Depto B".
Código postal (Opcional): Input numérico/texto con placeholder "Ej: 1234".
Detalles adicionales / indicaciones (Obligatorio/Opcional según diseño, asumimos obligatorio si debe estar completo según reglas):
Un área de texto (textarea) con placeholder "Ej: Tocar timbre dos veces.".

CA03 — Tarjeta de Resumen Dinámico (Lado Derecho)
Junto al formulario, debe renderizarse una tarjeta titulada "Resumen de ubicación". 
Esta tarjeta debe reflejar en tiempo real (o tras perder el foco) los datos ingresados en el formulario:
Dirección principal: Muestra la "Dirección completa" ingresada junto a un ícono de pin.
Botón "Ver en mapa": Debajo de la dirección principal, debe existir un botón delineado (outline) con el texto "Ver en mapa". *Regla de negocio: En esta iteración puede no tener acción, pero la interfaz debe estar preparada para que en el futuro abra un modal o pop-up de Google Maps.
Detalle de hogar: Muestra el valor de "Apartamento / Hogar" junto a un ícono de casa.
Código Postal: Muestra el valor ingresado junto a un ícono de correo (si está vacío, muestra un guión "-").
Indicaciones: Muestra los detalles adicionales ingresados junto a un ícono de nota o portapapeles.

CA04 — Tarjeta de Privacidad y Seguridad
Debajo del resumen, debe mostrarse una tarjeta de información (alerta) con un ícono de escudo validado (check).
El título debe ser "Ubicación protegida" y la descripción: "Tu ubicación unicamente será visible para el profesional al cual aceptes una oferta." (Información estática para dar confianza al cliente).

CA05 — Botones de Acción (Footer) y Validación
En la parte inferior deben existir tres botones:
Volver (Alineado a la izquierda): Al hacer clic, el sistema debe redirigir al usuario al paso anterior, es decir, a la ruta `/client/agenda/create-request`, conservando (idealmente) los datos ingresados en ese paso.
Cancelar (Alineado a la derecha): Al hacer clic, descarta la creación de la solicitud y vuelve a la ruta de /client/agenda
Continuar -> (Botón principal naranja, alineado a la derecha).
Regla de Validación: Al hacer clic en "Continuar", el sistema DEBE verificar que todos los campos obligatorios del formulario (al menos "Dirección completa" y cualquier otro definido como requerido) estén completos. Si falta algún dato requerido o el formato es inválido, se debe impedir el avance al Paso 3 y mostrar un mensaje de error o resaltar los campos vacíos.

