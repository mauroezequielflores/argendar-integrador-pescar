export const ESTADOS_TURNO = {
  PENDIENTE: 'PENDIENTE',
  APROBADO: 'APROBADO',
  RECHAZADO: 'RECHAZADO'
};

export const ESTADOS_TURNO_LABELS = {
  [ESTADOS_TURNO.PENDIENTE]: 'Pendiente de Confirmación',
  [ESTADOS_TURNO.APROBADO]: 'Turno Confirmado',
  [ESTADOS_TURNO.RECHAZADO]: 'Turno Cancelado/Rechazado'
};
