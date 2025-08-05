import {
  LoginData,
  RegisterData,
  LoginResponse,
  RegisterResponse,
  ApiErrorResponse,
  ProfileUpdateData,
  ProfileUpdateResponse,
  ExpenseData,
  ExpenseResponse,
  ExpensesListResponse,
  UserProfile,
  Expense,
  Jar,
} from "../types";
import Cookies from "js-cookie";

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

  async getProfile(): Promise<{
    user: UserProfile;
    expenses: Expense[];
  } | null> {
    try {
      const accessToken = Cookies.get("finanz_accessToken");
      const response = await fetch("/api/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
        credentials: "include",
      });
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return { user: data.user, expenses: data.expenses };
    } catch (error) {
      return null;
    }
  },

  async updateProfile(data: ProfileUpdateData): Promise<ProfileUpdateResponse> {
    const accessToken = Cookies.get("finanz_accessToken");

    const response = await fetch("/api/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        (responseData as ApiErrorResponse).error ||
          "Error al actualizar el perfil"
      );
    }

    return responseData as ProfileUpdateResponse;
  },

  async createExpense(data: ExpenseData): Promise<ExpenseResponse> {
    const accessToken = Cookies.get("finanz_accessToken");

    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        (responseData as ApiErrorResponse).error || "Error al crear el gasto"
      );
    }

    return responseData as ExpenseResponse;
  },

  async getExpenses(): Promise<ExpensesListResponse> {
    const accessToken = Cookies.get("finanz_accessToken");

    const response = await fetch("/api/expenses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        (responseData as ApiErrorResponse).error ||
          "Error al obtener los gastos"
      );
    }

    return responseData as ExpensesListResponse;
  },

  async updateExpense(
    id: string,
    data: Partial<ExpenseData>
  ): Promise<ExpenseResponse> {
    const accessToken = Cookies.get("finanz_accessToken");

    const response = await fetch(`/api/expenses`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
      body: JSON.stringify({ id, ...data }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        (responseData as ApiErrorResponse).error ||
          "Error al actualizar el gasto"
      );
    }

    return responseData as ExpenseResponse;
  },

  async deleteExpense(id: string): Promise<{ message: string }> {
    const accessToken = Cookies.get("finanz_accessToken");

    const response = await fetch(`/api/expenses?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        (responseData as ApiErrorResponse).error || "Error al eliminar el gasto"
      );
    }

    return responseData as { message: string };
  },
};
