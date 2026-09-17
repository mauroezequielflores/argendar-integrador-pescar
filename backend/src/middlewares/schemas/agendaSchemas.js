import { z } from 'zod';

export const getAgendaAppointmentsSchema = z.object({
  query: z.object({
    tab: z.enum(['solicitudes', 'proximos', 'historial']).optional().default('solicitudes'),
    sort: z.enum(['newest', 'oldest']).optional().default('newest'),
    page: z.string().regex(/^\d+$/, "La página debe ser un número").optional(),
    limit: z.string().regex(/^\d+$/, "El límite debe ser un número").optional()
  })
});

export const cancelAppointmentSchema = z.object({
  params: z.object({
    id: z.string().uuid("El ID del turno debe ser un UUID válido")
  }),
  body: z.object({
    motivo: z.string().max(300, "El motivo no puede exceder los 300 caracteres").optional()
  })
});

export const confirmAppointmentSchema = z.object({
  params: z.object({
    id: z.string().uuid("El ID del turno debe ser un UUID válido")
  })
});

export const getAppointmentDetailSchema = z.object({
  params: z.object({
    id: z.string().uuid("El ID del turno debe ser un UUID válido")
  })
});
