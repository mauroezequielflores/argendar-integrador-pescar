# Walkthrough: Editar configuraciones de perfil

## Resumen de la Implementación
Se implementó la pantalla de **Editar configuraciones de perfil** (`/client/profile/profile-settings/edit-profile-settings`) cumpliendo con los criterios de la historia de usuario `edit-profile-settings-userstory.md` y respetando el diseño de la imagen adjunta.

### Nuevos Componentes Reutilizables
Para esta pantalla se extrajeron componentes clave que unifican el diseño de los formularios de edición:
1. **`ToggleSwitch.jsx`**: Un switch nativo (estilo toggle iOS) adaptado al modo oscuro. Muestra el estado activo en el color de acento (`#F78736`) y estado inactivo en fondo neutro (`#3a3a3a`).
2. **`EditField.jsx`**: Un componente agrupador muy potente que incluye:
   - Etiqueta superior con soporte para **asterisco de obligatoriedad** rojo y **tilde verde** de verificación.
   - El componente base `Input.jsx` (el cual modifiqué internamente para poder soportar **prefijos internos**, como el del DNI).
   - El botón cuadrado con el ícono del lápiz alineado perfectamente a la derecha. Todo el bloque gestiona de forma local un estado para desbloquear/bloquear el *input* al presionar el lápiz.

### Estructura de la Pantalla `EditProfileSettingsPage.jsx`
- **Layout y Contenedor Principal**: El contenedor principal envuelve todo con borde oscuro y utiliza el color de fondo base `#202020`. No existen sub-tarjetas envolventes por bloque (a diferencia de la pantalla anterior), sino que los campos de texto dictan la estructura visual.
- **Información Personal**: Renderiza el campo Nombre y Apellido alineados en grilla de 2 columnas en desktop, el prefijo del DNI, y utiliza los bloques `InfoAlert` grises intercalados que alertan sobre el documento de identidad.
- **Ubicación**: Incluye una tarjeta interna (`#292929`) con formato específico para mostrar la ubicación actual (simulada), su título descriptivo y botón de lápiz independiente a la derecha del título del bloque.
- **Datos de la cuenta**: Muestra combinaciones de `EditField` con los `ToggleSwitch` de los permisos de comunicaciones, manteniendo el diseño de contenedores grises y alineaciones uniformes (restringiendo su `max-width` para que calcen exacto con la imagen de referencia).

## Notas adicionales
- Todos los botones de cancelar, editar y los inputs están desactivados inicialmente (los inputs habilitables vía el botón lápiz localmente).
- La tipografía, colores y márgenes respetan la guía estricta de `prompt-recreacion-de-pantallas.md`.

Para visualizar los cambios de manera local, inicia tu servidor con `npm run dev` y navega a `/client/profile/profile-settings/edit-profile-settings`.
