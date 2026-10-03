import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    notificationId: z.string().uuid({ message: "Invalid notification ID format" }),
    rating: z.number().int().min(1).max(5),
    tags: z.array(z.string()).optional(),
    comment: z.string().max(500).optional()
  })
});
