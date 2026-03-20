import { Order } from "../models";

const mockOrders: Order[] = [
  {
    id: "1",
    invoiceNumber: "#1015",
    isUrgent: true,
    date: "17 de marzo 2026",
    orderDate: "2026-03-17",
    clientInitials: "EB",
    clientName: "Cristales Monterrey",
    areas: { aluminio: "Pendiente", vidrio: "Pendiente", herrajes: "Pendiente" },
    overallState: "Pendiente",
  },
  {
    id: "2",
    invoiceNumber: "#1024",
    isUrgent: false,
    date: "16 de marzo 2026",
    orderDate: "2026-03-16",
    clientInitials: "CS",
    clientName: "Aluminios del Norte",
    areas: { aluminio: "Listo", vidrio: "En Proceso", herrajes: "Pendiente" },
    overallState: "En Proceso",
  },
  {
    id: "3",
    invoiceNumber: "#1023",
    isUrgent: false,
    date: "15 de marzo 2026",
    orderDate: "2026-03-15",
    clientInitials: "MH",
    clientName: "Herrajes y Perfiles SA",
    areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "Listo" },
    overallState: "Listo",
  },
  {
    id: "4",
    invoiceNumber: "#1021",
    isUrgent: false,
    date: "14 de marzo 2026",
    orderDate: "2026-03-14",
    clientInitials: "UD",
    clientName: "Vidrios San Pedro",
    areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "Listo" },
    overallState: "Listo",
  },
  {
    id: "5",
    invoiceNumber: "#1019",
    isUrgent: false,
    date: "13 de marzo 2026",
    orderDate: "2026-03-13",
    clientInitials: "AR",
    clientName: "Construcciones Regiomontanas",
    areas: { aluminio: "En Proceso", vidrio: "Listo", herrajes: "N/A" },
    overallState: "En Proceso",
  },
  {
    id: "6",
    invoiceNumber: "#1018",
    isUrgent: true,
    date: "12 de marzo 2026",
    orderDate: "2026-03-12",
    clientInitials: "GL",
    clientName: "Grupo Laminar MTY",
    areas: { aluminio: "Pendiente", vidrio: "En Proceso", herrajes: "Pendiente" },
    overallState: "Pendiente",
  },
  {
    id: "7",
    invoiceNumber: "#1017",
    isUrgent: false,
    date: "12 de marzo 2026",
    orderDate: "2026-03-12",
    clientInitials: "VC",
    clientName: "Vidrio y Color SA",
    areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "En Proceso" },
    overallState: "En Proceso",
  },
  {
    id: "8",
    invoiceNumber: "#1016",
    isUrgent: false,
    date: "11 de marzo 2026",
    orderDate: "2026-03-11",
    clientInitials: "PB",
    clientName: "Perfiles Blancos del Norte",
    areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "Listo" },
    overallState: "Listo",
  },
  {
    id: "9",
    invoiceNumber: "#1014",
    isUrgent: false,
    date: "10 de marzo 2026",
    orderDate: "2026-03-10",
    clientInitials: "TA",
    clientName: "Techados y Aluminio Regio",
    areas: { aluminio: "En Proceso", vidrio: "Pendiente", herrajes: "Pendiente" },
    overallState: "Pendiente",
  },
  {
    id: "10",
    invoiceNumber: "#1013",
    isUrgent: false,
    date: "10 de marzo 2026",
    orderDate: "2026-03-10",
    clientInitials: "CG",
    clientName: "Cristalería García Hnos.",
    areas: { aluminio: "Listo", vidrio: "En Proceso", herrajes: "Listo" },
    overallState: "En Proceso",
  },
  {
    id: "11",
    invoiceNumber: "#1012",
    isUrgent: false,
    date: "8 de marzo 2026",
    orderDate: "2026-03-08",
    clientInitials: "FV",
    clientName: "Fachadas de Vidrio MTY",
    areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "Listo" },
    overallState: "Listo",
  },
  {
    id: "12",
    invoiceNumber: "#1011",
    isUrgent: true,
    date: "7 de marzo 2026",
    orderDate: "2026-03-07",
    clientInitials: "MV",
    clientName: "Metalúrgica Vidal",
    areas: { aluminio: "Pendiente", vidrio: "Pendiente", herrajes: "En Proceso" },
    overallState: "Pendiente",
  },
  {
    id: "13",
    invoiceNumber: "#1010",
    isUrgent: false,
    date: "6 de marzo 2026",
    orderDate: "2026-03-06",
    clientInitials: "SA",
    clientName: "Sistemas de Aluminio Regio",
    areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "Listo" },
    overallState: "Listo",
  },
  {
    id: "14",
    invoiceNumber: "#1009",
    isUrgent: false,
    date: "5 de marzo 2026",
    orderDate: "2026-03-05",
    clientInitials: "IP",
    clientName: "Importadora Perfiles SA",
    areas: { aluminio: "En Proceso", vidrio: "Listo", herrajes: "En Proceso" },
    overallState: "En Proceso",
  },
  {
    id: "15",
    invoiceNumber: "#1008",
    isUrgent: false,
    date: "4 de marzo 2026",
    orderDate: "2026-03-04",
    clientInitials: "VR",
    clientName: "Vidrios Regios del Noreste",
    areas: { aluminio: "Listo", vidrio: "Listo", herrajes: "Listo" },
    overallState: "Listo",
  },
];

export const logisticsApi = {
  getOrders: async (): Promise<Order[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockOrders);
      }, 500);
    });
  },

  updateOrderState: async (orderId: string, updates: Partial<Order>): Promise<Order> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const orderIndex = mockOrders.findIndex((o) => o.id === orderId);
        if (orderIndex === -1) return reject(new Error("Pedido no encontrado"));

        mockOrders[orderIndex] = { ...mockOrders[orderIndex], ...updates };
        resolve(mockOrders[orderIndex]);
      }, 300);
    });
  },
};
