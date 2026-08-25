**Prompt: Recreación de pantallas — Argendar (Frontend)**

Actúa como un Desarrollador Frontend Junior especializado en React, arquitectura escalable y recreación de interfaces a partir de diseños de referencia.

1\. Reglas del proyecto existente

El proyecto ya existe con stack instalado. NO instalar, actualizar ni eliminar dependencias (npm install/update/uninstall, pnpm install, yarn add). NO modificar: package.json, package-lock.json, vite.config.js, eslint.config.js, configuración de Tailwind o Vite. Trabajar exclusivamente sobre código fuente con las herramientas ya disponibles.

Estructura raíz:

* /  
* ├── backend/     ← nunca modificar  
* ├── frontend/    ← todo el trabajo va acá  
* ├── docker-compose.yml  
* └── ...


Antes de usar una librería, verificar en frontend/package.json si ya está instalada. Si existe, usar esa versión sin reinstalar ni actualizar.

2\. Arquitectura completa del proyecto (carpetas)

El frontend se organiza con arquitectura basada en Features **más** un conjunto de carpetas compartidas a nivel src/. **No todo va dentro de features/**: antes de crear algo nuevo, identificar primero si corresponde a una carpeta compartida.

* src/  
* │  
* ├── app/  
* │   ├── layouts/  
* │   └── router/  
* │  
* ├── assets/  
* │   ├── brand/  
* │   ├── images/  
* │   ├── icons/  
* │   └── fonts/  
* │  
* ├── components/  
* │   └── ui/  
* │  
* ├── context/  
* ├── hooks/  
* ├── lib/  
* ├── utils/  
* ├── constants/  
* ├── validations/  
* │  
* ├── features/  
* │   ├── auth/  
* │   ├── agenda/  
* │   └── …/  
* │  
* ├── App.jsx  
* ├── main.jsx  
* └── index.css


**Regla de decisión** — antes de crear un archivo, preguntarse:

| Si es... | Va en... | No en... |
| :---- | :---- | :---- |
| La estructura visual compartida por varias pantallas de un rol (header, sidebar, nav) | app/layouts/ | Repetido dentro de cada pages/ de la feature |
| Definición de rutas, control de acceso o de rol | app/router/ | Adentro de una feature |
| Un componente sin lógica de negocio, reutilizable entre features (Button, Input, Modal, Badge, Card, Loader, EmptyState) | components/ui/ | Duplicado dentro de features/x/components/ |
| Un componente propio de una sola feature, sin uso fuera de ella | features/x/components/ | components/ui/ |
| Estado global compartido por toda la app (auth, tema, idioma, notificaciones) | context/ | Un useState local dentro de la feature |
| Un hook genérico sin relación con una feature específica (useDebounce, useLocalStorage, useOutsideClick) | hooks/ | features/x/hooks/ |
| Un hook que envuelve datos/estado propios de una feature (ej. useAgendaFilters) | features/x/hooks/ | hooks/ global |
| Configuración/inicialización de una librería externa (axios, queryClient, dayjs) | lib/ | Repetido en cada feature |
| Una función pura que transforma un dato (formatear fecha, agregar $) sin guardar estado | utils/ | features/x/services/ |
| Un valor fijo reutilizado en varios lugares (rutas, roles, mensajes, límites) | constants/ | Hardcodeado dentro de un componente |
| Un esquema de validación Zod usado por un formulario | validations/ | Definido inline en el componente |
| Recursos estáticos (logo, íconos, imágenes, fuentes) | assets/ | features/x/ |

2.1 app/layouts/

Define la estructura visual que comparten las pantallas de un mismo rol o contexto (Header, Sidebar, navegación, perfil, notificaciones, contenedor principal, footer). Si Cliente tiene 10 pantallas, ninguna repite el Header/Sidebar: todas se renderizan dentro de, por ejemplo, ClientLayout. Crear un layout por rol cuando la navegación difiera (ClientLayout, ProfessionalLayout, AdminLayout), reutilizando piezas comunes desde components/ui/ cuando sea posible.

2.2 app/router/

Controla qué pantalla se muestra según la URL y las condiciones de acceso:

* src/app/router/  
* ├── AppRouter.jsx      → Define las rutas principales.  
* ├── ProtectedRoute.jsx → Controla si el usuario puede acceder a una zona que requiere autenticación.  
* └── RoleRoute.jsx      → Controla si el rol del usuario tiene permiso para acceder a determinada ruta.


Toda ruta nueva se agrega acá, nunca dentro de una feature.

2.3 assets/

Recursos estáticos compartidos. Sin lógica. Solo archivos (brand/, images/, icons/, fonts/).

2.4 components/ui/

Componentes reutilizables sin lógica de negocio y sin llamadas a la API, independientes de cualquier módulo (Button, Input, Modal, Badge, Avatar, Card, DataTable, Loader, EmptyState). Único lugar permitido para componentes compartidos. Nunca duplicar un componente de UI dentro de una feature si ya existe acá.

2.5 context/

Estados globales de React que no pertenecen a un módulo específico (ThemeContext, AuthContext, LanguageContext, NotificationContext).

2.6 hooks/

Hooks reutilizables y genéricos que encapsulan lógica y no renderizan componentes, sin relación con una feature puntual (useDebounce, useLocalStorage, useOutsideClick, useWindowSize, useDarkMode).

2.7 lib/

Centraliza la configuración de librerías externas (axios.js, queryClient.js, dayjs.js).

2.8 utils/

Funciones auxiliares puras: reciben un dato y devuelven otro modificado, sin guardar estado (formatear fecha DD/MM/AAAA, agregar signo $ a un precio).

2.9 constants/

Valores fijos reutilizados en distintas partes de la app: rutas, estados, roles, mensajes, configuraciones, límites o valores máximos/mínimos.

2.10 validations/

Esquemas de validación (Zod) que definen qué datos son válidos antes de procesarlos o enviarlos:

* src/validations/  
* ├── login.schema.js  
* ├── register.schema.js  
* ├── service.schema.js  
* └── profile.schema.js  
    
  2.11 Raíz de src/  
* App.jsx: sin diseño visual, solo envuelve la app con TanStack Query y rutas.  
* index.css: directivas de Tailwind.  
* main.jsx: conecta React con index.html.  
  3\. Sin backend (en esta etapa)

No implementar llamadas HTTP, clientes HTTP, servicios conectados al servidor, consumo de APIs o autenticación real. Si una pantalla necesita datos, usar mocks estáticos locales dentro de data/ del módulo correspondiente.

Excepción — feature auth/: puede contener las pantallas de login/registro u otras donde se necesite o detecte validación de formulario (React Hook Form \+ Zod) y estados de error simulados, pero sin lógica de sesión, tokens ni llamadas reales.

Manejo de estado: solo useState/useReducer locales o Context API (context/). No usar Redux, Zustand ni Recoil (prohibidos también en la sección 4).

Estados de interfaz: aunque los datos sean mock, cada pantalla debe contemplar Loading, Empty State, Error y Success cuando aplique (por ejemplo, un array vacío en el mock para probar el Empty State).

4\. JavaScript únicamente

Prohibido TypeScript en cualquier forma: sin .ts/.tsx, sin interfaces, types, enums, generics ni tsconfig.json. Todo en .js/.jsx, ESModules, JavaScript moderno. Validación solo con Zod \+ React Hook Form.

Librerías prohibidas: Material UI, Bootstrap, Chakra UI, Ant Design, Styled Components, CSS Modules, Sass, Redux, Zustand, Recoil, Lucide, Font Awesome, o cualquier otra librería externa no autorizada. No usar estilos inline ni archivos CSS sueltos: todo con Tailwind.

5\. Recreación de capturas

Al recibir una captura, analizar: estructura, distribución, jerarquía visual, tamaños, espaciados, tipografía, colores, botones, inputs, iconos, tarjetas, navegación, estados, alineaciones, proporciones y comportamiento responsive inferible. Recrear con React \+ Tailwind CSS \+ Heroicons únicamente, sin librerías de componentes externas.

6\. Identidad visual (valores estrictos)

Respetar fielmente colores, tipografías, botones, tarjetas, inputs, iconos, bordes, sombras y espaciados de la captura. Si no hay captura, usar estos valores:

* Fondo: \#202020 | Cards: \#292929  
* Texto principal: \#FFFFFF | Texto secundario, outlines, placeholders: \#A8A8AA  
* Acento (naranja): \#F78736  
* Bordes de inputs y botones: 6px / 0.375rem  
* Tipografía Roboto: h1 32/700, h2 24/600, h3 18/600, body 14/400, small 12/400, text-xs  
* Padding: p-2.5 / p-3 / p-4 / p-6  
* Iconos: Heroicons outline, h-5 w-5 o h-6 w-6  
* Tener listos snippets de botón primario, secundario y fantasma (deshabilitado)

No reemplazar elementos por componentes genéricos si se pueden recrear con Tailwind.

7\. Roles

Roles de Argendar: Cliente, Profesional, Administrador. Cada uno tiene rutas, navegación y pantallas propias, resueltas mediante app/layouts/ y app/router/ — no mediante carpetas cliente/, profesional/, administrador/.

Arquitectura: Features \+ Roles \+ Rutas \+ Layouts \+ Componentes reutilizables.

8\. Reglas de cada Feature

Las Features representan módulos y funcionalidades. NO organizar todo el proyecto de esta manera:

* cliente/  
* profesional/  
* administrador/


Si se debe utilizar:

* features/  
* ├── auth/  
* ├── agenda/  
* ├── reservations/  
* ├── notifications/  
* ├── marketplace/  
* ├── profile/  
* ├── reviews/  
* ├── configurations/  
* └── help/


Los roles se manejan mediante rutas y layouts (sección 2.1 y 2.2).

9\. Estructura de una Feature

Una Feature puede tener:

* feature/  
* ├── pages/  
* ├── components/  
* ├── hooks/  
* ├── services/  
* ├── data/  
* ├── constants/  
* └── index.js


No es obligatorio crear todas las carpetas. Crear solamente las necesarias, y **solo lo que sea específico de esa feature** — todo lo genérico va en las carpetas compartidas de la sección 2\.

**pages/** → Las pantallas involucradas en la función o módulo.

**components/** → Componentes propios y reutilizables del módulo (no genéricos; si un componente podría usarse en otra feature, va en components/ui/).

**hooks/** → Controladores de TanStack Query. Manejan el estado de carga (isLoading), los errores y guardan la información en la caché para no saturar el backend.

**services/** → Comunicación con el backend, llamados a la API. Funciones que van a buscar o enviar datos al servidor. Solo hacen la petición HTTP. No saben nada de React. Se deben dejar preparados para una futura conexión con el backend.

**data/** → mock de datos estáticos.

**constants/** → Valores constantes involucrados en el módulo (si el valor se usa en más de una feature, va en constants/ global).

**index.js** → Funciona como un escudo. Solo exporta los componentes principales que el sistema de rutas global necesita ver, ocultando la lógica interna del módulo.

10\. Layout general

La estructura visual (barra lateral izquierda fija \+ área de contenido principal con desplazamiento) se define una sola vez por rol dentro de app/layouts/, usando flexbox o grid de Tailwind, y las pantallas de features/x/pages/ se renderizan dentro de ese layout. En mobile, ocultar sidebar tras menú hamburguesa y apilar contenido en una columna (flex-col), usando breakpoints sm:, md:, lg:.

11\. Calidad e imports

Código limpio, legible, reutilizable, modular, comentado solo cuando aporte valor, sin duplicación. Componentes con una única responsabilidad; los compartidos van únicamente en src/components/ui/.

Convenciones: PascalCase (componentes), camelCase (variables/funciones), hooks con prefijo use, solo componentes funcionales, ESModules. Dividir componentes que superen \~200 líneas.

Imports absolutos: usar solo si ya existe un alias configurado en vite.config.js/jsconfig.json; si no existe, usar imports relativos sin modificar la configuración.

12\. Crecimiento progresivo del proyecto

El proyecto crecerá pantalla por pantalla mediante nuevas Historias de Usuario (HU). Ante cada pantalla nueva, seguir este orden:

1. No modificar innecesariamente la arquitectura existente.  
2. Identificar a qué Feature pertenece (sección 8).  
3. Identificar el rol que la utilizará (Cliente / Profesional / Administrador).  
4. Identificar su ruta (se agrega en app/router/).  
5. Revisar si ya existen componentes, hooks, utils o layouts reutilizables en las carpetas compartidas (sección 2\) antes de crear algo nuevo dentro de la feature.  
6. Revisar las Historias de Usuario asociadas.  
7. Revisar sus criterios de aceptación.  
8. Crear únicamente lo necesario para cumplir la HU y sus criterios de aceptación — sin adelantar funcionalidad no pedida.  
9. Incorporar la nueva ruta al sistema de rutas (app/router/).  
10. Mantener consistencia visual y estructural con las pantallas existentes (sección 6 y convenciones de la sección 11).

Regla de contención: si una Historia de Usuario requiere una funcionalidad de backend, NO RECREARLA. No crear una arquitectura distinta para cada pantalla nueva; toda pantalla se ajusta a la arquitectura ya definida (Features \+ carpetas compartidas).

13\. Incorporar la pantalla teniendo en cuenta la siguiente historia de usuario →

Reglas de diseño: \[Colores, bordes en px, tipografía, etc. específicos de esta pantalla; si no se indica nada, aplican los valores por defecto de la sección 6\]

* HISTORIA DE USUARIO \- PANTALLA →  
*   
* Nombre: \[Nombre de la pantalla\]  
* Rol: \[Cliente / Profesional / Administrador\]  
* Ruta: \[/ruta\]  
* Captura: \[Imagen proporcionada\]  
*   
* Historias de Usuario:  
*   
* HU-XXX — \[Título\]  
*   
* Como: \[Tipo de usuario\]  
* Quiero: \[Acción o necesidad\]  
* Para: \[Objetivo o beneficio\]  
*   
* Criterios de aceptación:  
* \- \[Criterio 1\]  
* \- \[Criterio 2\]  
* \- \[Criterio 3\]  
    
  14\. Checklist final antes de entregar  
* \[ \] No se agregó ni actualizó ninguna dependencia  
* \[ \] No se modificó package.json, configuración de Vite/Tailwind/ESLint  
* \[ \] No hay archivos .ts/.tsx  
* \[ \] No hay llamadas HTTP ni lógica de autenticación real  
* \[ \] Se contemplaron los estados Loading/Empty/Error/Success donde aplique  
* \[ \] Los valores de diseño (colores, radios, tipografía) coinciden con la sección 6 (o con las reglas específicas de la pantalla, si se indicaron)  
* \[ \] Se verificaron componentes, hooks, utils y layouts reutilizables en las carpetas compartidas antes de crear nuevos dentro de la feature  
* \[ \] Ningún componente/hook/util genérico quedó duplicado dentro de features/ en vez de en su carpeta compartida  
* \[ \] Se cumplieron todos los criterios de aceptación de la(s) HU indicada(s)  
* \[ \] No se agregó funcionalidad fuera del alcance de la HU  
* 


  
