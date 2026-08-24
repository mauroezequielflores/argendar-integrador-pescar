Historia de Usuario: Notificación y Comprobante de Pago Confirmado

1. Rol: professional

2. Ruta: /professional/notifications

3. Narrativa:
Como profesional autenticado,
quiero recibir una notificación cuando se acredite correctamente el pago de un servicio,
para poder tener control de mis ingresos, verificar los datos de la transacción y acceder al comprobante asociado al turno.

4. Criterios de Aceptación:

CA01 — Visualización de la Notificación en Lista (Pago Confirmado)
Dado que el profesional se encuentra en la ruta /professional/notifications,
Cuando el sistema (backend) procesa una acreditación exitosa (ej. vía Webhook de una pasarela de pago),
Entonces el frontend debe renderizar en la lista una tarjeta iterativa de notificación con el siguiente diseño:
Ícono (Izquierda): Avatar circular blanco conteniendo un ícono representativo de tarjeta de crédito o dinero en color azul vibrante.
Título: El texto "Pago confirmado" en tipografía bold color blanco.
Subtítulo/Cuerpo: El texto descriptivo "Se acreditó correctamente el pago." en color gris claro.
Timestamp: El tiempo relativo desde la operación (ej. "HACE 1 HORA") en fuente pequeña, mayúsculas y gris apagado.
Navegación: Ícono de chevron (`>`) a la derecha indicando que es un área interactiva.

CA02 — Navegación y Consumo de Datos (Backend Routing)
Dado que el profesional hace clic en toda el área de la tarjeta "Pago confirmado",
Entonces el frontend debe redirigir a la vista de detalles y ejecutar de inmediato una petición asíncrona al backend para obtener la información de la transacción.
Ruta Backend sugerida: `GET /api/v1/appointments/{appointmentId}/payment-details` (o `/api/v1/payments/{paymentId}`).
Regla: Toda la información a renderizar en las tarjetas subsiguientes debe provenir estrictamente de la respuesta de este endpoint (ID de operación, monto, método, fechas).

CA03 — UI: Tarjeta Superior (Resumen del Turno)
Al ingresar a la ventana de detalles, el sistema debe mostrar un texto sutil superior ("Se acreditó correctamente el pago de su próximo turno.") seguido de una primera tarjeta gris oscura con bordes redondeados que incluya:
Avatar fotográfico asociado al turno.
Título del servicio ("Instalación eléctrica") alineado a la izquierda.
Badge de Estado del Turno: Pegado al título, una etiqueta outline (solo borde) con el texto "PROGRAMADO" en mayúsculas.
Nombre de la contraparte ("Ricardo Gómez").
Abajo Izquierda: Ícono de calendario en color naranja con la fecha y hora del turno ("28/07/2026 15:30 hs").
Arriba Derecha: Ícono de reloj gris apagado con tiempo relativo ("hace 2 días").
Acción: Botón interactivo outline con el texto "Ver detalle ->" alineado abajo a la derecha.

CA04 — UI: Tarjeta Inferior (Detalles del Comprobante / Recibo)
Inmediatamente debajo del resumen del turno, la interfaz debe renderizar una segunda tarjeta gris oscura simulando un ticket o comprobante de transacción, conteniendo:
Fila de Estado de Pago: Texto "ESTADO" (gris claro) a la izquierda, y a la derecha un badge con alto contraste (fondo blanco relleno, texto oscuro/negro) con la palabra "CONFIRMADO" en mayúsculas.
Filas de Datos (flex space-between con labels grises y valores blancos alineados a la derecha):
Label "Nº de Operación" -> Valor de la base de datos (ej. "#MP-982341").
Label "Método" -> Valor (ej. "Mercado Pago" o "Transferencia").
Label "Fecha" -> Valor formateado (ej. "12 Mayo, 2026").
Fila de Total: Label "Monto Pagado", y su respectivo valor (ej. "$3.500,00") renderizado en tipografía blanca, tamaño mayor y bold para jerarquizar la ganancia.

CA05 — Acciones y Redirecciones en la Vista de Detalles
El sistema debe garantizar que los controles interactivos lleven a las rutas correctas:
Botón "Ver detalle ->" (en la primera tarjeta): Al hacer clic, debe capturar el ID del turno y redirigir a la vista del servicio en curso (`/professional/appointments/{appointmentId}`).
Botón "Volver" (ubicado en el footer gris fijado en la parte inferior de la pantalla): Al hacer clic, debe redirigir a la vista raíz de notificaciones (`/professional/notifications`).
