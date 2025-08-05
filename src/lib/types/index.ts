export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  surname: string;
  alias: string;
  email: string;
  password: string;
  avatar_url?: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    surname: string;
    alias: string;
    avatar_url: string | null;
  };
  session: {
    access_token: string;
    expires_at: number;
  };
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    surname: string;
    alias: string;
    avatar_url: string | null;
  };
}

export interface ApiErrorResponse {
  error: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  surname: string;
  alias: string;
  avatar_url: string | null;
  created_at: string;
  jars: Jar[];
}

export interface ProfileUpdateData {
  alias?: string;
  password?: string;
  avatarUrl?: string;
}

export interface ProfileUpdateResponse {
  user: UserProfile;
  message: string;
}

export interface ExpenseData {
  name: string;
  amount: number;
  category: string;
  date?: string;
  notes?: string;
  is_recurring?: boolean;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  notes: string | null;
  is_recurring: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseResponse {
  message: string;
  expense: Expense;
}

export interface ExpensesListResponse {
  expenses: Expense[];
}
export interface Jar {
  id: string;
  name: string;
  description?: string;
  target: number;
  saved: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt?: string;
}
