
NOTA: En esta primera iteración únicamente vamos a subir las pantallas en su estado vacío. 
Pantallas: Solicitudes, Próximos turnos vacíos, Historial vacío. 
Historia de Usuario — Mi Agenda
1. Rol: Cliente
2. Ruta: /client/agenda
3. Narrativa:
Como cliente autenticado,
quiero acceder a la pantalla “Mi Agenda” y consultar mis solicitudes, próximos turnos e historial,
para gestionar y conocer el estado de los servicios que solicité.
4. Criterios de aceptación
CA01 — Acceso a Mi Agenda
Al iniciar sesión exitosamente como cliente, el sistema debe redirigir automáticamente a /client/agenda.
La pantalla debe mostrar “Mi Agenda” como sección activa de navegación.
Debe mostrarse el botón “Crear Nueva Solicitud” como acción principal.
CA02 — Saludo personalizado
La pantalla debe mostrar un saludo dinámico con el formato:
“Buenos días/tardes/noches, [nombre]”.
[nombre] debe reemplazarse por el nombre del usuario autenticado.
El saludo debe determinarse según el horario local del usuario.
El nombre mostrado debe corresponder al usuario que inició sesión.
CA03 — Panel “Solicitudes”
El panel “Solicitudes” debe estar disponible para su selección.
Al ingresar a “Mi Agenda”, este panel debe mostrarse seleccionado por defecto.
Debe permitir consultar las solicitudes realizadas por el cliente.
Si no existen solicitudes, debe mostrarse el estado vacío correspondiente y la acción “Publicar mi primera solicitud”.
Al seleccionar “Crear Nueva Solicitud” o “Publicar mi primera solicitud”, el sistema debe iniciar el flujo de creación de una solicitud.
CA04 — Panel “Próximos Turnos”
El cliente debe poder seleccionar el panel “Próximos Turnos”.
Al seleccionarlo, debe visualizar únicamente los turnos próximos asociados al cliente.
El cambio entre paneles debe realizarse sin abandonar la ruta /client/agenda.
El panel seleccionado debe identificarse visualmente como activo.
CA05 — Panel “Historial”
El cliente debe poder seleccionar el panel “Historial”.
Al seleccionarlo, debe visualizar el historial de solicitudes/turnos correspondientes al cliente que se encuentran en estado cancelado o finalizado. 
El cambio entre paneles debe realizarse sin abandonar la ruta /client/agenda.
El panel seleccionado debe identificarse visualmente como activo.
CA06 — Navegación entre paneles
El cliente debe poder alternar entre Solicitudes, Próximos Turnos e Historial.
Al cambiar de panel, el contenido principal debe actualizarse según la sección seleccionada.
La navegación entre paneles no debe provocar un cierre de sesión ni una navegación fuera de “Mi Agenda”.
Al recargar la pantalla, el sistema debe mantener el comportamiento definido para el panel inicial.
CA08 — Estados de carga y ausencia de información
Si una sección no contiene información, debe mostrar un estado vacío contextualizado.
Si ocurre un error al obtener la información, debe mostrarse un mensaje indicando que los datos no pudieron cargarse y permitir reintentar cuando corresponda.

