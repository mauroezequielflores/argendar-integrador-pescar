/**
 * Mock data — Marketplace (Cliente)
 * Datos estáticos locales para desarrollo y pruebas del módulo.
 * Por defecto las listas están vacías para reflejar fielmente la interfaz de referencia.
 */

export const CATEGORIAS_MARKETPLACE = ["Plomería", "Electricidad", "Frigorista"];

export const UBICACION_CLIENTE_DEFAULT = "Av. Corrientes 1234, CABA";

export const SORT_OPTIONS = [
  { value: "newest", label: "Más nuevo" },
  { value: "rating", label: "Mejor calificados" },
  { value: "distance", label: "Más cercano" },
];

export const mockProfessionals = [
  {
    id: 1,
    nombre: "Juan Pérez",
    profesion: "Plomero Gasista",
    categoria: "Plomería",
    descripcion: "Especialista en cañerías y gas. Más de 10 años de experiencia.",
    rating: 4.8,
    reviews: 120,
    precioHora: 5000,
    distancia: 2.5,
    imagen: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    nombre: "Roberto Gómez",
    profesion: "Electricista Matriculado",
    categoria: "Electricidad",
    descripcion: "Instalaciones eléctricas comerciales y residenciales.",
    rating: 4.9,
    reviews: 85,
    precioHora: 6000,
    distancia: 1.2,
    imagen: "https://randomuser.me/api/portraits/men/44.jpg"
  }
];

export const mockSolicitudes = [
  {
    id: 1,
    titulo: "Reparación de caño roto en cocina",
    categoria: "Plomería",
    descripcion: "Tengo una pérdida de agua importante debajo de la bacha.",
    fecha: "2023-10-15",
    presupuestoEstimado: 15000,
    estado: "Abierta"
  },
  {
    id: 2,
    titulo: "Instalación de aire acondicionado",
    categoria: "Frigorista",
    descripcion: "Necesito instalar un split de 3000 frigorías en un 2do piso.",
    fecha: "2023-10-16",
    presupuestoEstimado: 35000,
    estado: "Abierta"
  }
];
