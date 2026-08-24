# Plan de Implementación: Administrar Privacidad

Implementaremos la pantalla "Administrar servicios de privacidad" basándonos en la historia de usuario `manage-privacy-userstory.md`, la imagen adjunta, y las reglas estrictas de arquitectura del frontend (`prompt-recreacion-de-pantallas.md`).

## Proposed Changes

### 1. Componentes Existentes a Reutilizar
- **`Card.jsx`** (`src/components/ui/`): Envolverá la vista entera.
- **`Breadcrumbs.jsx`** (`src/components/ui/`): Para la ruta `Mi perfil > Privacidad > Administrar privacidad`.
- **`ToggleSwitch.jsx`** (`src/components/ui/`): El interruptor visual para la activación/desactivación de la localización.
- **Botones de pie de página (HTML raw)**: Usaremos `<button>` con estilos nativos idénticos a los de `ProfilePrivacyPage.jsx` para garantizar consistencia estructural.

### 2. Implementación de Pantalla (`src/features/profile/pages/`)

#### [NEW] `ManagePrivacyPage.jsx`
- **Layout General**: `max-w-[1200px]` con espaciados `p-4 md:p-6 lg:p-8`. Envuelto en un `Card` gigante de fondo `#202020` y bordes `#3a3a3a`.
- **Cabecera**: Título "Administrar servicios de privacidad" y texto "Estos cambios pueden tardar en confirmarse en nuestro sistema.".
- **Cuerpo Central**:
  - Contenedor interno tipo Row (fondo `#292929`, flex, `justify-between`, `items-center`, redondeado, con padding).
  - Título "Permisos de localización" y texto explicativo a la izquierda.
  - El componente `ToggleSwitch` a la derecha.
- **Footer**: Bloque con `border-t border-[#3a3a3a]` y los botones "Volver" (con flecha `<-`) y "Cancelar" alineados en sus respectivos extremos, disparando la navegación de regreso a `/client/profile/profile-privacy`.

### 3. Actualización de Rutas (`src/app/router/`)

#### [MODIFY] `AppRouter.jsx`
- Agregar la ruta `/profile/profile-privacy/manage-privacy` y mapearla al nuevo componente `ManagePrivacyPage`.

## User Review Required
- Revisa el plan. El requerimiento se alinea de forma directa con los componentes `ToggleSwitch` genéricos que ya armamos previamente, garantizando la velocidad y la modularidad del código según tus reglas de arquitectura.

## Verification Plan
1. Iniciar el servidor local (`npm run dev`).
2. Navegar de `Privacidad` a `Administrar privacidad` (haciendo click en la opción correspondiente).
3. Validar el layout, rastro de navegación y funcionamiento del `ToggleSwitch` con la imagen de referencia.
4. Validar el funcionamiento de los botones inferiores para regresar a Privacidad.
