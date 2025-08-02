import { HelpCircle } from "lucide-react";

export default function FAQHero() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-6">
        <HelpCircle className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">
        FAQ: Wallet Financiera Personal
      </h1>
      <p className="text-xl text-purple-700 max-w-2xl mx-auto">
        Encuentra respuestas a las preguntas más frecuentes sobre nuestra
        aplicación de gestión financiera personal
      </p>
    </div>
  );
}
