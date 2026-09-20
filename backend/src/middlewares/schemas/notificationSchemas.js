import { z } from 'zod';

export const getNotificationsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)).pipe(z.number().min(1).catch(1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)).pipe(z.number().min(1).max(50).catch(10))
  })
});

export const readNotificationSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: "Invalid notification ID format" })
  })
});

