import { ChoferRoute } from "../models";

const MOCK_ROUTE: ChoferRoute = {
  id: "route-001",
  driverName: "Juan Pérez",
  date: "13 de Marzo 2026",
  totalPendingInvoices: 3,
  invoices: [
    {
      id: "chofer-1",
      invoiceNumber: "#1015",
      client: {
        name: "Ricardo Treviño Cantú",
        initials: "RT",
        address: "Av. Eugenio Garza Sada #2501, Tecnológico, Monterrey, NL",
        phone: "+52 81 1234 5678",
        deliveryDate: "13 de marzo 2026",
      },
      areas: {
        aluminio: "Listo",
        vidrio: "Listo",
        herrajes: "En Proceso"
      },
      overallState: "En Proceso",
      items: [
        { id: "al-1", warehouse: "Aluminio", description: "Perfil Serie 70 Negro (Corte a 45°)", quantity: 24, weightPerUnit: 2.1 },
        { id: "vi-1", warehouse: "Vidrio", description: "Cristal Claro 6mm (Corte a Medida)", quantity: 12, weightPerUnit: 18.5 },
      ]
    },
    {
      id: "chofer-2",
      invoiceNumber: "#1024",
      client: {
        name: "María Elena Villarreal",
        initials: "MV",
        address: "Carr. Nacional Km 265, El Uro, Monterrey, NL",
        phone: "+52 81 9876 5432",
        deliveryDate: "13 de marzo 2026",
      },
      areas: {
        aluminio: "Listo",
        vidrio: "Listo",
        herrajes: "Listo"
      },
      overallState: "Listo",
      items: [
        { id: "he-1", warehouse: "Herrajes", description: "Bisagra Hidráulica de Piso", quantity: 4, weightPerUnit: 3.5 },
        { id: "he-2", warehouse: "Herrajes", description: "Jaladera Hache 60cm Acero Inox", quantity: 8, weightPerUnit: 1.2 },
      ]
    },
    {
      id: "chofer-3",
      invoiceNumber: "#1088",
      client: {
        name: "Roberto González Garza",
        initials: "RG",
        address: "Av. Vasconcelos #402, Santa Engracia, San Pedro Garza García, NL",
        phone: "+52 81 1111 2222",
        deliveryDate: "13 de marzo 2026",
      },
      areas: {
        aluminio: "Pendiente",
        vidrio: "Pendiente",
        herrajes: "Pendiente"
      },
      overallState: "Pendiente",
      items: [
        { id: "vi-4", warehouse: "Vidrio", description: "Espejo Filo Brillante (Corte Especial)", quantity: 5, weightPerUnit: 12.0 },
        { id: "al-5", warehouse: "Aluminio", description: "Bolsa de Vinil Negro para Vidrio", quantity: 10, weightPerUnit: 0.8 },
        { id: "he-3", warehouse: "Herrajes", description: "Carretillas para ventana corrediza", quantity: 20, weightPerUnit: 0.1 },
      ]
    }
  ]
};

export const choferApi = {
  getRouteDetails: async (): Promise<ChoferRoute> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_ROUTE), 600));
  }
};
