"use client";

import { useState, useEffect } from "react";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from "date-fns";
import { useExpenses } from "@/lib/hooks/useExpenses";
import { ApiCache } from "@/lib/cache/ApiCache";

export default function ExpensesMetrics() {
  const { expenses, isLoading: loading, error } = useExpenses();
  const [metrics, setMetrics] = useState({
    total: 0,
    monthlyTotal: 0,
    averageExpense: 0,
    categoryCount: 0,
    maxExpense: {
      amount: 0,
      name: "",
    },
  });

  useEffect(() => {
    if (expenses.length > 0) {
      const today = new Date();
      const firstDay = startOfMonth(today);
      const lastDay = endOfMonth(today);

      const totalExpenses = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      const monthlyExpenses = expenses.filter((expense) => {
        const expenseDate = parseISO(expense.date);
        return isWithinInterval(expenseDate, { start: firstDay, end: lastDay });
      });
      const monthlyTotal = monthlyExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      const averageExpense = totalExpenses / expenses.length;

      const uniqueCategories = new Set(
        expenses.map((expense) => expense.category)
      ).size;

      let maxExpense = {
        amount: 0,
        name: "",
      };

      expenses.forEach((expense) => {
        if (expense.amount > maxExpense.amount) {
          maxExpense = {
            amount: expense.amount,
            name: expense.name,
          };
        }
      });

      setMetrics({
        total: totalExpenses,
        monthlyTotal: monthlyTotal,
        averageExpense: averageExpense,
        categoryCount: uniqueCategories,
        maxExpense: maxExpense,
      });
    }
  }, [expenses]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7c3aed]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 text-sm">
        {error.message || "Error al cargar los datos"}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#d0b5fd]">
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm text-[#491d95]">Total acumulado</p>
          <button
            onClick={() => ApiCache.refreshExpenses()}
            className="text-xs text-[#7c3aed] hover:text-[#6928d9]"
            title="Actualizar datos"
          >
            ↻
          </button>
        </div>
        <p className="text-2xl font-bold text-[#2f1065]">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(metrics.total)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {expenses.length} transacciones registradas
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#d0b5fd]">
        <p className="text-sm text-[#491d95] mb-1">
          Total {format(new Date(), "MMMM")}
        </p>
        <p className="text-2xl font-bold text-[#2f1065]">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(metrics.monthlyTotal)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {((metrics.monthlyTotal / metrics.total) * 100).toFixed(1)}% del total
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#d0b5fd]">
        <p className="text-sm text-[#491d95] mb-1">Promedio por gasto</p>
        <p className="text-2xl font-bold text-[#2f1065]">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(metrics.averageExpense)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          En {metrics.categoryCount} categorías
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#d0b5fd]">
        <p className="text-sm text-[#491d95] mb-1">Gasto más alto</p>
        <p className="text-2xl font-bold text-[#2f1065]">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(metrics.maxExpense.amount)}
        </p>
        <p
          className="text-xs text-gray-500 mt-1 truncate"
          title={metrics.maxExpense.name}
        >
          {metrics.maxExpense.name}
        </p>
      </div>
    </div>
  );
}
