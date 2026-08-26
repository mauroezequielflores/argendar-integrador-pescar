# Plan de Implementación: Configurar Cookies

Implementaremos la pantalla "Configurar cookies" basándonos en la imagen adjunta (dado que el archivo `.md` de la historia de usuario está vacío) y aplicando las reglas estrictas de arquitectura del frontend (`prompt-recreacion-de-pantallas.md`).

## Proposed Changes

### 1. Componentes Existentes a Reutilizar
- **`Card.jsx`** (`src/components/ui/`): Envolverá la vista entera.
- **`Breadcrumbs.jsx`** (`src/components/ui/`): Para la ruta `Mi perfil > Privacidad > Configurar cookies`. (Nota: La captura dice "Administrar privacidad" en el breadcrumb, pero corregiremos esto semánticamente a "Configurar cookies" acorde al título real de la pantalla).
- **`ToggleSwitch.jsx`** (`src/components/ui/`): El interruptor visual para la activación/desactivación de cada tipo de cookie.
- **Botones de pie de página (HTML raw)**: `<button>` con estilos idénticos a los de `ManagePrivacyPage.jsx` para garantizar consistencia.

### 2. Implementación de Pantalla (`src/features/profile/pages/`)

#### [NEW] `CookieSettingsPage.jsx`
- **Layout General**: `max-w-[1200px]` con espaciados `p-4 md:p-6 lg:p-8`. Envuelto en un `Card` de fondo `#202020` y bordes `#3a3a3a`.
- **Cabecera**: Título "Configurar cookies" y texto descriptivo sobre la tecnología de cookies.
- **Cuerpo Central**:
  - Un contenedor `flex flex-col gap-4` que iterará sobre un arreglo de 4 tipos de cookies (Esenciales, Analíticas, de Rendimiento, Funcionales).
  - Cada bloque (tarjeta) tendrá:
    - Fondo `#292929`, flex, `justify-between`, `items-center`, bordes redondeados, borde sutil `#3a3a3a`, con padding `px-6 py-5`.
    - Título y texto explicativo a la izquierda.
    - El componente `ToggleSwitch` a la derecha. (Para las *Cookies esenciales*, le pasaremos un estado visual desactivado o mantendremos la coherencia visual con la imagen).
- **Footer**: Bloque inferior con botones "Volver" (con flecha `<-`) y "Cancelar" alineados en sus respectivos extremos, navegando de regreso a `/client/profile/profile-privacy`.

### 3. Actualización de Rutas (`src/app/router/`)

#### [MODIFY] `AppRouter.jsx`
- Agregar la ruta `/profile/profile-privacy/cookie-settings` y mapearla al nuevo componente `CookieSettingsPage`.

## User Review Required
- El archivo `cookie-settings-userstory.md` está en blanco en el disco. Me basaré al 100% en la captura de pantalla provista. Por favor, confirma si esto es correcto.

## Verification Plan
1. Iniciar el servidor local (`npm run dev`).
2. Navegar a `Mi perfil > Privacidad > Configurar Cookies`.
3. Validar la renderización de las 4 tarjetas y el funcionamiento individual de sus interruptores (ToggleSwitches).
4. Validar el enrutamiento de regreso hacia Privacidad.
