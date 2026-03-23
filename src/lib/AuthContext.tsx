"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type UserRole = "logistica" | "chofer";

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  initials: string;
  roleLabel: string;
}

const USERS: Record<string, { password: string; user: AuthUser }> = {
  logistica: {
    password: "123",
    user: {
      id: "1",
      name: "Logística Admin",
      role: "logistica",
      initials: "LA",
      roleLabel: "Área de Logística",
    },
  },
  chofer: {
    password: "123",
    user: {
      id: "2",
      name: "Carlos Ramírez",
      role: "chofer",
      initials: "CR",
      roleLabel: "Chofer",
    },
  },
};

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("auth_user");
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  } catch {
    return null;
  }
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: false;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: async () => false,
  logout: () => { },
  isLoading: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Read localStorage after hydration to avoid SSR mismatch
  useEffect(() => {
    setUser(readStoredUser());
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const entry = USERS[username.toLowerCase()];
    if (entry && entry.password === password) {
      setUser(entry.user);
      localStorage.setItem("auth_user", JSON.stringify(entry.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
