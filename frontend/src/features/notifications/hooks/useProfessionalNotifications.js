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
  reminderDetail: (id) => [...PROF_NOTIFICATIONS_KEYS.all, 'reminder-detail', id],
  reviewDetail: (id) => [...PROF_NOTIFICATIONS_KEYS.all, 'review-detail', id],
  paymentDetail: (id) => [...PROF_NOTIFICATIONS_KEYS.all, 'payment-detail', id],
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
    case 'payment':
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

const mapReminderDetail = (data) => {
  if (!data) return null;
  const client = data.client || {};

  return {
    id: data.id,
    clientName: data.clientName || client.name || 'Cliente',
    clientInitials: data.clientInitials || client.initials || 'CL',
    clientAvatarUrl: data.clientAvatarUrl || client.avatarUrl || null,
    serviceName: data.serviceName || data.requestTitle || 'Instalación eléctrica',
    status: (data.status || 'CONFIRMADO').toUpperCase(),
    date: data.date || (data.scheduledAt ? dayjs(data.scheduledAt).format('DD/MM/YYYY HH:mm [hs]') : 'Fecha a convenir'),
    timeAgo: data.timeAgo || (data.scheduledAt ? dayjs(data.scheduledAt).fromNow() : 'Recientemente'),
    notes: data.notes || '',
    amount: data.amount,
    message: data.message,
    offerId: data.offerId || null,
  };
};

export const useProfessionalReminderDetailQuery = (reminderId) => {
  return useQuery({
    queryKey: PROF_NOTIFICATIONS_KEYS.reminderDetail(reminderId),
    queryFn: async () => {
      const data = await professionalNotificationService.getReminderDetail(reminderId);
      return mapReminderDetail(data);
    },
    enabled: Boolean(reminderId),
    staleTime: 1000 * 60 * 5, // 5 min
  });
};

const mapReviewDetail = (data) => {
  if (!data) return null;
  const client = data.client || {};
  const createdAt = data.createdAt ? dayjs(data.createdAt) : dayjs();

  return {
    id: data.id,
    clientName: client.name || data.clientName || 'Cliente',
    clientInitials: client.initials || 'CL',
    clientAvatarUrl: client.avatarUrl || data.clientAvatarUrl || null,
    appointmentTitle: data.appointmentTitle || data.serviceName || 'Servicio realizado',
    rating: typeof data.rating === 'number' ? data.rating : 5,
    reviewText: data.comment || data.reviewText || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    date: createdAt.format('DD/MM/YYYY'),
    time: createdAt.format('HH:mm'),
    offerId: data.offerId || null,
    appointmentId: data.appointmentId || null,
  };
};

export const useProfessionalReviewDetailQuery = (reviewId) => {
  return useQuery({
    queryKey: PROF_NOTIFICATIONS_KEYS.reviewDetail(reviewId),
    queryFn: async () => {
      const data = await professionalNotificationService.getReviewDetail(reviewId);
      return mapReviewDetail(data);
    },
    enabled: Boolean(reviewId),
    staleTime: 1000 * 60 * 5, // 5 min
  });
};

const mapPaymentDetail = (data) => {
  if (!data) return null;
  const client = data.client || {};

  return {
    id: data.id,
    professionalName: data.professionalName || 'Ricardo Gómez',
    professionalInitials: data.professionalInitials || 'RG',
    serviceName: data.serviceName || data.requestTitle || 'Instalación eléctrica',
    status: (data.status || 'PROGRAMADO').toUpperCase(),
    date: data.date || (data.scheduledAt ? dayjs(data.scheduledAt).format('DD/MM/YYYY') : '28/07/2026'),
    time: data.time || (data.scheduledAt ? dayjs(data.scheduledAt).format('HH:mm [hs]') : '15:30 hs'),
    timeAgo: data.timeAgo || 'hace 2 días',
    paymentStatus: (data.paymentStatus || 'CONFIRMADO').toUpperCase(),
    operationId: data.operationId || data.externalOperationId || '#MP-982341',
    paymentMethod: data.paymentMethod || 'Mercado Pago',
    paymentDate: data.paymentDate || (data.createdAt ? dayjs(data.createdAt).format('DD [de] MMMM, YYYY') : '12 Mayo, 2026'),
    amount: data.amount ? String(data.amount) : formatCurrency(data.depositAmount || data.totalAmount || 3500),
    offerId: data.offerId || null,
    appointmentId: data.appointmentId || null,
    clientName: client.name || data.clientName || 'Cliente',
  };
};

export const useProfessionalPaymentDetailQuery = (paymentId) => {
  return useQuery({
    queryKey: PROF_NOTIFICATIONS_KEYS.paymentDetail(paymentId),
    queryFn: async () => {
      const data = await professionalNotificationService.getPaymentDetail(paymentId);
      return mapPaymentDetail(data);
    },
    enabled: Boolean(paymentId),
    staleTime: 1000 * 60 * 5, // 5 min
  });
};
