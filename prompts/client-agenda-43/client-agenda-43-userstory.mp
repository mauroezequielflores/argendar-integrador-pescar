Historia de Usuario — Ver lista de ofertas
1. Rol: Cliente
2. Ruta: /client/agenda/[solicitud_id]/offer-list
3. Narrativa:
Como cliente autenticado,
quiero acceder a la ventana "Ofertas recibidas" de una solicitud y visualizar todas las propuestas enviadas por profesionales,
para poder comparar precios, condiciones y disponibilidad, y elegir la oferta que mejor se ajuste a mi necesidad.
4. Criterios de aceptación
CA01 — Acceso a la ventana
Al hacer clic en "Ver ofertas" desde una solicitud con ofertas asociadas (en /client/agenda o /client/marketplace), el sistema debe redirigir al cliente a la ruta /client/agenda/[solicitud_id]/offer-list.
La ventana debe mostrar el título "Ofertas recibidas".
Debajo del título, debe mostrarse un contador con el formato "Tenés X ofertas encontradas".
En la misma fila del contador, alineado a la derecha, debe mostrarse el control desplegable "Ordenar por" (ej. valor por defecto "Todos").
CA02 — Contenido de la tarjeta de oferta
Cada oferta debe representarse como una tarjeta que incluya: avatar del profesional, nombre completo, calificación en estrellas, categoría (ej. "ELECTRICISTA"), precio total ofertado (ej. "$45.000") y monto de seña requerida (ej. "Seña requerida: $9.000").
Debe mostrarse la descripción/mensaje de la oferta enviado por el profesional.
Debe mostrarse la disponibilidad propuesta por el profesional (fecha y horario, ej. "Disponibilidad: 30/07 a las 09:00hs").
Cada tarjeta debe incluir dos botones: "Ver Perfil Profesional" y "Aceptar Oferta".
CA03 — Acción "Ver Perfil Profesional"
Al seleccionar "Ver Perfil Profesional" en una tarjeta de oferta, el sistema debe redirigir al cliente al perfil público del profesional que creó esa oferta.
CA04 — Scroll de la lista de ofertas
Si la cantidad de ofertas recibidas excede el espacio visible en la pantalla, el listado debe permitir scroll vertical (mediante una scrollbar) para que el cliente pueda visualizar todas las tarjetas disponibles.
El encabezado de la ventana (título, contador y "Ordenar por") debe permanecer visible o fijo mientras el cliente scrollea la lista de ofertas.
CA05 — Acción "Aceptar Oferta"
Al seleccionar "Aceptar Oferta" en una tarjeta, el sistema debe redirigir al cliente a la ruta /client/agenda/[solicitud_id]/offer-list/confirm-offer, correspondiente a la pantalla de confirmación de la oferta seleccionada.
CA06 — Estados de carga y ausencia de información
Si ocurre un error al obtener la lista de ofertas, debe mostrarse un mensaje indicando que los datos no pudieron cargarse y permitir reintentar cuando corresponda.
