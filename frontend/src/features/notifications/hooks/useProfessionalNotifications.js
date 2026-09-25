import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { professionalNotificationService } from '../services/professionalNotificationService';
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
  XCircleIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/solid";
import BriefcaseCheckIcon from '../../../components/icons/BriefcaseCheckIcon';

dayjs.extend(relativeTime);
dayjs.locale('es');

export const PROF_NOTIFICATIONS_KEYS = {
  all: ['professional-notifications'],
  list: (tab, type, sort) => [...PROF_NOTIFICATIONS_KEYS.all, 'list', tab, type, sort],
  preview: () => [...PROF_NOTIFICATIONS_KEYS.all, 'preview'],
  detail: (id) => [...PROF_NOTIFICATIONS_KEYS.all, 'detail', id],
  offerDetail: (id) => [...PROF_NOTIFICATIONS_KEYS.all, 'offer-detail', id],
};

/**
 * Maps backend notification type to the icon, iconBgColor, and iconColor
 * that the UI expects — preserving the exact same visual style as the mocks.
 */
const mapProfessionalNotification = (item) => {
  let icon = BellIcon;
  let iconBgColor = "bg-white";
  let iconColor = "text-gray-500";

  switch (item.type) {
    case 'offer_accepted':
      icon = CheckCircleIcon;
      iconColor = "text-[#4CAF50]";
      break;
    case 'offer_rejected':
      icon = XCircleIcon;
      iconColor = "text-[#4CAF50]";
      break;
    case 'payment_confirmed':
      icon = CreditCardIcon;
      iconColor = "text-[#3B82F6]";
      break;
    case 'appointment_reminder':
      icon = CalendarDaysIcon;
      iconColor = "text-[#F78736]";
      break;
    case 'appointment_cancelled':
      icon = ExclamationTriangleIcon;
      iconColor = "text-[#F78736]";
      break;
    case 'job_finished':
    case 'appointment_completed':
    case 'trabajo_finalizado':
    case 'trabajo finalizado':
    case 'Trabajo Finalizado':
      icon = BriefcaseIcon;
      iconColor = "text-black";
      break;
    case 'review_received':
      icon = StarIcon;
      iconColor = "text-[#EAB308]";
      break;
  }

  return {
    id: item.id,
    titulo: item.title,
    descripcion: item.description,
    fecha: dayjs(item.createdAt).fromNow().toUpperCase(),
    icon,
    iconBgColor,
    iconColor,
    isNew: !item.isRead,
    href: item.href || '#',
    type: item.type,
    relatedEntityId: item.relatedEntityId,
    relatedEntityType: item.relatedEntityType,
    ...(item.metadata || {}),
  };
};

export const useProfessionalNotificationsQuery = (tab = 'active', type = 'all', sort = 'newest') => {
  return useQuery({
    queryKey: PROF_NOTIFICATIONS_KEYS.list(tab, type, sort),
    queryFn: async () => {
      const data = await professionalNotificationService.getNotifications({ tab, type, sort });
      const items = Array.isArray(data.notifications) ? data.notifications : [];
      return {
        total: data.total || 0,
        notifications: items.map(mapProfessionalNotification),
      };
    },
  });
};

export const useProfessionalNotificationsPreviewQuery = () => {
  return useQuery({
    queryKey: PROF_NOTIFICATIONS_KEYS.preview(),
    queryFn: async () => {
      const data = await professionalNotificationService.getPreview();
      return {
        unreadCount: data.unreadCount || 0,
        notifications: (data.notifications || []).map(mapProfessionalNotification),
      };
    },
  });
};

export const useMarkProfessionalNotificationAsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId) => professionalNotificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROF_NOTIFICATIONS_KEYS.all });
    },
  });
};

const formatCurrency = (val) => {
  if (val === null || val === undefined) return '$0';
  const num = typeof val === 'number' ? val : parseFloat(val);
  return isNaN(num) ? String(val) : `$${num.toLocaleString('es-AR')}`;
};

const formatAvailability = (date, time) => {
  if (!date) return 'A convenir';
  const formattedDate = dayjs(date).format('DD/MM');
  const formattedTime = time ? ` a las ${time.slice(0, 5)}hs` : '';
  return `${formattedDate}${formattedTime}`;
};

const mapOfferDetail = (data) => {
  if (!data) return null;
  const client = data.client || {};
  const prof = data.professional || {};

  return {
    id: data.id,
    clientName: client.name || 'Cliente',
    clientInitials: client.initials || 'CL',
    clientAvatarUrl: client.avatarUrl || null,
    profName: prof.name || 'Ricardo Gómez',
    profCategory: prof.category || 'PROFESIONAL',
    profAvatarUrl: prof.avatarUrl || null,
    rating: prof.rating || 5.0,
    price: formatCurrency(data.price),
    deposit: formatCurrency(data.deposit),
    message: data.message ? `"${data.message.replace(/^"|"$/g, '')}"` : '',
    availability: formatAvailability(data.availabilityDate, data.availabilityTime),
    requestTitle: data.requestTitle || '',
    requestDescription: data.requestDescription || '',
    status: data.status || 'accepted',
  };
};

export const useProfessionalOfferDetailQuery = (offerId) => {
  return useQuery({
    queryKey: PROF_NOTIFICATIONS_KEYS.offerDetail(offerId),
    queryFn: async () => {
      const data = await professionalNotificationService.getOfferDetail(offerId);
      return mapOfferDetail(data);
    },
    enabled: Boolean(offerId),
    staleTime: 1000 * 60 * 5, // 5 min
  });
};
