import { z } from 'zod';

export const updateClientProfileSchema = z.object({
  body: z.object({
    description: z.string().max(1000, "La biografía no puede superar los 1000 caracteres").optional(),
    avatarUrl: z.string().optional(),
    coverUrl: z.string().optional(),
  }).strict()
});

export const updateClientSettingsSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, "El nombre es requerido").optional(),
    lastName: z.string().min(1, "El apellido es requerido").optional(),
    dni: z.string().min(6, "DNI inválido").optional(),
    location: z.string().optional(),
    phone: z.string().optional(),
    emailAlerts: z.boolean().optional(),
    phoneAlerts: z.boolean().optional()
  }).strict()
});

export const updateProfessionalProfileSchema = z.object({
  body: z.object({
    description: z.string().max(2000, "La biografía no puede superar los 2000 caracteres").optional(),
    avatarUrl: z.string().optional(),
    coverUrl: z.string().optional(),
    skills: z.array(z.string()).max(20, "Máximo 20 habilidades permitidas").optional(),
    baseLocation: z.string().optional(),
    coverageRadiusKm: z.number().positive("El radio debe ser positivo").optional(),
    certifications: z.array(z.object({
      name: z.string(),
      issuer: z.string().optional(),
      filePath: z.string().optional()
    })).optional(),
    availability: z.object({
      schedule: z.array(z.object({
        day: z.string(),
        timeRange: z.string()
      }))
    }).optional()
  }).strict() // Evita campos extra como ratingAvg o reviewsCount
});

export const updateProfessionalSettingsSchema = updateClientSettingsSchema; // Comparte la misma estructura para PII
