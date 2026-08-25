Historia de Usuario — Notificaciones
1. Rol: Cliente
2. Ruta: /client/notifications
3. Narrativa:
Como cliente autenticado,
quiero acceder a la pantalla "Mis notificaciones" y consultar mis notificaciones actuales e historial,
para mantener al tanto pagos, turnos, calificaciones y ofertas relacionados con mi cuenta.
4. Criterios de aceptación
CA01 — Acceso a Notificaciones
Al seleccionar "Notificaciones" en el menú lateral (bajo la sección ACTIVIDAD), el sistema debe redirigir a la ruta /client/notifications.
La opción "Notificaciones" debe mostrarse resaltada como activa en el menú lateral.
En la parte superior, debe mostrarse el rastro de navegación (breadcrumbs): "Actividad > Notificaciones".
El contenedor principal debe mostrar el título destacado "Mis notificaciones" y la descripción: "Gestioná tus notificaciones de pagos, turnos y servicios.".
CA02 — Pestañas de navegación
La pantalla debe ofrecer dos pestañas alternables: "Todas mis notificaciones" e "Historial".
Al ingresar a "Mis notificaciones", la pestaña "Todas mis notificaciones" debe mostrarse seleccionada por defecto.
El cambio entre pestañas debe realizarse sin abandonar la ruta /client/notifications.
La pestaña actualmente seleccionada debe destacarse visualmente con un subrayado de color naranja.
CA03 — Filtro "Ordenar por"
Ambos paneles ("Todas mis notificaciones" e "Historial") deben contar con un control desplegable "Ordenar por" con las opciones "Todos" y "Más antiguos".
Por defecto, el filtro debe estar configurado en "Todos".
El valor seleccionado del filtro debe visualizarse como una etiqueta ("chip") en la barra de filtros, con la posibilidad de removerla individualmente (ej. "Todo x").
Al cambiar la opción seleccionada, la lista de notificaciones/historial debe reordenarse según el criterio elegido, sin abandonar la ruta.
CA04 — Estado vacío del panel "Todas mis notificaciones"
Si el cliente no tiene notificaciones, el contenido principal debe mostrar un estado vacío (Empty State) compuesto por:
Un ícono de campana centralizado.
Un título destacado: "No tenés notificaciones".
Un texto secundario: "Te avisaremos cuando ocurra algo importante.".
CA05 — Estado vacío del panel "Historial"
Si el cliente no tiene notificaciones leídas en el historial, el contenido principal debe mostrar un estado vacío (Empty State) compuesto por:
Un ícono de campana centralizado.
Un título destacado: "No tenés notificaciones leídas".
Un texto secundario: "Te avisaremos cuando ocurra algo importante.".
CA06 — Contador de resultados
En ambos paneles, debe mostrarse un contador de resultados con el formato "Tenés X turnos encontradas" (o el texto correspondiente), reflejando la cantidad de notificaciones/historial disponibles según el filtro aplicado.

