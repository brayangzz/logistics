import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";
import { AuthProvider } from "@/lib/AuthContext";
import { OrdersProvider } from "@/lib/OrdersContext";

export const metadata = {
  title: "Logística App",
  description: "Sistema de logística para vidrio, aluminio y herrajes",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <OrdersProvider>
              {children}
            </OrdersProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
