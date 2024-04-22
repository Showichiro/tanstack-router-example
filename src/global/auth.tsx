import { useMutation } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useState } from "react";

export type AuthContext = {
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
  user: string | null;
};

const AuthContext = createContext<AuthContext | null>(null);

const key = "tanstack.auth.user";

function getStoredUser() {
  return localStorage.getItem(key);
}

function setStoredUser(user: string | null) {
  if (user) {
    localStorage.setItem(key, user);
  } else {
    localStorage.removeItem(key);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(getStoredUser());
  const isAuthenticated = !!user;

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const res = await fetch("https://examples.com/logout", {
        method: "POST",
      });
      if (res.ok) {
        return res.json();
      }
      throw new Error("Logout failed");
    },
    onSuccess: () => {
      setStoredUser(null);
      setUser(null);
    },
  });

  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async (username: string) => {
      const res = await fetch("https://examples.com/login", {
        method: "POST",
        body: JSON.stringify({ username }),
      });
      if (res.ok) {
        return res.json();
      }
      throw new Error("Login failed");
    },
    onSuccess: (data) => {
      setUser(data.username);
      setStoredUser(data.username);
    },
  });
  const login = useCallback(
    (username: string) => {
      loginMutation.mutate(username);
    },
    [loginMutation],
  );

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
