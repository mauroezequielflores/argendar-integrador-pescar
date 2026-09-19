/**
 * mockReportsData.js — Datos de muestra para las consultas enviadas por usuarios desde la sección de Ayuda.
 */

import { INQUIRY_STATES } from "../constants/reports.constants";

export const mockInquiries = [
  {
    id: "REQ-000101",
    fecha: "17/08/2026",
    hora: "23:00 PM",
    usuario: "Nombre Apellido",
    rol: "Cliente",
    email: "cliente.ejemplo@gmail.com",
    asunto: "Descripción....",
    mensaje: "Hola, tengo una consulta respecto a cómo reprogramar un turno solicitado que aún no fue aceptado por el profesional. ¿Podrían orientarme sobre los pasos a seguir?",
    estado: INQUIRY_STATES.PENDING,
    respuesta: null,
    fechaRespuesta: null,
  },
  {
    id: "REQ-000102",
    fecha: "16/08/2026",
    hora: "18:45 PM",
    usuario: "Elena Martinez",
    rol: "Profesional",
    email: "elena.martinez@argendar.com",
    asunto: "Duda sobre acreditación de honorarios",
    mensaje: "Buenas tardes, quisiera consultar los plazos estimados para que las transferencias de servicios completados impacten en mi cuenta bancaria registrada.",
    estado: INQUIRY_STATES.PENDING,
    respuesta: null,
    fechaRespuesta: null,
  },
  {
    id: "REQ-000103",
    fecha: "15/08/2026",
    hora: "11:20 AM",
    usuario: "Carlos Gomez",
    rol: "Cliente",
    email: "carlos.gomez@hotmail.com",
    asunto: "Consulta sobre medios de pago aceptados",
    mensaje: "Hola equipo de Argendar, ¿es posible abonar con tarjetas de débito internacionales o solo tarjetas locales?",
    estado: INQUIRY_STATES.ANSWERED,
    respuesta: "Hola Carlos, actualmente aceptamos tarjetas de débito y crédito nacionales e internacionales emitidas por Visa y Mastercard.",
    fechaRespuesta: "15/08/2026 14:10 PM",
  },
];
