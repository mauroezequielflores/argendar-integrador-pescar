# Recreación de pantalla "Mi Agenda" (Cliente)

Este plan detalla los pasos para recrear la pantalla "Mi Agenda" para el rol de Cliente, implementando los estados vacíos según el diseño proporcionado y cumpliendo con la historia de usuario `CA01` a `CA08`.

## Cambios Propuestos

### Componentes UI Reutilizables (components/ui/)

#### [NEW] `Tabs.jsx`
- Componente para la navegación por pestañas (Solicitudes, Próximos Turnos, Historial).
- Estilos con borde inferior para la pestaña activa (color naranja `#F78736`) y color de texto diferenciado (blanco para activo, `#A8A8AA` inactivo).

#### [NEW] `Select.jsx`
- Componente reutilizable para el dropdown "Ordenar por".
- Fondo `#292929`, borde y texto acorde al diseño.

#### [NEW] `FilterBar.jsx`
- Componente para la barra oscura debajo del ordenamiento que contiene los filtros activos (`Filtros | Más nuevo x`).

### Módulo Agenda (features/agenda/)

#### [MODIFY] `features/agenda/pages/AgendaPage.jsx`
- Se estructurará la página completa:
  - **Breadcrumbs**: "Inicio / Mi Agenda".
  - **PageHeader**: Título "Buenos días, [Nombre]" y botón primario "+ Crear Nueva Solicitud". Subtítulo: "Gestioná tus solicitudes, turnos e historial."
  - **Tabs**: Integración del componente `Tabs` para alternar el estado local `activeTab`.
  - **Filtros**: Barra de cantidad ("Tenes 0 solicitudes encontradas"), el componente `Select` a la derecha, y debajo el `FilterBar`.
  - **Contenido Principal (Empty States)**:
    - *Solicitudes*: Ícono de calendario, título "No tenés solicitudes activas", texto "Comenzá hoy mismo...", botón primario "Publicar mi primera solicitud".
    - *Próximos Turnos*: Ícono de calendario, título "No tenés turnos programados", texto "Cuando confirmes un servicio...".
    - *Historial*: Ícono de reloj/historial, título "Todavía no hay historial", texto "Tus solicitudes y turnos finalizados...".
  - **Manejo de estados**: Uso de `useState` para manejar qué pestaña está activa. (No se implementan llamadas a la API en esta fase, según regla 3).

## Open Questions
- El diseño muestra un saludo "Buenos días, Nombre". Actualmente el usuario "Nombre" está mockeado o deberíamos obtenerlo de algún `AuthContext` si existe? (Se utilizará un nombre mockeado por el momento si no hay un contexto de autenticación funcional, como indica la regla "Sin backend real").

## Verification Plan
1. Acceder a `/client/agenda` en el entorno local.
2. Verificar que se muestra la interfaz estructurada correctamente.
3. Hacer clic en cada una de las pestañas y confirmar que se muestra el *Empty State* correspondiente.
4. Verificar colores, espaciados y uso exclusivo de Tailwind CSS (sin CSS en línea).
