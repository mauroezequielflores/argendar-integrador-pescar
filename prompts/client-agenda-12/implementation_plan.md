# Plan de Implementación: Agenda Cliente (Solicitudes)

Esta implementación tiene como objetivo recrear la pantalla de "Mi Agenda" para el rol Cliente, enfocándose en la pestaña "Solicitudes" y su funcionalidad de visualización de detalles a través de un panel lateral (Drawer).

## User Review Required

- **Reutilización de componentes:** Se utilizarán los componentes genéricos (`Drawer`, `Badge`, `Button`, etc.) que ya existen o se crearán en `src/components/ui/` para asegurar la reusabilidad.
- **Mock Data:** Se creará o extenderá el archivo `mockClientAgenda.js` (o `mockClientRequests.js`) con datos falsos de las solicitudes para poder probar los estados (con ofertas, sin ofertas, etc).

## Open Questions

- ¿Deseas que los botones "Ver detalle" del modal principal naveguen a alguna otra pantalla temporal, o solamente el comportamiento del Drawer es suficiente por ahora?

## Proposed Changes

### `src/components/ui/`
Se verificará la existencia y de ser necesario se crearán:
- **`Drawer.jsx`**: (Si no fue creado en la HU anterior) Componente para paneles laterales modales.
- **`Modal.jsx`**: Componente para ventanas modales superpuestas centradas (para la cancelación).

### `src/features/agenda/`

#### [NEW] `data/mockClientRequests.js`
Datos de prueba estáticos para popular la lista de solicitudes y sus ofertas. Debe contener elementos con ofertas y sin ofertas para probar el CA02 y CA03.

#### [NEW] `components/RequestCard.jsx`
Componente de tarjeta específico para la solicitud, mostrando etiquetas de estado, cantidad de ofertas, descripción, etc. Incluirá la lógica de deshabilitar el botón "Ver ofertas" si no hay ofertas (CA04).

#### [NEW] `components/RequestDetailModal.jsx`
Componente que envuelve el `Drawer` de UI y renderiza la información detallada de la solicitud, fotos, y botones de acción (CA01 al CA04).

#### [NEW] `components/CancelRequestModal.jsx`
Modal centrado para confirmar la cancelación de la solicitud con el input de motivo (CA05 y CA06).

#### [MODIFY] `pages/ClientAgendaPage.jsx` (o `AgendaPage.jsx`)
Se modificará para renderizar la lista de `RequestCard` cuando la pestaña activa sea "Solicitudes". Se conectará con los modales correspondientes mediante estado local.

## Verification Plan

### Manual Verification
1. Navegar a `/client/agenda` en la pestaña "Solicitudes".
2. Verificar el diseño general según la captura de pantalla.
3. Comprobar que una tarjeta sin ofertas tenga el botón "Ver ofertas" deshabilitado y muestre "Buscando ofertas" con animación.
4. Hacer clic en "Ver detalle" y comprobar que el panel lateral derecho se abre con la información correcta.
5. Hacer clic en "Cancelar Solicitud" desde el panel lateral y verificar la apertura del modal secundario. Comprobar que el botón se habilite solo si se escribe un motivo.
