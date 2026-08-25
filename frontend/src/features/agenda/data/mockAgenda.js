export const mockAgenda = [
  {
    id: "t1",
    estado: "PROGRAMADO",
    ubicacion: "Caballito, CABA",
    titulo: "Cambio de tablero principal",
    cliente: {
      nombre: "Ricardo Gómez",
      foto: "",
      calificacion: 4.8
    },
    fecha: "2026-07-28",
    horario: "15:30 hs",
    categoria: "ELECTRICIDAD",
    direccionExacta: "Av. Rivadavia 5432, Piso 4, Depto B",
    solicitud: {
      titulo: "Reemplazo de tablero",
      descripcion: "El tablero actual es muy viejo y saltan las térmicas constantemente al encender el aire acondicionado."
    },
    pago: {
      estado: "PENDIENTE",
      metodo: "Efectivo",
      senia: 0,
      saldo: 15000,
      total: 15000
    }
  },
  {
    id: "t2",
    estado: "PROGRAMADO",
    ubicacion: "Palermo, CABA",
    titulo: "Instalación de aire acondicionado",
    cliente: {
      nombre: "María Soler",
      foto: "",
      calificacion: 5.0
    },
    fecha: "2026-07-29",
    horario: "10:00 hs",
    categoria: "CLIMATIZACIÓN",
    direccionExacta: "Gurruchaga 1234, Planta Baja",
    solicitud: {
      titulo: "Instalar split 3000 frigorías",
      descripcion: "Ya tengo el equipo, solo necesito la instalación en la pared del living."
    },
    pago: {
      estado: "CONFIRMADO",
      metodo: "Transferencia",
      senia: 25000,
      saldo: 0,
      total: 25000
    }
  },
  {
    id: "t3",
    estado: "PROGRAMADO",
    ubicacion: "Belgrano, CABA",
    titulo: "Mantenimiento preventivo anual",
    cliente: {
      nombre: "Carlos Fernández",
      foto: "",
      calificacion: 4.9
    },
    fecha: "2026-08-15",
    horario: "11:00 hs",
    categoria: "PLOMERÍA",
    direccionExacta: "Av. Cabildo 2500, Piso 2",
    solicitud: {
      titulo: "Revisión de cañerías e inspección",
      descripcion: "Necesito un mantenimiento general de cañerías y control de llaves de paso para prevenir pérdidas."
    },
    pago: {
      estado: "PENDIENTE",
      metodo: "Efectivo",
      senia: 5000,
      saldo: 25000,
      total: 30000
    }
  }
];
