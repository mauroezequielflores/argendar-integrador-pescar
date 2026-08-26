Historia de Usuario — Card de Solicitud
1. Rol: Cliente
2. Ruta: /client/agenda (panel "Solicitudes")
3. Narrativa:
Como cliente autenticado,
quiero visualizar cada una de mis solicitudes como una tarjeta con su información y estado de ofertas,
para poder hacer seguimiento de mis solicitudes publicadas y acceder rápidamente al detalle o a las ofertas recibidas.
4. Criterios de aceptación
CA01 — Contenido de la tarjeta
Cada tarjeta debe mostrar la etiqueta "SOLICITUD", una etiqueta de estado (ej. "Con ofertas" o "Pendiente"), y una etiqueta de ubicación (ej. "Caballito, CABA").
En el extremo superior derecho, debe mostrarse el tiempo transcurrido desde la publicación (ej. "Publicado hace 1 día").
Debe mostrarse un ícono/avatar representativo, el título de la solicitud (ej. "Cambio de tablero principal") y su descripción.
En la parte inferior, debe mostrarse la preferencia de horario del cliente (ej. "Preferencia: Soy flexible"), la categoría de la solicitud (ej. "ELECTRICIDAD") y la etiqueta de cantidad de ofertas o su estado equivalente.
Debe incluir dos botones de acción: "Ver detalle" y "Ver ofertas".
CA02 — Etiqueta de estado de ofertas
Si la solicitud tiene al menos una oferta asociada, la etiqueta de estado debe mostrar el texto "Con ofertas".
Si la solicitud no tiene ninguna oferta asociada, la etiqueta de estado debe mostrar el texto "Pendiente" en lugar de "Con ofertas".
CA03 — Etiqueta de cantidad de ofertas
Si la solicitud tiene ofertas asociadas, debe mostrarse la etiqueta "X Ofertas recibidas", donde X es la cantidad real de ofertas.
Si la solicitud no tiene ofertas asociadas, en lugar de dicha etiqueta debe mostrarse una animación de reloj de arena junto con el texto "Buscando ofertas".
CA04 — Botón "Ver ofertas"
Si la solicitud tiene al menos una oferta asociada, el botón "Ver ofertas" debe estar habilitado y, al hacer clic, debe permitir visualizar las ofertas recibidas para esa solicitud.
Si la solicitud no tiene ninguna oferta asociada, el botón "Ver ofertas" debe mostrarse desactivado (disabled).
Al pasar el cursor (hover) sobre el botón "Ver ofertas" desactivado, debe mostrarse un tooltip con el texto "No hay ofertas todavía".
CA05 — Botón "Ver detalle"
El botón "Ver detalle" debe estar siempre habilitado, independientemente de si la solicitud tiene ofertas o no.
Al hacer clic en "Ver detalle", el sistema debe mostrar la información completa de la solicitud correspondiente.
Historia de Usuario — Ver detalles de Solicitud
1. Rol: Cliente
2. Ruta: /client/agenda (panel "Solicitudes")
3. Narrativa:
Como cliente autenticado,
quiero hacer clic sobre una tarjeta de solicitud y visualizar su detalle completo,
para poder consultar toda la información de mi solicitud, ver las ofertas recibidas y, de ser necesario, cancelarla.
4. Criterios de aceptación
CA01 — Apertura del detalle de solicitud
Al hacer clic sobre una tarjeta de solicitud dentro del panel "Solicitudes", el sistema debe abrir un panel modal deslizante desde el extremo derecho de la pantalla, ocupando el lado derecho de la pantalla.
El modal debe mostrar el fondo oscurecido detrás de él y debe poder cerrarse mediante el ícono "X" ubicado en la esquina superior izquierda del modal.
CA02 — Contenido del detalle
El modal debe mostrar: el avatar y nombre del profesional al que se le solicita (o "Solicita:" seguido de la categoría si aún no fue asignado a un profesional), un enlace "Ir a perfil" que redirige al perfil público del profesional.
Debe mostrarse la categoría de la solicitud (ej. "PLOMERIA"), el estado de la solicitud (ej. "PUBLICADA") y un indicador de estado de ofertas (ej. "Esperando ofertas...").
Debe mostrarse el título de la solicitud, su descripción completa, y los campos de detalle específicos (ej. "¿Tiene los materiales?", "¿Es una urgencia?", "Años de antigüedad", "¿Cuándo lo necesita?").
Debe mostrarse la ubicación de la solicitud, la distancia respecto al usuario y el horario de preferencia.
Debe mostrarse la sección "Fotos del problema" con una imagen principal y miniaturas seleccionables; si existen más fotos de las visibles, debe mostrarse un indicador "+X" con la cantidad restante.
CA03 — Botón "Ver ofertas"
Si la solicitud no tiene ninguna oferta asociada, el botón "Ver ofertas" debe mostrarse desactivado (disabled), reflejando el mismo comportamiento definido en la card de solicitud.
Al pasar el cursor (hover) sobre el botón desactivado, debe mostrarse el tooltip "No hay ofertas todavía".
Si la solicitud tiene al menos una oferta asociada, el botón "Ver ofertas" debe mostrarse habilitado y permitir al cliente acceder a la vista de ofertas recibidas.
CA04 — Botón "Cancelar Solicitud"
En la parte superior derecha del modal, debe estar visible el botón "Cancelar Solicitud".
Al hacer clic en "Cancelar Solicitud", el sistema debe abrir una segunda ventana modal superpuesta con el título "¿Deseas cancelar esta solicitud?" y el texto explicativo: "¿Estás seguro de que deseas cancelar esta solicitud? Al hacerlo, se rechazarán automáticamente todas las ofertas asociadas y el proceso se dará por finalizado.".
CA05 — Formulario de cancelación
El modal de confirmación debe incluir un campo de texto con el label "Motivo de cancelación (opcional)" y el placeholder "Contanos por qué cancelás (opcional)".
El botón "Cancelar solicitud" (dentro de este modal de confirmación) debe mostrarse desactivado (disabled) mientras el campo de motivo esté vacío.
En cuanto el usuario ingrese al menos un carácter en el campo de motivo, el botón "Cancelar solicitud" debe habilitarse y quedar listo para ser enviado.
El modal debe incluir una alerta informativa: "Si cancelás esta solicitud, los profesionales ya no podrán enviarte ofertas.".
Debajo de la alerta, debe mostrarse el texto informativo: "Tu historial no se verá afectado por esta cancelación.".
El modal debe poder cerrarse mediante el ícono "X" en su esquina superior derecha, sin aplicar la cancelación.
CA06 — Confirmación de cancelación
Al hacer clic en el botón habilitado "Cancelar solicitud", el sistema debe cancelar la solicitud, rechazar automáticamente todas las ofertas asociadas y cerrar ambos modales, reflejando el nuevo estado en la tarjeta correspondiente dentro del panel "Solicitudes".
