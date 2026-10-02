import { api } from '../../../libs/axios';

export const agendaService = {
  getTurnos: (tab) => api.get(`/appointments?tab=${tab}`).then((res) => res.data),
  getSolicitudes: () => api.get('/job-requests').then((res) => res.data),
  crearSolicitud: (payload) => api.post('/job-requests', payload).then((res) => res.data),
};
