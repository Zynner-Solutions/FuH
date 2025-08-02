"use client";

import { Suspense } from "react";
import LoginContent from "@/components/features/content/LoginContent";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-[#f7f3ff] to-[#e5d6fe]">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
