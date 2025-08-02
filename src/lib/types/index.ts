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
}
