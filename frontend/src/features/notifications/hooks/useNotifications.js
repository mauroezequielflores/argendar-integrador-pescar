import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';
import {
  BellIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

dayjs.extend(relativeTime);
dayjs.locale('es');

export const NOTIFICATIONS_KEYS = {
  all: ['client-notifications'],
  list: (page) => [...NOTIFICATIONS_KEYS.all, 'list', page],
};

const mapNotificationFromBackend = (item) => {
  let icon = BellIcon;
  let iconBgColor = "bg-white";
  let iconColor = "text-gray-500";

  switch (item.tipo) {
    case 'new_offer':
      icon = CheckCircleIcon;
      iconColor = "text-[#4A8F3A]";
      break;
    case 'payment':
      icon = CreditCardIcon;
      iconColor = "text-[#3B82F6]";
      break;
    case 'reminder':
      icon = CalendarDaysIcon;
      iconColor = "text-[#F78736]";
      break;
    case 'cancellation':
      icon = ExclamationTriangleIcon;
      iconColor = "text-[#EF4444]";
      break;
    case 'rating':
      icon = StarIcon;
      iconColor = "text-[#EAB308]";
      break;
  }

  return {
    ...item,
    fecha: dayjs(item.fecha).fromNow().toUpperCase(),
    icon,
    iconBgColor,
    iconColor,
    ...item.metadata,
  };
};

export const useNotificationsQuery = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: NOTIFICATIONS_KEYS.list(page),
    queryFn: async () => {
      const data = await notificationService.getNotifications(page, limit);
      const items = Array.isArray(data.data) ? data.data : data; 
      return items.map(mapNotificationFromBackend);
    },
  });
};

export const useMarkNotificationAsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId) => notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEYS.all });
    },
  });
};

export const useSubmitReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewData) => notificationService.submitReview(reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEYS.all });
    },
  });
};
