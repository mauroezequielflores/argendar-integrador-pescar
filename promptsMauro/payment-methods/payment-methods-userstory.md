Pantallas: Mi Perfil - Métodos de pago

1. Rol: Cliente

2. Ruta: /client/profile/payment-methods

3. Narrativa:
Como cliente autenticado,
quiero acceder a la sección de "Métodos de pago",
para visualizar, agregar o gestionar las tarjetas que tengo guardadas en la plataforma.

4. Criterios de aceptación

CA01 — Navegación y Encabezado Principal
Al acceder a la ruta especificada, el sistema debe mostrar un rastro de navegación (breadcrumbs) en la parte superior izquierda con el formato: "Mi perfil > Métodos de pago".
El contenedor principal de la vista debe mostrar el título destacado "Métodos de pago".
Debajo del título, debe mostrarse el texto introductorio: "Administrá tus métodos de pago guardados en la plataforma.".

CA02 — Sección de Tarjetas Guardadas (Estado Vacío)
Debe existir un bloque titulado "Tarjetas guardadas:", acompañado del texto explicativo: "Aquí recibirás el pago de tus servicios." *(Nota de diseño: considerar revisar si el copy es el adecuado para el rol Cliente, ya que usualmente el cliente emite pagos, no los recibe)*.
Si el usuario no tiene ninguna tarjeta asociada a su cuenta (como se muestra en el diseño), se debe renderizar un estado vacío (Empty state) dentro de un contenedor enmarcado.
El estado vacío debe incluir:
Un ícono centralizado representativo (ej. una billetera con un símbolo de alerta o información).
Un título destacado centrado: "No tienes tarjetas guardadas".
Un texto descriptivo secundario centrado: "Agrega una tarjeta para gestionar tus pagos de forma segura.".

CA03 — Acción para Agregar Tarjeta
Inmediatamente debajo del contenedor de tarjetas (o del estado vacío), debe renderizarse un botón de ancho completo (full-width) con el texto "Agregar una nueva Tarjeta".
*(Comportamiento futuro implícito: Al hacer clic en este botón, se debería desplegar un formulario o modal para ingresar los datos de la nueva tarjeta).*




CA04 — Botones de Navegación 
En la parte inferior de la pantalla, deben existir dos botones de estilo secundario (borde outline):
 Botón "Volver" (alineado a la izquierda, con ícono `<-`): Al hacer clic en 'Volver', el sistema debe redirigir al usuario a la vista principal de su perfil, es decir, a la ruta `/client/profile`.
Botón "Cancelar" (alineado a la derecha): Al hacer clic en 'Cancelar', el sistema debe tener el mismo comportamiento de redirección que el botón "Volver" (retornar a `/client/profile`).

