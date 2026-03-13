import { Order } from "../models";

const mockOrders: Order[] = [
  {
    id: "1",
    invoiceNumber: "#1015",
    isUrgent: true,
    date: "25 de febrero 2026",
    clientInitials: "EB",
    clientName: "Cliente 1",
    areas: { aluminio: "Pendiente", vidrio: "Pendiente", herrajes: "Pendiente" },
    overallState: "Pendiente",
  },
  {
    id: "2",
    invoiceNumber: "#1024",
    isUrgent: false,
    date: "24 de febrero 2026",
    clientInitials: "CS",
    clientName: "Cliente 2",
    areas: { aluminio: "Listo", vidrio: "En Proceso", herrajes: "Pendiente" },
    overallState: "En Proceso",
  },
  {
    id: "3",
    invoiceNumber: "#1023",
    isUrgent: false,
    date: "22 de febrero 2026",
    clientInitials: "MH",
    clientName: "Cliente 3",
    areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "Listo" },
    overallState: "Listo",
  },
  {
    id: "4",
    invoiceNumber: "#1021",
    isUrgent: false,
    date: "22 de febrero 2026",
    clientInitials: "UD",
    clientName: "Cliente 4",
    areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "Listo" },
    overallState: "Listo",
  },
  {
    id: "5",
    invoiceNumber: "#1019",
    isUrgent: false,
    date: "21 de febrero 2026",
    clientInitials: "AR",
    clientName: "Cliente 5",
    areas: { aluminio: "En Proceso", vidrio: "Listo", herrajes: "N/A" },
    overallState: "En Proceso",
  },
];

export const logisticsApi = {
  getOrders: async (): Promise<Order[]> => {
    // Simulando una llamada API asíncrona
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockOrders);
      }, 500); // 500ms de retraso real para simular red
    });
  },

  updateOrderState: async (orderId: string, updates: Partial<Order>): Promise<Order> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const orderIndex = mockOrders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) return reject(new Error("Pedido no encontrado"));
        
        mockOrders[orderIndex] = { ...mockOrders[orderIndex], ...updates };
        resolve(mockOrders[orderIndex]);
      }, 300);
    });
  }
};
