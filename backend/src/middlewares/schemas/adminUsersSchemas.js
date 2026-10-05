import { z } from 'zod';
import { ROLES } from '../../utils/constants.js';

const integerString = (name, { min, max }) =>
  z.string()
    .regex(/^\d+$/, `${name} debe ser un número entero`)
    .refine((v) => Number(v) >= min && Number(v) <= max, `${name} debe estar entre ${min} y ${max}`)
    .optional();

const userId = z.string().uuid('El ID del usuario debe ser un UUID válido');

export const getUsersSchema = z.object({
  query: z.object({
    role: z.enum(Object.values(ROLES), {
      message: 'role es obligatorio y debe ser client, professional o administrator'
    }),
    search: z.string().max(100, 'La búsqueda no puede superar los 100 caracteres').optional(),
    page: integerString('page', { min: 1, max: 100000 }),
    limit: integerString('limit', { min: 1, max: 100 })
  })
});

export const updateUserStatusSchema = z.object({
  params: z.object({ id: userId }),
  body: z.object({
    status: z.enum(['active', 'disabled'], {
      message: 'status debe ser active o disabled'
    })
  })
});

export const deleteUserSchema = z.object({
  params: z.object({ id: userId })
});
