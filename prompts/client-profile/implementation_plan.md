# Implementación de "Mi Perfil" (Cliente)

Este plan detalla la construcción de la pantalla "Mi Perfil" basándose en las instrucciones de `prompt-real-client-profile.md` y las capturas proporcionadas, respetando la arquitectura y estilos de `prompt-recreacion-de-pantallas.md`.

## Open Questions

- Las capturas muestran iconos específicos (ej. tarjeta de crédito, escudo). Usaré `@heroicons/react/24/outline` para todos ellos. ¿Está bien usar iconos aproximados si no hay uno idéntico en Heroicons?
- Mencionaste que el botón "Editar perfil público" debería redirigir a `/client/profile/edit-profile`. Al igual que antes, ¿deseas que cree *placeholders* vacíos para esa ruta y las de configuración (ajustes, privacidad, pagos) para que los botones funcionen al hacer clic?

## Proposed Changes

La pantalla se construirá dentro del módulo (feature) `profile`. Se dividirá en subcomponentes para mantener el código limpio y modular (Regla 10).

### Feature: Profile (`frontend/src/features/profile/`)

#### [NEW] `data/mockProfile.js`
- Contendrá los datos estáticos de prueba (mocks) simulando las respuestas de los endpoints solicitados (`/api/v1/clients/me` y `/api/v1/clients/me/public-profile`).
- Incluirá nombre, email, fecha de registro, descripción pendiente, etc.

#### [NEW] `components/ProfileHeader.jsx`
- Componente superior que renderizará el Avatar grande, el "Nombre Apellido", el texto "Cliente verificado" con su indicador verde, y el botón delineado "Editar perfil público".

#### [NEW] `components/PublicProfileTab.jsx`
- Contenido de la pestaña "Perfil público".
- Recreará las 4 tarjetas (Cards) de la captura:
  1. **Sobre mi**: Descripción y enlace naranja "Leer biografía completa".
  2. **Detalles**: Lista con íconos para correo, ubicación y fecha de registro.
  3. **Resumen de Calificaciones**: Promedio grande (0.0), estrellas y barras de progreso por nivel.
  4. **Opiniones recientes**: *Empty state* centrado con el botón primario naranja "Solicitar servicio" (que redirigirá al Marketplace).

#### [NEW] `components/ProfileInfoTab.jsx`
- Contenido de la pestaña "Información de perfil".
- Renderizará las 3 tarjetas tipo botón (Configurar Perfil, Privacidad, Métodos de pago) usando *flexbox* y bordes redondeados sutiles, junto con la flecha `ChevronRightIcon`.

#### [MODIFY] `pages/ProfilePage.jsx`
- Reemplazará el placeholder actual.
- Mantendrá el estado activo de las pestañas (`activeTab`: 'public' | 'info').
- Renderizará las pestañas (Tabs) con su respectiva línea inferior naranja (`#F78736`) cuando estén activas.
- Renderizará condicionalmente `PublicProfileTab` o `ProfileInfoTab` según la pestaña seleccionada.

### Estilos y Diseño (Tailwind)
- Fondo base de la vista: `#202020`
- Color de las tarjetas (Cards): `#292929`
- Textos primarios: `#FFFFFF`, Textos secundarios/bordes: `#A8A8AA`
- Botones/Acentos: `#F78736` (Naranja)
- Botón "Editar perfil público": Variante delineada (borde `#3a3a3a` o `#727272`, texto blanco).

## Verification Plan

### Manual Verification
1. Abrir el proyecto y navegar a `/client/profile` (desde el menú lateral "Mi perfil").
2. Verificar que se muestre el `ProfileHeader` idéntico a las capturas.
3. Hacer clic entre las pestañas "Perfil público" e "Información de perfil" y comprobar el intercambio de vistas sin recarga de página.
4. En "Perfil público", comprobar que el botón "Solicitar servicio" redirige a `/client/marketplace`.
5. En "Información de perfil", comprobar que el diseño de las tarjetas tipo botón coincida con el espacio y bordes de la captura.
