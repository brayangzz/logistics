/**
 * Simple HTTP Client wrapper using fetch API
 * Used to centralize request configurations, error handling, and interceptors.
 */
import { env } from "@/config";

export const httpClient = {
  get: async <T>(url: string, params?: Record<string, string>): Promise<T> => {
    const fullUrl = new URL(`${env.NEXT_PUBLIC_API_URL}${url}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) fullUrl.searchParams.append(key, value);
      });
    }

    const response = await fetch(fullUrl.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  
  // Future methods (POST, PUT, DELETE) can be added here
};
