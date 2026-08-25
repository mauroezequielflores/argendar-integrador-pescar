Pantallas: Mi Agenda - Próximos Turnos (Listado y Modal de Detalle)

Historia de Usuario — Gestión y Finalización de Turno

1. Rol: Profesional

2. Ruta: /professional/agenda/ (Desplegado como modal/panel sobre /professional/agenda)

3. Narrativa:

Como profesional,
quiero visualizar el detalle de mis próximos turnos agendados y gestionar su estado (confirmar pago, reprogramar o finalizar),
para llevar un control ordenado de mis trabajos y asegurar el cobro antes de dar por terminado el servicio.

4. Criterios de aceptación

CA01 — Visualización en Listado (Próximos Turnos)
En la pestaña "Próximos Turnos" de "Mi Agenda", si existen turnos asignados, el sistema debe listarlos mediante tarjetas (cards).
Cada tarjeta debe mostrar un resumen claro: Estado del turno, Ubicación breve (barrio), Título del trabajo, Nombre del cliente, Fecha y hora programada, y Categoría del servicio.
La tarjeta debe incluir un botón interactivo alineado a la derecha con el texto "Ver detalle ->".

CA02 — Apertura de Detalle y Datos del Cliente
Al hacer clic en "Ver detalle", se debe abrir una ventana (modal o panel lateral) superpuesta a la agenda, que contenga toda la información del turno.
El encabezado del modal debe incluir un botón "X" para cerrar y un botón secundario "Cancelar turno".
El modal debe contener bloques de información estática:
Detalle del Turno Estado (ej. PROGRAMADO), perfil del cliente (foto, nombre, calificación), fecha y horario propuesto.
Detalle del Cliente Ubicación exacta del trabajo y un bloque con la solicitud original (título, descripción breve y botón secundario "Ver detalle" para expandir la solicitud inicial).

CA03 — Gestión de Pagos (Validación estricta para finalizar)
Debe existir una sección denominada "Detalle del Pago", que muestre el estado actual (ej. PENDIENTE o CONFIRMADO) y desglose: Método de Pago, Seña abonada, Saldo restante y Total del servicio.
*Reglas de interacción basadas en el pago:*
Caso A (Pago Pendiente):** El botón "Confirmar pago" debe mostrarse habilitado (color naranja). El botón en el footer "Finalizar turno" DEBE estar **deshabilitado** (bloqueado/gris), impidiendo que el profesional cierre el trabajo sin cobrar.
Caso B (Pago Confirmado):** Una vez que el profesional confirma el cobro, el estado cambia a "CONFIRMADO". El botón "Confirmar pago" se deshabilita, y automáticamente el botón del footer "Finalizar turno" pasa a estar **habilitado** (color naranja).

CA04 — Reprogramación
En la parte inferior del modal (junto al botón de finalizar), debe existir siempre visible y habilitado un botón secundario con el texto "Reprogramar turno", que permitirá al profesional iniciar el flujo para proponer una nueva fecha u horario.

CA05 — Respuesta de Finalización (Exitoso vs Rechazado)
Al hacer clic en el botón habilitado "Finalizar turno", el sistema procesará la solicitud y deberá devolver una de las siguientes pantallas de respuesta (modales):
Respuesta 5.1 (Éxito Pantalla centralizada con un ícono de check. Título "Confirmación de turno finalizado exitosamente". Texto: "Tu Turno se confirmó como finalizado... Ahora el cliente puede proceder con su reseña.". Botón de acción principal: "Ir a mis reseñas ->".
Respuesta 5.2 (Rechazo / Error): Pantalla centralizada con ícono de alerta (!). Título "Confirmación de turno finalizado rechazado". Texto indicando que no fue posible procesar la confirmación (ej. por error del servidor o inconsistencia en el pago). Botón de acción: "Volver a Mi agenda".

NOTA:sumar una regla de negocio más que se ejecute cuando el profesional “finaliza un turno” antes de la fecha acordada de realización o por error. Para evitar estos casos siempre se suma una ventana de “¿Estás seguro que deseas finalizar este turno? Una vez confirmes su finalización será movido a tu historial como turno finalizado. con las opciones “finalizar turno” y “cancelar” de cancelar operación. 
