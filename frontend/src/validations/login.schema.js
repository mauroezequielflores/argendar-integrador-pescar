import { z } from "zod";
import { MESSAGES } from "../constants/messages";

/**
 * Schema de validación para el formulario de inicio de sesión.
 * Usado con React Hook Form + @hookform/resolvers/zod
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, MESSAGES.REQUIRED)
    .email(MESSAGES.INVALID_EMAIL),

  password: z
    .string()
    .min(1, MESSAGES.REQUIRED)
    .min(8, MESSAGES.MIN_LENGTH(8)),

  remember: z.boolean().optional(),
});
