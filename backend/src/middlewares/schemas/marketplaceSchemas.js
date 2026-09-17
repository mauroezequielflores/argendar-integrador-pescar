import { z } from 'zod';

export const createJobRequestSchema = z.object({
  body: z.object({
    categoryId: z.coerce.number().int().positive("El ID de la categoría debe ser un número válido"),
    title: z.string().min(5, "El título debe tener al menos 5 caracteres").max(100, "El título no puede exceder los 100 caracteres"),
    description: z.string().max(500, "La descripción no puede exceder los 500 caracteres").optional(),
    datePreference: z.string().optional(),
    timePreference: z.string().optional(),
    estimatedBudget: z.coerce.number().positive("El presupuesto estimado debe ser positivo").optional(),
    isEmergency: z.boolean().optional(),
    hasMaterials: z.boolean().optional(),
    address: z.string().min(5, "La dirección debe tener al menos 5 caracteres").optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    photos: z.array(z.string()).max(3, "No se pueden adjuntar más de 3 fotos").optional()
  })
});

export const getMarketplaceRequestsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    categories: z.string().optional(),
    page: z.string().regex(/^\d+$/, "La página debe ser un número").optional(),
    limit: z.string().regex(/^\d+$/, "El límite debe ser un número").optional(),
    lat: z.string().regex(/^-?\d+(\.\d+)?$/, "Latitud inválida").optional(),
    lng: z.string().regex(/^-?\d+(\.\d+)?$/, "Longitud inválida").optional()
  })
});

export const createOfferSchema = z.object({
  body: z.object({
    requestId: z.string().uuid("El ID de la solicitud debe ser un UUID válido"),
    proposedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
    proposedTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Formato de hora inválido (HH:mm o HH:mm:ss)"),
    amount: z.number().positive("El precio total debe ser positivo"),
    proposedDeposit: z.number().min(0, "La seña no puede ser negativa"),
    message: z.string().max(500, "El mensaje no puede exceder los 500 caracteres").optional()
  }).refine((data) => data.proposedDeposit <= data.amount, {
    message: "La seña no puede ser mayor al precio total",
    path: ["proposedDeposit"]
  }).refine((data) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const proposed = new Date(data.proposedDate + 'T00:00:00');
    return proposed >= today;
  }, {
    message: "La fecha propuesta no puede estar en el pasado",
    path: ["proposedDate"]
  })
});

export const acceptOfferSchema = z.object({
  params: z.object({
    id: z.string().uuid("El ID de la oferta debe ser un UUID válido")
  })
});
