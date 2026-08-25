# Recreación de Pantalla: Mi Agenda - Próximos Turnos (Profesional)

Recreación de la pestaña "Próximos Turnos" para el rol de Profesional, incluyendo el listado en formato tarjeta y los distintos modales de detalle, validación de pago, y finalización de turno.

## User Review Required

- **Diseño**: Se implementarán fielmente los colores proveídos (`Background #202020`, `Card #292929`, `Label, Tags #323232`, `Primary text #FFFFFF`, `Secondary Text, Outlines, Placeholders #A8A8AA`, `Primary buttons #F78736`, `Secondary buttons #727272`, `Focus card #A8A8AA`).
- **Arquitectura**: Se mantendrá la estructura basada en Features (`src/features/agenda/`) y Componentes UI genéricos (`src/components/ui/`).
- **Estados**: Se simularán todos los estados locales mediante `useState` o un mock local para permitir testear los casos de éxito, validación de pagos, y reprogramación.

## Open Questions

- No hay preguntas abiertas. La historia de usuario está claramente definida.

## Proposed Changes

### Shared UI Components (`src/components/ui/`)

Se crearán o actualizarán los siguientes componentes reutilizables:

#### [NEW/MODIFY] `src/components/ui/Button.jsx`
- Soporte para variantes primarias (`#F78736`), secundarias (`#727272`), y estado deshabilitado.

#### [NEW/MODIFY] `src/components/ui/Badge.jsx`
- Componente para etiquetas de estado (PROGRAMADO, CONFIRMADO) con color de fondo `#323232` u otros requeridos.

#### [NEW/MODIFY] `src/components/ui/Modal.jsx`
- Componente reutilizable para envolver el contenido emergente con su overlay y funcionalidad de cierre.

#### [NEW/MODIFY] `src/components/ui/Card.jsx`
- Contenedor base de tarjeta con color `#292929`.

### Feature: Agenda (`src/features/agenda/`)

#### [NEW] `src/features/agenda/data/mockAgenda.js`
- Archivo para almacenar mock data de los turnos en sus distintos estados (pago pendiente, pago confirmado, etc) para visualizar correctamente la UI.

#### [NEW] `src/features/agenda/components/TurnoCard.jsx`
- Componente específico que renderiza el resumen del turno (Estado, Ubicación, Título, Cliente, Fecha, Categoría) y el botón "Ver detalle ->".

#### [NEW] `src/features/agenda/components/TurnoDetalleModal.jsx`
- Modal que muestra la información completa del turno, detalles del cliente y del pago. Maneja la lógica visual de habilitar/deshabilitar el botón de "Finalizar turno" dependiendo del estado de pago, además del botón "Reprogramar turno".

#### [NEW] `src/features/agenda/components/ConfirmacionFinalizarModal.jsx`
- Modal de confirmación para evitar finalizar accidentalmente. (Opciones "finalizar turno" y "cancelar").

#### [NEW] `src/features/agenda/components/RespuestaFinalizarModal.jsx`
- Modal para mostrar el resultado de la finalización (Éxito 5.1 o Rechazo 5.2).

#### [MODIFY] `src/features/agenda/pages/AgendaPage.jsx`
- Pantalla principal que listará las `TurnoCard` y controlará qué modal está abierto mediante estado local, inyectando la información de `mockAgenda.js`.

## Verification Plan

### Manual Verification
- Visualizar `AgendaPage` para comprobar el renderizado correcto del fondo y las tarjetas.
- Abrir un turno con pago pendiente: Verificar que el botón "Finalizar turno" esté deshabilitado.
- Confirmar el pago: Verificar que el botón "Finalizar turno" se habilite.
- Clic en "Finalizar turno": Verificar que aparezca el modal de confirmación.
- Confirmar en el modal: Verificar que aparezca la respuesta exitosa o de rechazo.
- Comprobar que los colores, botones, padding y tipografías coincidan estrictamente con las reglas de diseño solicitadas.
