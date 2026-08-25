# Plan de Implementación: Pantalla Privacidad

Implementaremos la pantalla "Privacidad" basándonos en la historia de usuario `profile-privacy-userstory.md`, la imagen adjunta, y las reglas estrictas de arquitectura del frontend (`prompt-recreacion-de-pantallas.md`).

## Proposed Changes

### 1. Nuevos Componentes Reutilizables (`src/components/ui/`)

#### [NEW] `NavRow.jsx`
- **Propósito**: Componente visual para filas de navegación en menús de ajustes (settings). Contiene un ícono izquierdo, un título, un subtítulo y una flecha (chevron) a la derecha, tal como se muestra en la captura.
- **Props**: `icon`, `title`, `subtitle`, `onClick`, `className`.
- **UI**: Fondo transparente o `#292929` (según se herede), contenedor flex, borde inferior separador (`border-b border-[#3a3a3a]`), transiciones `hover:bg-[#3a3a3a]` para feedback interactivo.

### 2. Componentes Existentes a Reutilizar
- **`Card.jsx`**: Envolverá tanto la vista entera como el bloque interno "Gestioná la privacidad de tu cuenta".
- **`Breadcrumbs.jsx`**: Rastro de navegación superior.
- **Botones de pie de página (HTML raw)**: Usaremos `<button>` con estilos nativos idénticos a los de `EditProfileSettingsPage.jsx` para garantizar consistencia milimétrica.

### 3. Implementación de Pantalla (`src/features/profile/pages/`)

#### [MODIFY] `ProfilePrivacyPage.jsx`
- **Layout General**: `max-w-[1200px]` con espaciados `p-4 md:p-6 lg:p-8`. Envuelto en un `Card` gigante de fondo `#202020` y bordes oscuros `#3a3a3a`.
- **Cabecera**: Título "Privacidad", bajada descriptiva, separados por `border-b`.
- **Cuerpo Central**:
  - Contenedor interno tipo Card (fondo `#292929`, borde `#3a3a3a`, `overflow-hidden`).
  - Título secundario "Gestioná la privacidad de tu cuenta" con padding interno.
  - Dos instancias de `NavRow`:
    1. "Administrar permisos" usando ícono `IdentificationIcon`.
    2. "Configurar Cookies" usando ícono `ShieldCheckIcon` o `TicketIcon`.
- **Footer**: Bloque con `border-t border-[#3a3a3a]` y los botones "Volver" y "Cancelar" alineados en sus respectivos extremos, disparando la navegación de regreso a `/client/profile`.

### 4. Actualización de Rutas
- Revisar `AppRouter.jsx` para garantizar que `profile/profile-privacy` esté correctamente apuntando a `ProfilePrivacyPage.jsx` (esto ya debería estar, pero se validará).

## User Review Required
- Confirmar si estás de acuerdo con la abstracción del componente genérico `NavRow.jsx` en `components/ui/` para que pueda ser reusado luego en otras pantallas de Configuración generales.

## Verification Plan
1. Iniciar servidor con `npm run dev` y navegar a `/client/profile/profile-privacy`.
2. Validar colores (`#202020` vs `#292929`), tipografía, bordes y funcionalidad de los clics en las filas y los botones inferiores.
3. Verificar la limpieza de importaciones cumpliendo la arquitectura.
