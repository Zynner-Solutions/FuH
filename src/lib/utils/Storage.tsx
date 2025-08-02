import Cookies from "js-cookie";

const COOKIE_PREFIX = "finanz_";

export const Storage = {
  setItem(key: string, value: any, options?: Cookies.CookieAttributes): void {
    if (typeof value === "object") {
      Cookies.set(`${COOKIE_PREFIX}${key}`, JSON.stringify(value), options);
    } else {
      Cookies.set(`${COOKIE_PREFIX}${key}`, String(value), options);
    }
  },

  getItem<T>(key: string): T | null {
    const value = Cookies.get(`${COOKIE_PREFIX}${key}`);
    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch (e) {
      return value as unknown as T;
    }
  },

  removeItem(key: string): void {
    Cookies.remove(`${COOKIE_PREFIX}${key}`);
  },

  clear(): void {
    Object.keys(Cookies.get()).forEach((cookie) => {
      if (cookie.startsWith(COOKIE_PREFIX)) {
        Cookies.remove(cookie);
      }
    });
  },
};
