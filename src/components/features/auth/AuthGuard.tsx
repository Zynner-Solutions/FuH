"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/AuthStore";
import { useRouter, usePathname } from "next/navigation";

const publicRoutes = ["/login", "/register"];
const authRequiredRoutes = ["/profile", "/dashboard"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated && !publicRoutes.includes(pathname)) {
      if (authRequiredRoutes.includes(pathname)) {
        router.push("/login");
      } else if (!pathname.startsWith("/")) {
        router.push("/login");
      }
    }

    if (isAuthenticated && publicRoutes.includes(pathname)) {
      router.push("/");
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
}
