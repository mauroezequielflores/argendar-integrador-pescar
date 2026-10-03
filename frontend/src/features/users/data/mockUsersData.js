/**
 * mockUsersData.js — Datos de muestra iniciales para la gestión de usuarios.
 */

import { USER_STATES } from "../constants/users.constants";

export const mockProfesionales = [
  {
    id: "TRX-000126",
    nombre: "Elena Martinez",
    rol: "Profesional",
    fecha: "17/08/2026",
    hora: "23:00 PM",
    estado: USER_STATES.ACTIVO,
    email: "elena.martinez@argendar.com",
    avatar: "EM",
  },
  {
    id: "TRX-000127",
    nombre: "Carlos Gomez",
    rol: "Profesional",
    fecha: "16/08/2026",
    hora: "19:30 PM",
    estado: USER_STATES.ACTIVO,
    email: "carlos.gomez@argendar.com",
    avatar: "CG",
  },
  {
    id: "TRX-000128",
    nombre: "Mariana Lopez",
    rol: "Profesional",
    fecha: "15/08/2026",
    hora: "14:15 PM",
    estado: USER_STATES.ACTIVO,
    email: "mariana.lopez@argendar.com",
    avatar: "ML",
  },
  {
    id: "TRX-000129",
    nombre: "Lucas Rodriguez",
    rol: "Profesional",
    fecha: "12/08/2026",
    hora: "10:00 AM",
    estado: USER_STATES.ACTIVO,
    email: "lucas.rodriguez@argendar.com",
    avatar: "LR",
  },
];

export const mockClientes = [
  {
    id: "TRX-000201",
    nombre: "Sofia Fernandez",
    rol: "Cliente",
    fecha: "17/08/2026",
    hora: "21:45 PM",
    estado: USER_STATES.ACTIVO,
    email: "sofia.fernandez@gmail.com",
    avatar: "SF",
  },
  {
    id: "TRX-000202",
    nombre: "Juan Perez",
    rol: "Cliente",
    fecha: "16/08/2026",
    hora: "18:20 PM",
    estado: USER_STATES.ACTIVO,
    email: "juan.perez@hotmail.com",
    avatar: "JP",
  },
  {
    id: "TRX-000203",
    nombre: "Lucia Diaz",
    rol: "Cliente",
    fecha: "14/08/2026",
    hora: "11:30 AM",
    estado: USER_STATES.ACTIVO,
    email: "lucia.diaz@gmail.com",
    avatar: "LD",
  },
];

export const mockAdministradores = [
  {
    id: "TRX-000001",
    nombre: "Mauro Flores",
    rol: "Administrador",
    fecha: "01/01/2026",
    hora: "09:00 AM",
    estado: USER_STATES.ACTIVO,
    email: "mauro.flores@argendar.com",
    avatar: "MF",
  },
  {
    id: "TRX-000002",
    nombre: "Admin Principal",
    rol: "Administrador",
    fecha: "10/01/2026",
    hora: "10:30 AM",
    estado: USER_STATES.ACTIVO,
    email: "admin@argendar.com",
    avatar: "AP",
  },
];
