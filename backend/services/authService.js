/*Aquí procesamos los datos extrayendo la IP y el User-Agent (navegador/dispositivo) de la petición.*/

import {
  registrarHistorialSesion,
  getHistorialByUsuario,
} from "../models/authHistorialModel.js";

export const guardarRegistroLogin = async (usuarioId, req) => {
  // Extraer la IP cliente y el User-Agent del header de Express
  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "IP desconocida";
  const dispositivo = req.headers["user-agent"] || "Dispositivo desconocido";

  return await registrarHistorialSesion({ usuarioId, ip, dispositivo });
};

export const obtenerHistorialUsuario = async (usuarioId) => {
  return await getHistorialByUsuario(usuarioId);
};
