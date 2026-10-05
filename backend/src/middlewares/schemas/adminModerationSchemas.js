import { z } from 'zod';

const integerString = (name, { min, max }) =>
  z.string()
    .regex(/^\d+$/, `${name} debe ser un número entero`)
    .refine((v) => Number(v) >= min && Number(v) <= max, `${name} debe estar entre ${min} y ${max}`)
    .optional();

const entity = z.enum(['requests', 'offers', 'reviews', 'appointments'], {
  message: 'La entidad debe ser requests, offers, reviews o appointments'
});

export const getModerationSchema = z.object({
  params: z.object({ entity }),
  query: z.object({
    search: z.string().max(50, 'La búsqueda no puede superar los 50 caracteres').optional(),
    page: integerString('page', { min: 1, max: 100000 }),
    limit: integerString('limit', { min: 1, max: 100 })
  })
});

export const updateModerationSchema = z.object({
  params: z.object({
    entity,
    id: z.string().uuid('El ID debe ser un UUID válido')
  }),
  body: z.object({
    moderationStatus: z.enum(['active', 'disabled', 'deleted'], {
      message: 'moderationStatus debe ser active, disabled o deleted'
    })
  })
});
