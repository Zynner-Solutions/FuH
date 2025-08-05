export default function OrganizationsHeader() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 text-center flex flex-col items-center justify-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2f1065] mb-3 leading-tight">
        Organizaciones
      </h1>
      <h2 className="text-lg sm:text-xl text-[#7c3aed] font-semibold mb-2">
        Crea y gestiona tu organización fácilmente
      </h2>
      <p className="text-gray-600 max-w-xl mx-auto mb-2 text-base sm:text-lg">
        Registrá tu organización completando el formulario. Una vez aceptado, ya
        podés empezar a gestionarla y sumar miembros.
      </p>
    </div>
  );
}
