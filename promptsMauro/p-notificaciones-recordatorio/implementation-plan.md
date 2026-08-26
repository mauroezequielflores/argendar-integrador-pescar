# Implementation Plan: ReminderDetailsPage (Notificación de Recordatorio)

## User Review Required
No blocking decisions. I will implement the new `ReminderDetailsPage` and update `AppRouter` and `mockProfessionalNotifications.js` to link to it.

## Proposed Changes

### `src/app/router/`
#### [MODIFY] `AppRouter.jsx`
- Add the route `/professional/reminders/:id/details` which points to `ReminderDetailsPage`.

### `src/features/notifications/pages/`
#### [NEW] `ReminderDetailsPage.jsx`
- Implement the "Recordatorio" details page as requested in CA03 and CA05.
- Central Card (`bg-[#292929]`, `rounded`):
  - Avatar, Title, "PENDIENTE" badge.
  - Subtitle with the person's name.
  - Bottom left: Calendar icon and date.
  - Top right: Clock icon and relative time.
  - Bottom right: Outline button "Ver detalle ->".
- Footer with "Volver" and "Cancelar".
- Link "Ver detalle ->" to `/professional/appointments/:id`.

### `src/features/notifications/data/`
#### [MODIFY] `mockProfessionalNotifications.js`
- Update the `href` property of the "Recordatorio" mock notification to `/professional/reminders/4/details`.

### `prompts/p-notificaciones-recordatorio/`
#### [NEW] `implementation-plan.md`
- Save the plan here.

## Verification Plan
1. Ensure clicking the "Recordatorio" notification routes correctly.
2. Verify styles and layout match the CA03 requirements (dark card, outline badge, specific icons).
