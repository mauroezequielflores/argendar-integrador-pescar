# Recreación de Pantalla: Agenda Cliente (Próximos Turnos)

Esta implementación tiene como objetivo recrear la pantalla de "Mi Agenda" para el rol Cliente, enfocándose en la pestaña "Próximos Turnos" y su funcionalidad de visualización de detalles a través de un panel lateral (Slide-over/Drawer).

## User Review Required

- **Nueva UI (Drawer/Modal Lateral):** Se creará un componente genérico `Drawer` o `SlideOver` en `src/components/ui/` para manejar el modal lateral, ya que es un patrón de diseño que se reutilizará en otras partes de la aplicación.
- **Iconos:** Se utilizarán `lucide-react` o `heroicons` dependiendo de qué esté instalado. Según el prompt de reglas, solo `heroicons` (outline) está permitido.
- **Mock Data:** Se creará un archivo `mockClientAgenda.js` con datos falsos para poder probar los estados (Lista llena, Lista vacía, etc).

## Open Questions

- ¿El componente principal de la página será `AgendaPage.jsx` existente o se debe crear un `ClientAgendaPage.jsx` específico para separar responsabilidades del `ProfessionalAgendaPage.jsx` existente? Asumiré usar un `ClientAgendaPage.jsx` o modificar `AgendaPage.jsx`.
- ¿Deseas que los tabs (Solicitudes, Próximos Turnos, Historial) funcionen simuladamente usando un estado local por ahora? Asumiremos que sí, y por defecto se mostrará "Próximos Turnos".

## Proposed Changes

### `src/components/ui/`

#### [NEW] `Drawer.jsx`
Componente genérico reutilizable para paneles laterales modales (usado para el detalle del turno y solicitud).
#### [NEW] `Select.jsx`
Componente genérico para el "Ordenar por: Más nuevo".
#### [NEW] `TabNav.jsx`
Componente genérico para manejar pestañas ("Solicitudes", "Próximos Turnos", "Historial").

### `src/features/agenda/`

#### [NEW] `data/mockClientAgenda.js`
Datos de prueba estáticos para popular la lista de turnos y sus detalles.

#### [NEW] `components/AppointmentCard.jsx`
Componente de tarjeta específico para la feature Agenda, que muestra el resumen del turno según los CA01.

#### [NEW] `components/AppointmentDetailModal.jsx`
Componente que envuelve el `Drawer` de UI y renderiza la información detallada del turno, cliente, pago y botones de acción (CA02 al CA07).

#### [NEW] `components/CancelAppointmentModal.jsx`
Modal (puede usar un `Modal` centrado genérico o crearse uno si no existe) para confirmar la cancelación con el input de motivo (CA07).

#### [MODIFY] `pages/AgendaPage.jsx` (o [NEW] `ClientAgendaPage.jsx`)
Se actualizará para contener la estructura principal de la página, el PageHeader, los Tabs, los filtros, y la lista de `AppointmentCard`. Se conectará con el estado local para abrir el detalle.

### `src/app/router/`

#### [MODIFY] `AppRouter.jsx` / `routes.js`
Asegurar que la ruta `/client/agenda` apunte correctamente al nuevo componente de la página de la agenda del cliente.

## Verification Plan

### Automated Tests
- N/A (Sección de pruebas no especificada o sin stack de testing).

### Manual Verification
1. Navegar a `/client/agenda`.
2. Verificar el diseño general coincida con la captura de pantalla provista.
3. Hacer clic en una tarjeta de turno y comprobar que el panel lateral derecho (Drawer) se abre con la información correcta.
4. Validar que el botón "Finalizar turno" esté fijo en la parte inferior del panel.
5. Hacer clic en "Cancelar turno" y verificar la apertura del modal secundario de confirmación, probando que el botón de confirmación se habilite solo si se escribe un motivo.
