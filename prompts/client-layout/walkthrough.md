# Refactorización del Layout Finalizada

He terminado de reconstruir toda la estructura base (Layout) de la aplicación para cumplir con tus nuevos requerimientos de diseño y modularidad.

## Cambios Estructurales

1. **Header Full-Width**: 
   Cambié la estructura a un Flex de tipo columna (arriba/abajo). Ahora el `Header` abarca el 100% de la pantalla de lado a lado y permanece anclado en la parte superior.
   Se ha incorporado el logo SVG oficial y el texto "Argendar" formateado con los colores corporativos. La barra de búsqueda se alineó centralmente con un inicio dinámico exacto al borde del sidebar.
   
2. **Sidebar Colapsable**:
   El `Sidebar` fue movido debajo del `Header`. Le agregué un botón en la parte superior derecha para expandirlo o colapsarlo a una versión "mini" que solo muestra los iconos. Este botón se diseñó para "flotar" y cruzar con absoluta simetría la fina línea gris que divide el sidebar del contenido central.

## Componentes Extraídos

Siguiendo las mejores prácticas, limpié el archivo `ClientLayout.jsx` extrayendo las partes importantes a componentes UI reutilizables que podrás usar luego para el layout del Administrador y el Profesional. 
Los nuevos componentes se encuentran en `frontend/src/components/ui/`:

- **`Header.jsx`**: Barra de navegación superior (con alineaciones y logo finales).
- **`Sidebar.jsx`**: Barra lateral dinámica con botón colapsable flotante.
- **`SidebarItem.jsx`**: Ítem individual de la barra lateral (encapsula los `NavLinks` de React Router).
- **`Avatar.jsx`**: Componente estándar para mostrar el avatar de usuario con iniciales y estado verificado (reutilizable tanto en el Header como en perfiles de usuario).

## Verificación
El código ya ha sido compilado por Vite sin errores. Si accedes a la aplicación, notarás que el menú ahora puede colapsarse y que la distribución del Header es de borde a borde, con la interfaz cumpliendo fielmente tus instrucciones.
