import jwt from "jsonwebtoken";
import { LoginResponse } from "../types";

type User = LoginResponse["user"];

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = 86400;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET no está definido en las variables de entorno.");
}

export const JWTService = {
  generateToken(user: Partial<User>): { token: string; expiresAt: number } {
    const expiresAt = Math.floor(Date.now() / 1000) + JWT_EXPIRY;

    const payload = {
      id: user.id,
      email: user.email,
      exp: expiresAt,
    };

    const token = jwt.sign(payload, JWT_SECRET);

    return { token, expiresAt };
  },

  verifyToken(token: string): { id: string; email: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
        exp: number;
      };
      return { id: decoded.id, email: decoded.email };
    } catch (error) {
      return null;
    }
  },

  getTokenExpiry(token: string): number | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { exp: number };
      return decoded.exp;
    } catch (error) {
      return null;
    }
  },
};
