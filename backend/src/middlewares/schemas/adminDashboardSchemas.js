import { z } from 'zod';

const positiveInt = (name, max) =>
  z.string()
    .regex(/^\d+$/, `${name} debe ser un número entero`)
    .refine((v) => Number(v) >= 1 && Number(v) <= max, `${name} debe estar entre 1 y ${max}`)
    .optional();

export const getDashboardMetricsSchema = z.object({
  query: z.object({
    period: z.enum(['7days', '30days', 'all_time'], {
      errorMap: () => ({ message: 'period debe ser 7days, 30days o all_time' })
    }).optional()
  })
});

export const getActivityChartSchema = z.object({
  query: z.object({
    days: positiveInt('days', 90)
  })
});

export const getRecentActivitySchema = z.object({
  query: z.object({
    limit: positiveInt('limit', 50)
  })
});
