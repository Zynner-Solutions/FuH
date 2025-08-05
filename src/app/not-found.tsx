"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Home, PiggyBank } from "lucide-react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const goBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const goHome = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="text-center max-w-lg mx-auto">
        <div className="mb-8">
          <div className="text-8xl font-bold text-gray-300 mb-4">404</div>
          <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <PiggyBank className="w-8 h-8 text-violet-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Página no encontrada
        </h1>
        <p className="text-gray-600 mb-8">
          La página que buscas no existe o ha sido movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={goBack}
            className="flex items-center justify-center px-6 py-3 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </button>

          <button
            onClick={goHome}
            className="flex items-center justify-center px-6 py-3 bg-white text-violet-600 font-medium rounded-lg border border-violet-200 hover:bg-violet-50 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Inicio
          </button>
        </div>
      </div>
    </div>
  );
}
