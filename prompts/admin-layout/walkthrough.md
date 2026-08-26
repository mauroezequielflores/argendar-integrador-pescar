# Admin Layout — Walkthrough

## Que se implemento

Se creo el layout del Administrador (`AdminLayout`) y se conecto al sistema de rutas existente, completando la arquitectura de los tres roles de Argendar: Cliente, Profesional y **Administrador**.

---

## Archivos modificados

### `frontend/src/constants/routes.js`
Agregadas constantes faltantes:
- `ADMIN_TRANSACTIONS: "/admin/transactions"`
- `ADMIN_MODERATION:   "/admin/moderation"`
- `ADMIN_REPORTS:      "/admin/reports"`

---

### `frontend/src/app/layouts/AdminLayout.jsx` <- NUEVO

Layout completo del Administrador, identico en estructura a `ClientLayout` y `ProfessionalLayout`.

| Seccion   | Item          | Icono                     | Ruta                  |
|-----------|---------------|---------------------------|-----------------------|
| ACTIVIDAD | Dashboard     | HomeIcon                  | /admin/dashboard      |
| ACTIVIDAD | Usuarios      | UsersIcon                 | /admin/users          |
| ACTIVIDAD | Transacciones | CreditCardIcon            | /admin/transactions   |
| ACTIVIDAD | Moderacion    | ShieldCheckIcon           | /admin/moderation     |
| ACTIVIDAD | Consultas     | ChatBubbleLeftRightIcon   | /admin/reports        |
| MI CUENTA | Configuracion | Cog6ToothIcon             | /admin/settings       |

---

### `frontend/src/features/home/pages/AdminDashboardPage.jsx` <- NUEVO
Pantalla placeholder mapeada a `/admin/dashboard`.

---

### `frontend/src/app/router/AppRouter.jsx` <- MODIFICADO

**Antes**: bloque `/admin/*` con `<Routes>` anidado (incorrecto, sin Outlet).

**Despues**: patron correcto con `<AdminLayout />` como Outlet:

```jsx
<Route path="/admin/*" element={<ProtectedRoute><RoleRoute ...><AdminLayout /></RoleRoute></ProtectedRoute>}>
  <Route path="dashboard" element={<AdminDashboardPage />} />
  <Route path="home"      element={<AdminHomePage />} />
  <Route path="*"         element={<Navigate to="dashboard" replace />} />
</Route>
```

---

## Verificacion

- El item "Dashboard" se marca activo en `/admin/dashboard` (NavLink en SidebarItem)
- El boton colapsar funciona en desktop
- El sidebar se oculta con overlay en mobile
- "Cerrar sesion" navega a `/login` tras confirmar
- No se modifico `package.json` ni configuraciones de build
- No hay `.ts/.tsx`
- Componentes genericos reutilizados sin duplicar
