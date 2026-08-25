# Plan de Implementación: Configurar Perfil

Implementaremos la pantalla "Configurar perfil" basándonos en la historia de usuario `profile-settings.md`, el diseño provisto y respetando de manera estricta los lineamientos de la sección 5 del documento `prompt-recreacion-de-pantallas.md`.

## Proposed Changes

### 1. Nuevos Componentes Reutilizables (`src/components/ui/`)

#### [NEW] `Breadcrumbs.jsx`
- **Propósito**: Mostrar el rastro de navegación en la parte superior (ej. "Mi perfil > Configurar perfil").
- **UI**: Texto secundario (`#A8A8AA`) para enlaces previos y texto principal (`#FFFFFF`) para la página actual.

#### [NEW] `InfoRow.jsx`
- **Propósito**: Renderizar una fila estandarizada de información (utilizada en "Información personal", "Ubicación", etc.).
- **Props**: `icon` (Heroicon), `title` (texto principal), `subtitle` (texto secundario) y `verified` (booleano).
- **UI**: Incluirá el ícono contenedor gris a la izquierda, los textos al centro y opcionalmente el ícono circular de validación (check verde) a la derecha.

### 2. Implementación de Pantalla (`src/features/profile/pages/`)

#### [MODIFY] `ProfileSettingsPage.jsx`
- **Layout General**: Contenedor principal centrado, respetando el fondo base de la app (`#202020`).
- **Navegación**: Utilizará el componente `Breadcrumbs` al tope de la página.
- **Encabezado del Contenedor**: Título `h1` "Configurar perfil", su párrafo descriptivo y el botón secundario "Editar" alineado a la derecha. Se agregará un borde/separador inferior (`border-[#3a3a3a]`).
- **Bloques Agrupadores**:
  - Se utilizará el componente `Card` existente (`bg-[#292929]`) para agrupar filas de información.
  - **Bloque 1**: "Información personal" conteniendo dos `InfoRow` (Nombre/Apellido y DNI).
  - **Bloque 2**: "Ubicación" conteniendo un `InfoRow`.
  - **Bloque 3**: "Datos de la cuenta" conteniendo tres `InfoRow` (Email, Celular y Contraseña).
- **Botones de Acción (Footer)**: Un contenedor inferior (alineado a la izquierda el botón "Volver" con flecha, y a la derecha "Cancelar"). Ambos utilizarán estilos de botón fantasma/borde y realizarán un `navigate` hacia la pantalla previa.
- **Estados Simulados**: Incluiremos un pequeño `Loader` inicial (simulando una carga) para respetar la regla de la sección 2 del manual de recreación.

## User Review Required

- ¿Deseas que los botones de "Volver" y "Cancelar" redirijan directamente a `/client/profile`? (Actualmente lo programaré así, ya que simula regresar a la vista anterior).
- Los datos de usuario serán simulados hardcodeados en el componente para encajar con el diseño (ej. "Hernan Castro"). Si existe un mock actualizado en `data/mockProfile.js`, usaré esos datos. 

## Verification Plan
1. Correr el proyecto con `npm run dev`.
2. Navegar directamente a `/client/profile/profile-settings`.
3. Revisar que los colores de tarjetas (`#292929`), bordes y jerarquía tipográfica cumplan estrictamente con la guía.
4. Validar que la posición de los componentes (Breadcrumb, Botones footer y filas de información) coincida visualmente al milímetro con la imagen de referencia.
