export default function LandingHero() {
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#2f1065] md:text-5xl lg:text-6xl">
          Controla tus gastos, domina tu futuro financiero.
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-[#491d95] md:text-xl">
          Registra, organiza y analiza tus finanzas facilmente para tomar
          decisiones inteligentes y ahorrar mas cada dia.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <button className="rounded-lg bg-[#7c3aed] px-6 py-3 font-medium text-white shadow-lg hover:bg-[#6928d9] transition-all">
            Comenzar ahora
          </button>
          <button className="rounded-lg border-2 border-[#7c3aed] px-6 py-3 font-medium text-[#7c3aed] hover:bg-[#f7f3ff] transition-all">
            Saber más
          </button>
        </div>
      </div>
    </div>
  );
}
