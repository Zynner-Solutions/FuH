"use client";

import { Settings, Download, Bell, Building } from "lucide-react";
import { useRouter } from "next/navigation";

import { Expense } from "@/lib/types";
import { useState } from "react";
import JarForm from "@/components/forms/JarForm";
type Props = {
  expenses: Expense[];
  onJarCreated?: () => void;
};
export default function QuickActions({ expenses, onJarCreated }: Props) {
  const router = useRouter();
  const expenseCount = expenses.length;
  let mostUsedCategory = "-";
  if (expenses.length > 0) {
    const categoryCount: Record<string, number> = {};
    expenses.forEach((e: Expense) => {
      categoryCount[e.category] = (categoryCount[e.category] || 0) + 1;
    });
    const sortedCategories = Object.entries(categoryCount).sort(
      (a, b) => b[1] - a[1]
    );
    if (sortedCategories.length > 0) {
      mostUsedCategory = sortedCategories[0][0];
    }
  }
  const [showJarForm, setShowJarForm] = useState(false);
  const actions = [
    {
      label: "Configuración",
      icon: <Settings className="w-5 h-5" />,
      description: "Personaliza tu experiencia y preferencias",
    },
    {
      label: "Organizaciones",
      icon: <Building className="w-5 h-5" />,
      description: "Crea y gestiona tus organizaciones",
    },
    {
      label: "Exportar datos",
      icon: <Download className="w-5 h-5" />,
      description: `Descarga tus datos financieros. Gastos registrados: ${expenseCount}`,
      semiDisabled: true,
    },
    {
      label: "Frascos",
      icon: <Bell className="w-5 h-5" />,
      description: `Crea y gestiona tus frascos de ahorro`,
      onClick: () => setShowJarForm((v) => !v),
    },
  ];
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Acciones rápidas
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => {
              if (action.semiDisabled) return;
              if (action.label === "Configuración") {
                const event = new CustomEvent("toggleEditMode", {
                  detail: { editMode: true },
                });
                window.dispatchEvent(event);
              } else if (action.label === "Organizaciones") {
                router.push("/organizations");
              } else if (action.label === "Frascos" && action.onClick) {
                action.onClick();
              }
            }}
            className={`flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all text-left ${
              action.semiDisabled ? "opacity-60 cursor-not-allowed" : ""
            }`}
            tabIndex={action.semiDisabled ? -1 : 0}
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
        {showJarForm && (
          <div className="col-span-1 sm:col-span-2 w-full mt-2">
            <div className="w-full max-w-2xl mx-auto">
              <JarForm
                onSuccess={() => {
                  setShowJarForm(false);
                  if (onJarCreated) onJarCreated();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
