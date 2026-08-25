# Walkthrough: Pantalla Configurar Perfil

## Resumen de la Implementación
Se implementó la pantalla de **Configurar Perfil** (`/client/profile/profile-settings`) siguiendo estrictamente la historia de usuario `profile-settings.md` y las reglas del manual de recreación de interfaces.

### Componentes Reutilizables Creados
Se abstrajeron componentes modulares que siguen la línea visual y podrán ser usados en futuras pantallas de la sección "Mi Cuenta":
1. **`Breadcrumbs.jsx`**: Rastro de navegación superior con soporte de iconos intercalados.
2. **`InfoRow.jsx`**: Unidad mínima de lista de información. Incluye soporte nativo para renderizar íconos en contenedores grises (tamaño estándar `h-10 w-10`), títulos en blanco (`#FFFFFF`), descripciones sutiles (`#A8A8AA`) y un estado visual verificado con el `CheckCircleIcon` de color verde.

### Estructura de la Pantalla `ProfileSettingsPage.jsx`
- **Contenedor Raíz**: Renderiza con el fondo principal `#202020` definido en las variables.
- **Navegación**: Utiliza `Breadcrumbs` con "Mi perfil > Configurar perfil".
- **Tarjetas por Bloque**: 
  - "Información personal", "Ubicación" y "Datos de la cuenta".
  - Cada bloque es un componente `Card` (fondo `#292929`, borde `#3a3a3a`) para destacar del fondo de la aplicación.
  - Los títulos `h2` ("Información personal", etc.) residen dentro del `Card` para igualar al milímetro la captura de diseño adjunta.
- **Acciones y Navegación**:
  - Botón superior "Editar" con ícono de lápiz en formato de botón secundario.
  - Footer con botones "Volver" y "Cancelar" estilo *ghost*, con redirección fluida `navigate("/client/profile")`.
- **Manejo de Estados**: 
  - Se agregó una simulación de estado `isLoading` al cargar la pantalla mediante un `Loader` reutilizado para cumplir con la regla 2 del documento de arquitectura frontend provisto.

## Resultados de Validación
- ✔️ Jerarquía de color `Fondo #202020` vs `Cards #292929` cumplida estrictamente.
- ✔️ Tipografía e íconos: Se utilizaron variaciones de Heroicons (Outline general, Solid para el tilde de confirmación).
- ✔️ Alineamiento y Layouts: Usos precisos de Flexbox.

Para probarlo localmente, acceda a `/client/profile/profile-settings` una vez haya iniciado `npm run dev`.
