import { create } from "zustand";
import { Storage } from "../utils/Storage";
import { LoginResponse } from "../types";

type User = LoginResponse["user"];

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  expiresAt: number | null;
  setUser: (user: User | null) => void;
  setSession: (accessToken: string, expiresAt: number) => void;
  clearAuth: () => void;
}

const USER_KEY = "user";
const TOKEN_KEY = "accessToken";
const EXPIRES_KEY = "expiresAt";

export const useAuthStore = create<AuthState>((set) => ({
  user: Storage.getItem<User>(USER_KEY),
  isAuthenticated: !!Storage.getItem<User>(USER_KEY),
  accessToken: Storage.getItem<string>(TOKEN_KEY),
  expiresAt: Storage.getItem<number>(EXPIRES_KEY),

  setUser: (user) => {
    if (user) {
      Storage.setItem(USER_KEY, user);
      set({ user, isAuthenticated: true });
    } else {
      Storage.removeItem(USER_KEY);
      set({ user: null, isAuthenticated: false });
    }
  },

  setSession: (accessToken, expiresAt) => {
    Storage.setItem(TOKEN_KEY, accessToken);
    Storage.setItem(EXPIRES_KEY, expiresAt);
    set({ accessToken, expiresAt });
  },

  clearAuth: () => {
    Storage.removeItem(USER_KEY);
    Storage.removeItem(TOKEN_KEY);
    Storage.removeItem(EXPIRES_KEY);
    set({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      expiresAt: null,
    });
  },
}));
