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

  getOfferDetail: async (offerId) => {
    const { data } = await api.get(`/professional/offers/${offerId}`);
    return data?.data;
  },

  getReminderDetail: async (reminderId) => {
    const { data } = await api.get(`/professional/reminders/${reminderId}`);
    return data?.data;
  },

  getReviewDetail: async (reviewId) => {
    const { data } = await api.get(`/professional/reviews/${reviewId}`);
    return data?.data || data;
  },

  getPaymentDetail: async (paymentId) => {
    const { data } = await api.get(`/professional/payments/${paymentId}`);
    return data?.data || data;
  },

  getCancellationDetail: async (cancellationId) => {
    const { data } = await api.get(`/professional/cancellations/${cancellationId}`);
    return data?.data || data;
  },
};
