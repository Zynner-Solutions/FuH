"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";

export const getExpensesData = unstable_cache(
  async () => {
    try {
      const supabase = createClient(cookies());

      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching expenses:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching expenses data:", error);
      return [];
    }
  },
  ["expenses-data"],
  {
    tags: ["expenses"],
    revalidate: 3600,
  }
);
