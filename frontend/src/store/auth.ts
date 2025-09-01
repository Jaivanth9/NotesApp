// src/store/auth.ts
import { create } from "zustand";

interface AuthState {
  user: any | null;
  token: string | null;
  setAuth: (user: any, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token });
  },
  clearAuth: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
