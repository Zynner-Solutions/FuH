"use client";

import RegisterForm from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-[#f7f3ff] to-[#e5d6fe]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-[#2f1065] mb-2">
          Crea tu cuenta
        </h1>
        <p className="text-center text-sm text-[#491d95]">
          Regístrate para comenzar a controlar tus finanzas
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-[#d0b5fd]">
          <RegisterForm />
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
