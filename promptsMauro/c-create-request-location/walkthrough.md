# Walkthrough: Crear Solicitud (Paso 2 - Ubicación)

## Cambios realizados
Se construyó la pantalla para ingresar la ubicación del servicio, manteniendo fidelidad estricta al diseño proporcionado y aplicando el color naranja `#F78736` de forma global según la especificación técnica.

1. **Pantalla Principal `CreateRequestLocationPage.jsx`**
   - **Formulario Inteligente**: Implementado con validaciones completas usando Zod y `react-hook-form`. Campos de texto y textareas con marcadores (placeholders) que indican cómo completar.
   - **Resumen en Tiempo Real**: Tarjeta del lado derecho ("Resumen de ubicación") que lee los campos tipeados en el momento utilizando el hook `watch` y muestra íconos temáticos para cada ítem (pin de mapa para la dirección, casa para el piso, carta para el CP).
   - **Información de Privacidad**: Incorporada debajo del resumen como una tarjeta disuasoria (fondo `#202020` oscuro y texto `Ubicación protegida`), utilizando el ícono validado (escudo).
   
2. **Refactor de Componentes UI**
   - **`Stepper.jsx`**: Se le agregó soporte de estado "Completado". Si el paso activo es mayor que el paso previo (ej. al estar en Paso 2, el Paso 1 quedó atrás), renderiza un **tilde (CheckIcon)** dentro del círculo con el fondo gris oscuro en lugar del número.
   - **Navegación**: Se modificó `CreateRequestPage.jsx` para que el botón Continuar ya no envíe un `alert`, sino que navegue directamente al nuevo flujo de ubicación (`/client/agenda/create-request/location`). Y a su vez, el botón "Volver" del Paso 2 redirecciona de vuelta al Paso 1 conservando la intuición de la ruta.

3. **Validación Zod (Schema Update)**
   - Añadido `createRequestStep2Schema` en `validations/request.schema.js`, que obliga al usuario a completar "Dirección completa" (min 5 carácteres) y "Detalles Adicionales" antes de poder avanzar, permitiendo que Apartamento y Código Postal permanezcan opcionales.

## Validación Visual y Lógica
- [x] El Stepper marca correctamente "Paso 1" con un ✅ y "Paso 2" activo, mientras que "Paso 3" permanece inactivo.
- [x] Los colores de botones, placeholders (`#A8A8AA`) e inputs se corresponden al CSS System Design.
- [x] Escribir en cualquier campo de la izquierda refleja el texto de forma reactiva en la tarjeta "Resumen de ubicación" de la derecha.
