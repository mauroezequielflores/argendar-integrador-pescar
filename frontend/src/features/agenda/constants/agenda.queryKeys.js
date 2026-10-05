export const agendaKeys = {
  all: ['agenda'],
  turnos: (tab) => [...agendaKeys.all, 'turnos', tab],
  solicitudes: () => [...agendaKeys.all, 'solicitudes'],
};
