import { z } from 'zod';

const integerString = (name, { min, max }) =>
  z.string()
    .regex(/^\d+$/, `${name} debe ser un número entero`)
    .refine((v) => Number(v) >= min && Number(v) <= max, `${name} debe estar entre ${min} y ${max}`)
    .optional();

const inquiryId = z.string().uuid('El ID de la consulta debe ser un UUID válido');

export const getInquiriesSchema = z.object({
  query: z.object({
    search: z.string().max(50, 'La búsqueda no puede superar los 50 caracteres').optional(),
    status: z.enum(['open', 'answered'], { message: 'status debe ser open o answered' }).optional(),
    page: integerString('page', { min: 1, max: 100000 }),
    limit: integerString('limit', { min: 1, max: 100 })
  })
});

export const getInquirySchema = z.object({
  params: z.object({ id: inquiryId })
});

export const replyInquirySchema = z.object({
  params: z.object({ id: inquiryId }),
  body: z.object({
    subject: z.string().trim().min(1, 'El asunto de la respuesta es obligatorio').max(150, 'El asunto no puede superar los 150 caracteres'),
    message: z.string().trim().min(1, 'El mensaje de la respuesta es obligatorio').max(2000, 'El mensaje no puede superar los 2000 caracteres')
  })
});
