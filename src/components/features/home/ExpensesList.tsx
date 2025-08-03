"use client";

import { useState, useEffect } from "react";
import { useNotification } from "@/components/ui/notifications/useNotification";
import { ApiClient } from "@/lib/api/ApiClient";
import { Expense } from "@/lib/types";
import { Trash2, Edit, RefreshCw } from "lucide-react";

const ExpensesList = () => {
  const { success, error: notifyError, confirm } = useNotification();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiClient.getExpenses();
      setExpenses(response.expenses);
    } catch (error) {
      setError((error as Error).message || "Error al cargar los gastos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleDelete = (id: string) => {
    confirm("¿Estás seguro de que deseas eliminar este gasto?", async () => {
      try {
        await ApiClient.deleteExpense(id);
        loadExpenses();
        success("Gasto eliminado correctamente");
      } catch (err) {
        notifyError((err as Error).message || "Error al eliminar el gasto");
      }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const getCategoryBadgeClass = (category: string) => {
    const colors: { [key: string]: string } = {
      comida: "bg-green-100 text-green-800",
      transporte: "bg-blue-100 text-blue-800",
      entretenimiento: "bg-purple-100 text-purple-800",
      suscripciones: "bg-pink-100 text-pink-800",
      salud: "bg-red-100 text-red-800",
      vivienda: "bg-yellow-100 text-yellow-800",
      otros: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7c3aed]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 mb-4">
        {error}
        <button
          onClick={loadExpenses}
          className="ml-2 text-[#7c3aed] hover:text-[#6928d9] underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#d0b5fd] text-center">
        <p className="text-[#491d95] mb-4">No hay gastos registrados aún.</p>
        <p className="text-gray-500">
          Registra tu primer gasto utilizando el formulario de arriba.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#d0b5fd]">
      <div className="flex justify-between items-center p-4 border-b border-[#d0b5fd]">
        <h2 className="text-xl font-bold text-[#2f1065]">Gastos recientes</h2>
        <button
          onClick={loadExpenses}
          className="flex items-center text-sm text-[#7c3aed] hover:text-[#6928d9] transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Actualizar
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f7f3ff]">
              <th className="py-3 px-4 text-left text-sm font-medium text-[#491d95]">
                Nombre
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-[#491d95]">
                Monto
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-[#491d95]">
                Categoría
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-[#491d95]">
                Fecha
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-[#491d95]">
                Recurrente
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-[#491d95]">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d0b5fd]">
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="hover:bg-[#f7f3ff] transition-colors"
              >
                <td className="py-3 px-4 text-sm text-[#2f1065] font-medium">
                  {expense.name}
                </td>
                <td className="py-3 px-4 text-sm text-[#2f1065]">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeClass(
                      expense.category
                    )}`}
                  >
                    {expense.category}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {formatDate(expense.date)}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {expense.is_recurring ? "Sí" : "No"}
                </td>
                <td className="py-3 px-4 text-sm">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpensesList;
