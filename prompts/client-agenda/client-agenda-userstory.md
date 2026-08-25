Historia de Usuario — Ver turnos y detalles de turnos
1. Rol: Cliente
2. Ruta: /client/agenda (panel "Próximos Turnos")
3. Narrativa:
Como cliente autenticado,
quiero hacer clic sobre una tarjeta de turno y visualizar su detalle completo,
para poder consultar la información del profesional asignado, la solicitud asociada y los datos de pago, y gestionar el turno (reprogramar, finalizar o cancelar).
4. Criterios de aceptación
CA01 — Card de Turno
Cada tarjeta de turno debe mostrar la etiqueta "TURNO", una etiqueta de estado (ej. "Confirmado") y una etiqueta de ubicación (ej. "Caballito, CABA").
En el extremo superior derecho, debe mostrarse el tiempo transcurrido desde la creación del turno (ej. "hace 2 días").
Debe mostrarse el avatar del profesional, el título del servicio (ej. "Cambio de tablero principal") y el nombre del profesional asignado.
En la parte inferior, debe mostrarse la fecha y horario programado (ej. "Programado: 28/07/2026 · 15:30 hs"), la categoría del servicio (ej. "ELECTRICIDAD") y los botones "Ver detalle" y "Ver ofertas".
CA02 — Apertura del detalle de turno
Al hacer clic sobre una tarjeta de turno, el sistema debe abrir un panel modal deslizante desde el extremo derecho de la pantalla, ocupando el lado derecho de la pantalla.
El contenido del modal debe permitir hacer scroll vertical para visualizar toda la información (Detalle del Turno, Detalle del Cliente, Solicitud asociada y Detalle del Pago).
Los botones de acción inferiores "Reprogramar turno" y "Finalizar turno" deben permanecer fijos (sticky) en la parte inferior del modal, visibles en todo momento independientemente del scroll.
El modal debe poder cerrarse mediante el ícono "X" ubicado en la esquina superior izquierda.
CA03 — Sección "Detalle del Turno"
Debe mostrarse el título "Detalle del Turno" junto con una etiqueta de estado (ej. "Confirmado") a la derecha.
Debe mostrarse el avatar, nombre, calificación en estrellas y categoría del profesional asignado (ej. "Ricardo Gómez", "Electricista").
Debe mostrarse la "Fecha propuesta" y el "Horario" del turno.
CA04 — Sección "Detalle del Cliente"
Debe mostrarse la ubicación completa del cliente (dirección, piso/departamento, barrio y ciudad).
Debe mostrarse un resumen de la solicitud asociada al turno, incluyendo su estado (ej. "Confirmada"), ubicación, título, descripción abreviada y preferencia de fecha (ej. "Preferencia: Este mes").
Debe existir el botón "Ver detalle" dentro de esta sección.
Al hacer clic en "Ver detalle", el sistema debe abrir el modal de detalle de solicitud (el mismo utilizado desde el panel "Solicitudes"), mostrando toda su información.
Regla de negocio: dado que la solicitud ya está asociada a un turno confirmado, dentro de este modal de detalle de solicitud los botones "Ver ofertas" y "Cancelar Solicitud" deben ocultarse/no mostrarse, ya que la solicitud dejó de estar en proceso de recepción de ofertas.
CA05 — Sección "Detalle del Pago"
Debe mostrarse el título "Detalle del Pago" junto con una etiqueta de estado (ej. "Pendiente").
Debe mostrarse el método de pago, la seña abonada, el saldo restante y el total del servicio.
Debe existir el botón "Pagar saldo restante"; si el saldo restante es $0, el botón debe mostrarse desactivado.
CA06 — Botones de acción del turno
Debe existir el botón "Reprogramar turno", que permite al cliente iniciar el flujo de modificación de fecha/horario del turno.
Debe existir el botón primario naranja "Finalizar turno", que permite al cliente marcar el servicio como finalizado.
CA07 — Cancelar Turno
En la parte superior derecha del modal, debe estar visible el botón "Cancelar turno".
Al hacer clic en "Cancelar turno", el sistema debe abrir una segunda ventana modal de confirmación, con el mismo comportamiento definido para "Cancelar Solicitud":
Título de confirmación (ej. "¿Deseas cancelar este turno?") y texto explicativo de las consecuencias de la cancelación.
Campo de texto "Motivo de cancelación (opcional)".
El botón de confirmación "Cancelar turno" debe estar desactivado mientras el campo de motivo esté vacío, y habilitarse en cuanto el usuario ingrese al menos un carácter.
Alertas informativas sobre el efecto de la cancelación y la no afectación del historial del cliente.
El modal debe poder cerrarse mediante el ícono "X" sin aplicar la cancelación
