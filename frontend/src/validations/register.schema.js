import { z } from "zod";
import { MESSAGES } from "../constants/messages";

/**
 * Schema de validación para el formulario de registro.
 *
 * Reglas de contraseña (HU-01 / HU-02):
 *  - Mínimo 8 caracteres
 *  - Al menos una letra mayúscula
 *  - Al menos un número
 */
export const registerSchema = z.object({
  nombre: z
    .string()
    .min(1, MESSAGES.REQUIRED)
    .max(50, MESSAGES.MAX_LENGTH(50)),

  apellido: z
    .string()
    .min(1, MESSAGES.REQUIRED)
    .max(50, MESSAGES.MAX_LENGTH(50)),

  email: z
    .string()
    .min(1, MESSAGES.REQUIRED)
    .email(MESSAGES.INVALID_EMAIL),

  password: z
    .string()
    .min(1, MESSAGES.REQUIRED)
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula.")
    .regex(/[0-9]/, "Debe contener al menos un número."),

  aceptarTerminos: z
    .boolean()
    .refine((val) => val === true, { message: MESSAGES.ACCEPT_TERMS }),
    
  location: z.string().optional(),
  latitude: z.number({ invalid_type_error: "Ubicación inválida" }).nullable().refine((val) => val !== null, "Debes seleccionar una ubicación válida"),
  longitude: z.number({ invalid_type_error: "Ubicación inválida" }).nullable().refine((val) => val !== null, "Debes seleccionar una ubicación válida"),
  coverageRadiusKm: z.number().min(1, "El radio debe ser de al menos 1km").max(100, "El radio máximo es de 100km").optional(),
});
