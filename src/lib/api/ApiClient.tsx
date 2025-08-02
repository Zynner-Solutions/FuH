import {
  LoginData,
  RegisterData,
  LoginResponse,
  RegisterResponse,
  ApiErrorResponse,
} from "../types";

export const ApiClient = {
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        (responseData as ApiErrorResponse).error ||
          "Error en el inicio de sesión"
      );
    }

    return responseData as LoginResponse;
  },

  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        (responseData as ApiErrorResponse).error || "Error en el registro"
      );
    }

    return responseData as RegisterResponse;
  },

  async logout(): Promise<void> {
    await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  async getCurrentUser(): Promise<LoginResponse["user"] | null> {
    try {
      const response = await fetch("/api/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      return null;
    }
  },
};
