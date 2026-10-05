import { z } from 'zod';

const integerString = (name, { min, max }) =>
  z.string()
    .regex(/^\d+$/, `${name} debe ser un número entero`)
    .refine((v) => Number(v) >= min && Number(v) <= max, `${name} debe estar entre ${min} y ${max}`)
    .optional();

export const getTransactionsSchema = z.object({
  query: z.object({
    search: z.string().max(50, 'La búsqueda no puede superar los 50 caracteres').optional(),
    page: integerString('page', { min: 1, max: 100000 }),
    limit: integerString('limit', { min: 1, max: 100 })
  })
});
