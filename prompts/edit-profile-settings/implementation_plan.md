# Plan de Implementación: Editar configuraciones de perfil

Implementaremos la pantalla "Editar configuraciones de perfil" basándonos en la historia de usuario `edit-profile-settings-userstory.md`, el diseño provisto en la imagen, y respetando estrictamente la guía visual del archivo `prompt-recreacion-de-pantallas.md`.

## Proposed Changes

### 1. Nuevos Componentes Reutilizables (`src/components/ui/`)

#### [NEW] `ToggleSwitch.jsx`
- **Propósito**: Renderizar un switch de encendido/apagado estilo iOS/Tailwind, usado para los permisos de comunicación.
- **Props**: `enabled`, `onChange`.
- **UI**: Fondo `#3a3a3a` (apagado) / `#F78736` (encendido), con un círculo blanco deslizante.

#### [NEW] `EditField.jsx`
- **Propósito**: Componente que agrupa la etiqueta (con asterisco o check verde), el campo de texto y el botón de edición contiguo.
- **Props**: `label`, `value`, `prefix`, `required`, `verified`, `onEdit`.
- **UI**: Un flex container vertical para la etiqueta. Abajo, un flex horizontal que incluye el `<Input />` bloqueado y un `<button>` cuadrado a la derecha con el ícono del lápiz (`bg-[#2e2e2e]` y borde `#3a3a3a`).

### 2. Componentes Existentes a Reutilizar
- **`Breadcrumbs.jsx`**: Para mostrar "Mi perfil > Configurar perfil > Editar configuraciones de perfil".
- **`InfoAlert.jsx`**: Ya creado previamente, para los bloques grises con ícono de "i" (alertas de DNI, nombre, etc.).
- **`Card.jsx`**, **`Input.jsx`**, **`Button.jsx`**.

### 3. Implementación de Pantalla (`src/features/profile/pages/`)

#### [NEW] `EditProfileSettingsPage.jsx`
- **Layout General**: Contenedor `max-w-[1200px]`, sin fondo forzado para adoptar el `#202020` de la app. Contenedor interno principal `Card` gigante con borde.
- **Cabecera**: Título "Editar configuraciones de perfil", texto secundario, separados por `border-b border-[#3a3a3a]`.
- **Sección Información personal**: 
  - Grilla de 2 columnas en desktop para Nombre y Apellido.
  - Alerta `InfoAlert` para el aviso de coincidencia.
  - Campo de DNI utilizando `EditField` con el prefijo "DNI".
  - Alerta `InfoAlert` del DNI.
- **Sección Ubicación**:
  - Cabecera de sección con título y texto. Botón de editar a la derecha de la cabecera.
  - Tarjeta interior oscura con el ícono de mapa, texto "UBICACIÓN PROFESIONAL PRINCIPAL" y dirección en gris.
- **Sección Datos de la cuenta**:
  - `EditField` para Correo electrónico.
  - Fila flex para "Permisos de comunicaciones" conteniendo el título, texto descriptivo y el `ToggleSwitch` a la derecha.
  - `EditField` para Número de teléfono.
  - Fila flex para permisos SMS.
  - `EditField` para Contraseña con el texto ofuscado / "Cambiar contraseña".
  - Alerta `InfoAlert` final para la verificación en 2 pasos.
- **Footer**: Botones "Volver" (alineado a la izquierda) y "Cancelar" (a la derecha), ambos con estilos `.ghost` e igual dimensión que en pantallas anteriores, utilizando `<button>` raw si es necesario para calcar tamaños o el `<Button>` configurado en `size="sm"`.

## User Review Required

- Confirmar si los campos de input (`EditField`) deben mostrarse siempre bloqueados (disabled/readonly) ya que la edición final requiere un flujo separado (ej. modales u otras pantallas) o si debo implementar lógica local para desbloquear el input al hacer click en el lápiz. (Por defecto, haré que el input se desbloquee localmente para simular el comportamiento o que el botón simplemente ejecute un `console.log`, ya que la US dice "botón con ícono de lápiz para habilitar su edición").
- Las rutas para retornar serán `/client/profile/profile-settings`.

## Verification Plan
1. Iniciar servidor con `npm run dev` y navegar a `/client/profile/profile-settings/edit-profile-settings`.
2. Validar que la interfaz respeta el mock adjunto: campos, padding, colores de fondo `#202020` y `#292929`, colores de textos y alertas grises.
3. Comprobar interactividad de los Toggles y botones "Volver" / "Cancelar".
