# Implementation Plan: NotificationCard and ProfessionalNotificationsPage

## User Review Required
No critical blocking decisions. I will implement a reusable `NotificationCard` component and integrate it into `ProfessionalNotificationsPage`. 

## Proposed Changes

### `src/components/ui/`
#### [NEW] `NotificationCard.jsx`
- Create a highly reusable `NotificationCard` following the design guidelines.
- It will receive props like `title`, `description`, `time`, `icon`, `iconBgColor`, `iconColor`, and `isNew`.
- It will have hover states and an `onClick` handler.
- The right side will have a ChevronRight icon.

### `src/features/notifications/data/`
#### [MODIFY] `mockProfessionalNotifications.js`
- Populate `mockNotificaciones` with the 5 mock items shown in the user story (Oferta no seleccionada, Turno cancelado, ¡Tu oferta fue aceptada!, Recordatorio, Un cliente calificó tu servicio).
- Map each notification type to specific Heroicons and colors.

### `src/features/notifications/pages/`
#### [MODIFY] `ProfessionalNotificationsPage.jsx`
- Replace the inline notification items in `PanelTodas` and `PanelHistorial` with the newly created `NotificationCard` component.
- Adjust the layout of the list to ensure the cards look correct and have the appropriate spacing.

## Verification Plan
1. Render the page locally or review the code to ensure it matches the design constraints.
2. Confirm that Heroicons are used and the component acts as a reusable unit.
