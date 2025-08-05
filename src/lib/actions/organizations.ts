"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { unstable_cache } from "next/cache";

export const getOrganizationBySlug = async (slug: string) => {
  try {
    const supabase = createClient(cookies());

    const { data: organization, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching organization:", error);
      return null;
    }

    return organization;
  } catch (error) {
    console.error("Error fetching organization:", error);
    return null;
  }
};

export const listOrganizations = unstable_cache(
  async () => {
    try {
      const supabase = createClient(cookies());

      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching organizations:", error);
        return [];
      }

      return data;
    } catch (error) {
      console.error("Error fetching organizations:", error);
      return [];
    }
  },
  ["organizations-list"],
  { revalidate: 60 }
);
