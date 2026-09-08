import { z } from 'zod';
import { ROLES } from '../../utils/constants.js';

export const registerSchema = z.object({
  body: z.object({
    nombre: z
      .string({ required_error: 'El nombre es obligatorio.' })
      .min(1, 'El nombre no puede estar vacío.')
      .max(50, 'El nombre no puede exceder los 50 caracteres.'),
    apellido: z
      .string({ required_error: 'El apellido es obligatorio.' })
      .min(1, 'El apellido no puede estar vacío.')
      .max(50, 'El apellido no puede exceder los 50 caracteres.'),
    email: z
      .string({ required_error: 'El correo electrónico es obligatorio.' })
      .email('El formato del correo electrónico no es válido.'),
    password: z
      .string({ required_error: 'La contraseña es obligatoria.' })
      .min(8, 'La contraseña debe tener al menos 8 caracteres.')
      .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula.')
      .regex(/[0-9]/, 'La contraseña debe contener al menos un número.'),
    role: z.enum([ROLES.CLIENT, ROLES.PROFESSIONAL], {
      required_error: 'El rol es obligatorio.',
      invalid_type_error: 'Rol inválido. Debe ser client o professional.',
    }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'El correo electrónico es obligatorio.' })
      .email('El formato del correo electrónico no es válido.'),
    password: z
      .string({ required_error: 'La contraseña es obligatoria.' })
      .min(1, 'La contraseña no puede estar vacía.'),
  }),
});
