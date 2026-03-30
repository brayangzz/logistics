import { ChoferRoute } from "../models";
import { choferRoute as MOCK_ROUTE } from "@/data";

export const choferApi = {
  getRouteDetails: async (): Promise<ChoferRoute> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_ROUTE), 600));
  },
};
