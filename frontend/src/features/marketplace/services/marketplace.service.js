import { api } from "../../../libs/axios";

export const marketplaceService = {
  getRequests: (params) => api.get('/professional/marketplace/requests', { params }).then(res => res.data),
  getRequestById: (id) => api.get(`/professional/marketplace/requests/${id}`).then(res => res.data),
  createOffer: (payload) => api.post('/offers', payload).then(res => res.data),
};
