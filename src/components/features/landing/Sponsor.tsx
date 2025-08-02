import React from "react";

export default function Sponsor() {
  return (
    <section className="py-16 md:py-24 w-full px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#2f1065]">
          ¿De qué trata?
        </h2>

        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-10 border border-[#d0b5fd]">
          <blockquote className="text-lg md:text-xl leading-relaxed text-center">
            <p className="mb-4">
              Una app <span className="font-bold text-[#7c3aed]">simple</span> y{" "}
              <span className="font-bold text-[#7c3aed]">poderosa</span> para
              controlar tus gastos.
            </p>
            <p className="mb-4">
              <span className="relative inline-block">
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#955cf6] opacity-70"></span>
                Registrá
              </span>{" "}
              tus movimientos,{" "}
              <span className="relative inline-block">
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#955cf6] opacity-70"></span>
                visualizá
              </span>{" "}
              tus finanzas y{" "}
              <span className="relative inline-block">
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#955cf6] opacity-70"></span>
                tomá decisiones
              </span>{" "}
              con claridad.
            </p>
            <p className="font-semibold text-xl md:text-2xl mt-6 text-[#491d95]">
              Tu dinero,{" "}
              <span className="bg-gradient-to-r from-[#7c3aed] to-[#955cf6] bg-clip-text text-transparent font-bold">
                bajo control.
              </span>{" "}
              Siempre.
            </p>
          </blockquote>

          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#7c3aed] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="ml-3 text-[#491d95] font-medium">
                Finanzas Inteligentes
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#2f1065]">
          ¿Cómo funciona?
        </h2>

        <div className="flex flex-col space-y-6 max-w-2xl mx-auto">
          <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-lg flex items-start relative border-4 border-[#d0b5fd] border-opacity-50">
            <div className="w-14 h-14 rounded-full bg-[#7c3aed] flex items-center justify-center flex-shrink-0 mr-6">
              <span className="text-white text-2xl font-bold">1</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#2f1065] mb-2">
                Te registrás
              </h3>
              <p className="text-[#491d95]">
                Crea tu cuenta en segundos y personaliza tu perfil financiero
                para comenzar tu viaje.
              </p>
            </div>
          </div>

          <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-lg flex items-start relative border-4 border-[#d0b5fd] border-opacity-50">
            <div className="w-14 h-14 rounded-full bg-[#7c3aed] flex items-center justify-center flex-shrink-0 mr-6">
              <span className="text-white text-2xl font-bold">2</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#2f1065] mb-2">
                Anotás tus gastos
              </h3>
              <p className="text-[#491d95]">
                Registra fácilmente tus ingresos y gastos diarios con nuestra
                interfaz intuitiva.
              </p>
            </div>
          </div>

          <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-xl p-6 shadow-lg flex items-start relative border-4 border-[#d0b5fd] border-opacity-50">
            <div className="w-14 h-14 rounded-full bg-[#7c3aed] flex items-center justify-center flex-shrink-0 mr-6">
              <span className="text-white text-2xl font-bold">3</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#2f1065] mb-2">
                Entendés tus finanzas
              </h3>
              <p className="text-[#491d95]">
                Visualiza tus patrones de gastos con gráficos claros y toma
                decisiones financieras informadas.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button className="bg-[#7c3aed] text-white rounded-lg px-8 py-3 font-medium hover:bg-[#6928d9] transition-colors shadow-lg">
            Comenzar ahora
          </button>
        </div>
      </div>
    </section>
  );
}
