import { api } from '../../../libs/axios';

export const notificationService = {
  getNotifications: async (page = 1, limit = 20) => {
    const { data } = await api.get('/client/notifications', {
      params: { page, limit }
    });
    return data.data;
  },

  markAsRead: async (notificationId) => {
    const { data } = await api.patch(`/client/notifications/${notificationId}/read`);
    return data.data;
  },

  submitReview: async (reviewData) => {
    const { data } = await api.post('/client/reviews', reviewData);
    return data.data;
  }
};
