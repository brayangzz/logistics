import { Order } from "../models";
import { orders as mockOrders } from "@/data";

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
