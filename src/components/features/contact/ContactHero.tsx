import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactHero() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-6">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">
          Contáctanos
        </h1>
        <p className="text-xl text-purple-700 max-w-2xl mx-auto">
          Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo
          antes posible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
          <div className="bg-purple-100 p-3 rounded-full mb-4">
            <Mail className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Email</h3>
          <p className="text-purple-700">zynnersolutions@gmail.com</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
          <div className="bg-purple-100 p-3 rounded-full mb-4">
            <Phone className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-purple-900 mb-2">
            Teléfono
          </h3>
          <p className="text-purple-700">+54 11 6767-2197</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
          <div className="bg-purple-100 p-3 rounded-full mb-4">
            <MapPin className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-purple-900 mb-2">
            Ubicación
          </h3>
          <p className="text-purple-700">Buenos Aires, San Miguel</p>
        </div>
      </div>
    </div>
  );
}
