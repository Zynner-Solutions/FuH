"use client";

import { Settings, Download, Bell, Lock } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      label: "Configuración",
      icon: <Settings className="w-5 h-5" />,
      description: "Personaliza tu experiencia y preferencias",
    },
    {
      label: "Privacidad",
      icon: <Lock className="w-5 h-5" />,
      description: "Gestiona la seguridad de tu cuenta",
    },
    {
      label: "Exportar datos",
      icon: <Download className="w-5 h-5" />,
      description: "Descarga tus datos financieros",
    },
    {
      label: "Notificaciones",
      icon: <Bell className="w-5 h-5" />,
      description: "Personaliza tus alertas",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Acciones rápidas
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.label}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all text-left"
          >
            <div className="rounded-full p-2 bg-purple-100 text-purple-600 mr-4">
              {action.icon}
            </div>
            <div>
              <p className="font-medium text-gray-800">{action.label}</p>
              <p className="text-sm text-gray-500">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
