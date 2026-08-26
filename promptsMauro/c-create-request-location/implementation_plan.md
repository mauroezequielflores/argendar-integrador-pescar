# Plan de Implementación: Crear Solicitud (Paso 2: Ubicación)

Este plan describe la construcción de la pantalla de ubicación de la solicitud, manteniendo total fidelidad con la imagen de referencia y las reglas de diseño (colores base, `#F78736` como color primario, tarjetas `#292929`, etc).

## Cambios Propuestos

### Componentes de Interfaz Compartidos (`src/components/ui/`)
#### [MODIFY] `Stepper.jsx`
- Soporte para pasos "completados": Si un paso es menor al paso actual, su círculo mostrará un ícono de check (tilde) en lugar de su número.
- Ajuste de estilos para que el paso completado mantenga un fondo distinto que indique que ya fue superado (según la imagen, gris `#3f3f3f` u oscuro con icono blanco).

#### [MODIFY] `Input.jsx`
- Soporte para agregar un `icon` en el lado izquierdo del input (como el pin de mapa solicitado en el diseño) de forma nativa.

### Validaciones (`src/validations/`)
#### [MODIFY] `request.schema.js`
- Agregar el nuevo esquema para el Paso 2 (`createRequestStep2Schema`):
  - `address`: String, requerido, mínimo 5 caracteres.
  - `apartment`: String, opcional.
  - `zipCode`: String, opcional.
  - `additionalDetails`: String, opcional (aunque la US dice requerido u opcional, el diseño suele poner "Opcional" o dejarlo sin aclarar; asumiré requerido si así se indica en la US, o permitiré ambos según diseño). *Aclaración: en la imagen no dice "opcional" explícitamente en el label, pero lo trataremos de acuerdo a la US (asumimos obligatorio).*

### Módulo de Agenda (`src/features/agenda/`)
#### [NEW] `features/agenda/pages/CreateRequestLocationPage.jsx`
- Pantalla dividida en dos columnas principales (grid layout):
  - **Izquierda**: Formulario con Dirección (ancho completo), Apartamento y CP (en línea, dos columnas) y Detalles Adicionales (Textarea).
  - **Derecha**: Tarjetas de "Resumen de ubicación" (con reflejo dinámico de lo tipiado en el formulario usando `watch` de React Hook Form) y "Ubicación protegida".
- Mantener la misma cabecera (Breadcrumbs, Stepper en el paso 2, Títulos) y footer ("Volver", "Cancelar", "Continuar ->") integrados dentro de la tarjeta principal `#292929`.
- Usará `useForm` integrando el schema Zod creado.

### Enrutamiento (`src/app/router/`)
#### [MODIFY] `AppRouter.jsx`
- Agregar la ruta estática `/client/agenda/create-request/location` que renderiza el componente `CreateRequestLocationPage`.

## Verificación
1. Validar visualmente el uso de la paleta de colores.
2. Escribir texto en los inputs y verificar que la tarjeta de Resumen a la derecha se actualiza instantáneamente.
3. Hacer clic en "Continuar" para confirmar las validaciones de Zod.
