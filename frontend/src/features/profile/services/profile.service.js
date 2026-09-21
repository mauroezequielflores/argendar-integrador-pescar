import { api } from "../../../libs/axios";

export const profileService = {
  getClientProfile: () => api.get('/client/profile').then(res => res.data),
  updateClientProfile: (payload) => api.patch('/client/profile', payload).then(res => res.data),
  
  getProfessionalProfile: () => api.get('/professional/profile').then(res => res.data),
  updateProfessionalProfile: (payload) => api.patch('/professional/profile', payload).then(res => res.data),
  
  getPublicProfessionalProfile: (id) => api.get(`/client/professional/${id}/profile`).then(res => res.data),
  
  getSettings: (role) => api.get(`/${role}/profile/settings`).then(res => res.data),
  updateSettings: ({ role, payload }) => api.patch(`/${role}/profile/settings`, payload).then(res => res.data),
};
