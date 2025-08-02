"use client";

import LoginForm from "@/components/forms/LoginForm";
import { useSearchParams } from "next/navigation";

export default function LoginContent() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-[#f7f3ff] to-[#e5d6fe]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-[#2f1065] mb-2">
          Bienvenido de nuevo
        </h1>
        <p className="text-center text-sm text-[#491d95]">
          Ingresa a tu cuenta para continuar
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {registered && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-center">
            ¡Registro exitoso! Ahora puedes iniciar sesión.
          </div>
        )}
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-[#d0b5fd]">
          <LoginForm />
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-[#491d95]">
          © 2025 Zynee. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
