# Admin Layout — Implementation Plan

## Descripcion

Crear el layout del Administrador (`AdminLayout`) siguiendo el mismo patron arquitectonico de `ClientLayout` y `ProfessionalLayout`, reutilizando los componentes genericos `Sidebar`, `SidebarItem` y `Header`. Luego conectar el layout al `AppRouter` y crear la pagina `AdminDashboardPage` como primera pantalla del area admin.

La referencia visual muestra:
- **Header**: logo Argendar, barra de busqueda, nombre "Apellido Nombre", Avatar, icono configuracion
- **Sidebar izquierdo**: boton colapsar arriba a la derecha, seccion "ACTIVIDAD" con items: Dashboard (activo), Usuarios, Transacciones, Moderacion, Consultas. Seccion "MI CUENTA": Configuracion. Al pie: separador + "Cerrar sesion"
- **Area principal**: fondo `#202020` vacio (Outlet)

---

## Cambios realizados

### `constants/routes.js` — MODIFICADO
Agregadas las constantes faltantes: `ADMIN_TRANSACTIONS`, `ADMIN_MODERATION`, `ADMIN_REPORTS`

### `app/layouts/AdminLayout.jsx` — NUEVO
- Reutiliza `Header`, `Sidebar`, `SidebarItem`
- Secciones del sidebar:
  - **ACTIVIDAD**: Dashboard, Usuarios, Transacciones, Moderacion, Consultas (-> /admin/reports)
  - **MI CUENTA**: Configuracion
- Iconos Heroicons outline: `HomeIcon`, `UsersIcon`, `CreditCardIcon`, `ShieldCheckIcon`, `ChatBubbleLeftRightIcon`, `Cog6ToothIcon`
- `handleLogout` con `window.confirm` -> navega a `ROUTES.LOGIN`
- Responsive identico a ClientLayout / ProfessionalLayout

### `features/home/pages/AdminDashboardPage.jsx` — NUEVO
Placeholder para `/admin/dashboard`. Area principal vacia coherente con la imagen de referencia.

### `app/router/AppRouter.jsx` — MODIFICADO
- Imports: `AdminLayout`, `AdminDashboardPage`
- Bloque `/admin/*` reemplazado de `<Routes>` anidado al patron correcto con Outlet:
  - `dashboard` -> `<AdminDashboardPage />`
  - `home` -> `<AdminHomePage />`
  - `*` -> redirect a `dashboard`

---

## Checklist final

- [x] No se agrego ni actualizo ninguna dependencia
- [x] No se modifico package.json, configuracion de Vite/Tailwind/ESLint
- [x] No hay archivos .ts/.tsx
- [x] No hay llamadas HTTP ni logica de autenticacion real
- [x] Los valores de diseno coinciden con la seccion 6 del context
- [x] Se reutilizaron componentes existentes (Header, Sidebar, SidebarItem)
- [x] Ningun componente generico duplicado dentro de features/
- [x] No se adelanto funcionalidad fuera del alcance de la HU
