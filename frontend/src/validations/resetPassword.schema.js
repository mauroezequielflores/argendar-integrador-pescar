import { z } from "zod";
import { MESSAGES } from "../constants/messages";

/**
 * Schema de validación para solicitud de recuperación de contraseña (Paso 1).
 */
export const resetPasswordRequestSchema = z.object({
  email: z
    .string()
    .min(1, MESSAGES.REQUIRED)
    .email(MESSAGES.INVALID_EMAIL),
});

/**
 * Schema de validación para restablecer nueva contraseña (Paso 3).
 *
 * Reglas:
 *  - Mínimo 8 caracteres
 *  - Al menos una letra mayúscula
 *  - Al menos un número
 *  - Confirmación debe coincidir con la contraseña
 */
export const resetPasswordConfirmSchema = z
  .object({
    password: z
      .string()
      .min(1, MESSAGES.REQUIRED)
      .min(8, "La contraseña debe tener al menos 8 caracteres.")
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula.")
      .regex(/[0-9]/, "Debe contener al menos un número."),
    confirmPassword: z
      .string()
      .min(1, MESSAGES.REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: MESSAGES.PASSWORDS_DO_NOT_MATCH,
    path: ["confirmPassword"],
  });