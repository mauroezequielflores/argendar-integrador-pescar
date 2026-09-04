/**
 * Mock data - Home
 * Datos simulados para poblar las pantallas de inicio temporales.
 */

export const mockClientHome = {
  recentSearches: [
    { id: 1, term: "Plomero urgente", date: "Hoy" },
    { id: 2, term: "Electricista para tableros", date: "Ayer" },
  ],
  recommendedCategories: [
    { id: 1, name: "Plomería", icon: "💧" },
    { id: 2, name: "Electricidad", icon: "⚡" },
    { id: 3, name: "Climatización", icon: "❄️" },
  ]
};

export const mockProfessionalHome = {
  stats: {
    monthlyEarnings: 125000,
    jobsCompleted: 8,
    pendingOffers: 3,
    rating: 4.8
  },
  recentActivity: [
    { id: 1, text: "Recibiste un pago de $15,000", time: "Hace 2 horas" },
    { id: 2, text: "Nueva reseña de 5 estrellas", time: "Ayer" }
  ]
};

export const mockAdminHome = {
  systemMetrics: {
    activeUsers: 1245,
    newProfessionals: 15,
    openDisputes: 2,
    platformRevenue: 450000
  }
};
