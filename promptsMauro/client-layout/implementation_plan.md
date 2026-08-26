# Implementación de Layout Global y Componentes UI Reutilizables

Este plan detalla la refactorización arquitectónica solicitada para la interfaz base de la aplicación. El objetivo es estructurar la UI de manera que el Header abarque el 100% del ancho, el Sidebar se encuentre debajo y sea colapsable, y que los componentes clave se extraigan a una biblioteca de UI reutilizable para futuros roles (Admin, Profesional).

## Open Questions

- **Comportamiento del Sidebar Colapsado:** Cuando el sidebar se colapse (mediante el nuevo icono), ¿deseas que desaparezca por completo o que se reduzca a una versión "mini" mostrando solo los iconos (estilo barra lateral compacta)? Por defecto implementaré la versión compacta (iconos visibles) ya que es la mejor práctica de UX para navegación principal.

## Proposed Changes

### 1. Refactorización Estructural (Flex/Grid)
Cambiaremos la estructura base del `ClientLayout`. Actualmente es una fila (Row) donde el Sidebar y la columna derecha (Header + Main) comparten espacio.
La nueva estructura será una columna principal (Col):
1. **Fila 1 (Header):** Ocupará el 100% del ancho (Top nav).
2. **Fila 2 (Body):** Un contenedor flexible que contiene el Sidebar a la izquierda y el contenido principal (`<Outlet />`) a la derecha.

### 2. Creación de Componentes UI (`frontend/src/components/ui/`)

#### [NEW] `Avatar.jsx`
- Componente visual para mostrar el avatar del usuario.
- Aceptará props como `initials`, `imageUrl`, `size` (sm, md, lg), y `isVerified` para poder ser usado tanto en el Header como en otras vistas (ej. la página de perfil que acabamos de hacer).

#### [NEW] `Header.jsx`
- Componente base de navegación superior.
- Renderizará el Logo (imagen y texto en colores) a la izquierda.
- Renderizará la barra de búsqueda centrada (y alineada con respecto al borde derecho del sidebar colapsado).
- Renderizará las acciones a la derecha en el orden requerido (Nombre de usuario, Avatar, Campana de notificaciones, Configuración).

#### [NEW] `Sidebar.jsx`
- Componente base para la barra lateral.
- Manejará su propio estado para mostrarse expandido o en modo reducido (solo iconos).
- Tendrá el botón para colapsarlo flotando en el borde derecho, perfectamente alineado sobre la línea gris divisoria.
- Aceptará una lista de enlaces agrupados por secciones (Actividad, Descubrir, Mi Cuenta, etc.).

#### [NEW] `SidebarItem.jsx`
- Componente extraído de `ClientLayout` que renderizará cada enlace (NavLink).
- Responderá al estado colapsado del Sidebar para ocultar el texto y mostrar un *tooltip* o simplemente el icono centrado.

### 3. Actualización de Layouts

#### [MODIFY] `frontend/src/app/layouts/ClientLayout.jsx`
- Se limpiará drásticamente.
- Importará y ensamblará los nuevos componentes (`Header` y `Sidebar`).
- Pasará la configuración específica del cliente (rutas, iconos de Heroicons) al `Sidebar` y `Header`.

## Verification Plan

### Verificación Manual
1. Iniciar la aplicación e ingresar con un rol de cliente.
2. Verificar que el Header ocupa todo el ancho de la pantalla (de borde a borde).
3. Verificar que el logo "Argendar" está ahora en el Header con la imagen SVG naranja y los colores de texto correspondientes.
4. Interactuar con el botón de colapsar del Sidebar; verificar que la barra se reduce/oculta suavemente y que el botón se ubica en el punto medio de la línea divisoria.
5. Comprobar que la barra de búsqueda arranca exactamente luego de finalizar el bloque izquierdo.
