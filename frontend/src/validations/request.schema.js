import { z } from "zod";

export const createRequestStep1Schema = z.object({
  category: z.string().min(1, "Debes seleccionar una categoría"),
  title: z.string().min(5, "El título debe tener al menos 5 caracteres").max(100, "El título es demasiado largo"),
  description: z.string().max(500, "La descripción no puede superar los 500 caracteres").optional(),
  age: z.string().optional(),
  isEmergency: z.enum(["SI", "NO"], { required_error: "Debes indicar si es una emergencia" }),
  hasMaterials: z.enum(["SI", "NO"], { required_error: "Debes indicar si tienes los materiales" }),
  date: z.enum(["Esta semana", "Lo antes posible", "Este fin de semana", "Soy Flexible"], { required_error: "Debes seleccionar una fecha" }),
  time: z.enum(["Mañana 08:00 - 12:00", "Tarde 12:00 - 17:00", "Noche 17:00 - 21:00", "Cualquier horario"], { required_error: "Debes seleccionar un horario" }),
});

export const createRequestStep2Schema = z.object({
  address: z.string().min(5, "Debes ingresar una dirección válida"),
  apartment: z.string().optional(),
  zipCode: z.string().optional(),
  additionalDetails: z.string().min(1, "Debes agregar alguna indicación"),
});
