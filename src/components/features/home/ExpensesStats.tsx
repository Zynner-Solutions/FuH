"use client";

import { useExpenses } from "@/lib/hooks/useExpenses";

export default function ExpensesStats() {
  const { expenses, isLoading: loading, error } = useExpenses();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const totalGasto = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const gastoPorCategoria: { [key: string]: number } = expenses.reduce(
    (acc, expense) => {
      const { category, amount } = expense;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    },
    {} as { [key: string]: number }
  );

  const categoriaMayor = Object.entries(gastoPorCategoria).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const gastosMesActual = expenses.filter((expense) => {
    const fechaGasto = new Date(expense.date);
    const ahora = new Date();
    return (
      fechaGasto.getMonth() === ahora.getMonth() &&
      fechaGasto.getFullYear() === ahora.getFullYear()
    );
  });

  const totalMesActual = gastosMesActual.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7c3aed]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4">
        {error.message || "Error al cargar estadísticas"}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#d0b5fd]">
      <h2 className="text-xl font-bold text-[#2f1065] mb-4">
        Estadísticas rápidas
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#f7f3ff] p-4 rounded-lg">
          <h3 className="text-sm font-medium text-[#491d95] mb-1">
            Total de gastos
          </h3>
          <p className="text-2xl font-bold text-[#2f1065]">
            {formatCurrency(totalGasto)}
          </p>
        </div>

        <div className="bg-[#f7f3ff] p-4 rounded-lg">
          <h3 className="text-sm font-medium text-[#491d95] mb-1">
            Gastos este mes
          </h3>
          <p className="text-2xl font-bold text-[#2f1065]">
            {formatCurrency(totalMesActual)}
          </p>
        </div>

        <div className="bg-[#f7f3ff] p-4 rounded-lg">
          <h3 className="text-sm font-medium text-[#491d95] mb-1">
            Mayor categoría de gasto
          </h3>
          {categoriaMayor ? (
            <>
              <p className="text-lg font-bold text-[#2f1065] capitalize">
                {categoriaMayor[0]}
              </p>
              <p className="text-sm text-[#6928d9]">
                {formatCurrency(categoriaMayor[1])}
              </p>
            </>
          ) : (
            <p className="text-lg text-gray-500">No hay datos</p>
          )}
        </div>
      </div>
    </div>
  );
}
