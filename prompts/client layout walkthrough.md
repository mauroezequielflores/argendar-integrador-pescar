# Client Layout Walkthrough

## Problema Inicial
El frontend no compilaba y arrojaba el siguiente error en consola:
```
ClientLayout.jsx:6 Uncaught SyntaxError: The requested module '/node_modules/.vite/deps/@heroicons_react_24_outline.js?v=b94fbb96' does not provide an export named 'StorefrontIcon' (at ClientLayout.jsx:6:3)
```

## Causa
El proyecto está utilizando la versión 2 de `@heroicons/react`. En esta versión, el ícono que anteriormente se llamaba `StorefrontIcon` fue renombrado a `BuildingStorefrontIcon`.

## Solución Aplicada
1. **Archivo modificado**: `frontend/src/app/layouts/ClientLayout.jsx`
2. **Cambio en las importaciones**:
   ```diff
   -  StorefrontIcon,
   +  BuildingStorefrontIcon,
   ```
3. **Cambio en el uso dentro del componente**:
   ```diff
   -  <SidebarItem to="/client/marketplace" icon={StorefrontIcon} label="Marketplace" onClick={closeSidebar} />
   +  <SidebarItem to="/client/marketplace" icon={BuildingStorefrontIcon} label="Marketplace" onClick={closeSidebar} />
   ```

Con estos ajustes, el frontend vuelve a compilar y funcionar correctamente respetando la versión actual de la librería de íconos.
