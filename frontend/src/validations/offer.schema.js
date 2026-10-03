import { z } from "zod";

export const createOfferFormSchema = z.object({
  proposedDate: z.string().min(1, "La fecha es obligatoria"),
  proposedTime: z.string().min(1, "El rango horario es obligatorio"),
  amount: z
    .number({ invalid_type_error: "El precio total debe ser un número" })
    .positive("El precio total debe ser mayor a 0"),
  proposedDeposit: z
    .number({ invalid_type_error: "El monto de la seña debe ser un número" })
    .min(0, "La seña no puede ser negativa")
    .optional(),
  message: z.string().optional(),
}).refine(
  (data) => !data.proposedDeposit || data.proposedDeposit <= data.amount,
  {
    message: "La seña no puede ser mayor al precio total",
    path: ["proposedDeposit"],
  }
).refine(
  (data) => {
    if (!data.proposedDate) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Asume formato yyyy-mm-dd desde el input type="date"
    const proposed = new Date(data.proposedDate + 'T00:00:00');
    return proposed >= today;
  },
  {
    message: "La fecha propuesta no puede ser en el pasado",
    path: ["proposedDate"],
  }
);
