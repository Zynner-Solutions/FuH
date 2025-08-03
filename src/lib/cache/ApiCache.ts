import { mutate } from "swr";

export const CACHE_KEYS = {
  EXPENSES: "expenses",
};

export class ApiCache {
  static refreshExpenses() {
    return mutate(CACHE_KEYS.EXPENSES, undefined, {
      revalidate: true,
      populateCache: true,
      rollbackOnError: false,
    });
  }

  static invalidateExpenses() {
    return mutate(CACHE_KEYS.EXPENSES, undefined, { revalidate: true });
  }
}
