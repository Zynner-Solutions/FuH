"use client";

import useSWR from "swr";
import { ApiClient } from "@/lib/api/ApiClient";
import type { ExpensesListResponse } from "@/lib/types";
import { CACHE_KEYS } from "@/lib/cache/ApiCache";

export const expensesFetcher = async (): Promise<ExpensesListResponse> => {
  return await ApiClient.getExpenses();
};

export function useExpenses() {
  const { data, error, isLoading, mutate } = useSWR(
    CACHE_KEYS.EXPENSES,
    expensesFetcher,
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      dedupingInterval: 1000,
    }
  );

  return {
    expenses: data?.expenses || [],
    isLoading,
    error: error as Error | null,
    mutate,
  };
}
