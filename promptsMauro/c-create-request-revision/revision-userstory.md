Pantallas: Mi Agenda - Crear solicitud (Paso 3: Revisión)

Historia de Usuario — Crear solicitud: Revisión final

1. Rol: Cliente

2. Ruta: /client/agenda/create-request/revision

3. Narrativa:
Como cliente autenticado,
quiero revisar un resumen completo de todos los datos ingresados en mi nueva solicitud,
para asegurarme de que la información sea correcta antes de publicarla en el marketplace.

4. Criterios de aceptación

CA01 — Navegación y Encabezado
Al acceder a la ruta, el sistema debe mostrar el rastro de navegación (breadcrumbs): "Solicitud > Detalles > Ubicación > Revisión".
El indicador de progreso (Stepper) debe actualizarse: los pasos "1. Detalle" y "2. Ubicación" deben mostrarse completados (con ícono de check), y el paso "3. Revisión" debe estar activo.
El encabezado principal debe mostrar el título "Revisá tu Solicitud", acompañado de la bajada "Verificá toda la información antes de publicarla." y la etiqueta destacada "PASO 3 DE 3".

CA02 — Bloques de Resumen de Información
El contenido principal debe organizarse en bloques apilados verticalmente, separados por divisores (líneas sutiles). Cada bloque debe representar una sección completada en los pasos anteriores.
En el extremo derecho de cada bloque, debe renderizarse un botón interactivo "Editar" (con ícono de lápiz). Al hacer clic en él, el sistema debe redirigir al paso correspondiente (Detalle o Ubicación) para permitir su modificación.

CA03 — Detalle de los Bloques de Resumen
Los bloques a renderizar son:
Ubicación: Ícono de pin de mapa. Título "UBICACIÓN". Muestra la dirección completa ingresada (calle, piso, barrio/ciudad).
Categoría: Ícono representativo de la categoría seleccionada. Título "CATEGORÍA". Muestra el nombre de la categoría (ej. "Plomería") y el título breve de la solicitud.
Cuestionario de Detalles: Ícono de lista. Título "CUESTIONARIO DE DETALLES". Debe mostrar en una grilla los datos ingresados:
¿ES UNA EMERGENCIA? 
¿CUÁNDO LO NECESITA? 
¿TIENE LOS MATERIALES? 
 ¿CUÁNTOS AÑOS DE ANTIGÜEDAD TIENE EL EQUIPO O INSTALACIÓN? 
DESCRIPCIÓN GENERAL DEL PROBLEMA (Texto descriptivo completo).

Disponibilidad:Ícono de calendario. Título "DISPONIBILIDAD". Muestra el rango horario seleccionado (ej. "TARDE : 12:00 AM - 17:00 PM").
Fotos: Ícono de galería de imágenes. Título "FOTOS". Muestra las miniaturas de las imágenes subidas en el paso 1.

CA04 — Botones de Acción 
En la parte inferior de la pantalla (footer) deben existir tres botones:
Volver (Alineado a la izquierda, ícono `<-`): Al hacer clic en 'Volver', el sistema debe redirigir al usuario a la vista base de creación o al paso anterior: `/client/agenda/create-request` (según defina el flujo exacto de navegación hacia atrás de la aplicación).
Cancelar** (Alineado a la derecha): Al hacer clic, se debe descartar el proceso de creación y redirigir al listado principal de la agenda en `/client/agenda’.
Publicar Solicitud (Botón principal naranja, alineado a la derecha).

CA05 — Acción de Publicar (Regla de negocio)
Al hacer clic en "Publicar Solicitud", el sistema debe guardar definitivamente la solicitud y cambiar su estado a pública.
Inmediatamente, la solicitud debe estar disponible en el "Marketplace" de los profesionales para que puedan visualizarla y realizar sus ofertas.
Tras el éxito de esta acción, el cliente debe visualizar una confirmación de éxito y luego rederigido al listado de sus solicitudes en `/client/agenda`.

