import { api } from '../../../libs/axios';

export const professionalNotificationService = {
  getNotifications: async ({ tab = 'active', type = 'all', sort = 'newest' } = {}) => {
    const { data } = await api.get('/professional/notifications', {
      params: { tab, type, sort }
    });
    return data;
  },

  getPreview: async () => {
    const { data } = await api.get('/professional/notifications/preview');
    return data;
  },

  getNotificationDetail: async (notificationId) => {
    const { data } = await api.get(`/professional/notifications/${notificationId}`);
    return data;
  },

  markAsRead: async (notificationId) => {
    const { data } = await api.patch(`/professional/notifications/${notificationId}/read`);
    return data;
  },
};
