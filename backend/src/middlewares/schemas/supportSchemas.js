import { z } from 'zod';

export const createTicketSchema = z.object({
  body: z.object({
    subject: z.string().trim().min(1, 'El asunto es obligatorio').max(150, 'El asunto no puede superar los 150 caracteres'),
    message: z.string().trim().min(1, 'El mensaje es obligatorio').max(2000, 'El mensaje no puede superar los 2000 caracteres')
  })
});
