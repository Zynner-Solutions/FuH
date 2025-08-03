"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  format,
  parse,
  isValid,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { useExpenses } from "@/lib/hooks/useExpenses";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthlyBarChart() {
  const { expenses, isLoading: loading, error } = useExpenses();

  const getChartData = () => {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);

    const monthRange = eachMonthOfInterval({
      start: startOfMonth(sixMonthsAgo),
      end: endOfMonth(now),
    });

    const monthlyTotals: Record<string, number> = {};

    monthRange.forEach((date) => {
      const monthKey = format(date, "yyyy-MM");
      monthlyTotals[monthKey] = 0;
    });

    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date);
      if (isValid(expenseDate)) {
        const monthKey = format(expenseDate, "yyyy-MM");
        if (monthlyTotals[monthKey] !== undefined) {
          monthlyTotals[monthKey] += expense.amount;
        }
      }
    });

    const labels = Object.keys(monthlyTotals).map((monthKey) => {
      const date = parse(monthKey, "yyyy-MM", new Date());
      return format(date, "MMM yyyy", { locale: es });
    });

    const data = Object.values(monthlyTotals);

    return {
      labels,
      datasets: [
        {
          label: "Gastos mensuales",
          data,
          backgroundColor: "rgba(124, 58, 237, 0.7)",
          borderColor: "rgba(124, 58, 237, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (
            this: any,
            tickValue: string | number,
            index: number,
            ticks: any[]
          ) {
            return new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
              notation: "compact",
            }).format(Number(tickValue));
          },
          color: "#491d95",
        },
      },
      x: {
        ticks: {
          color: "#491d95",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(context.raw);
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#7c3aed]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4">
        {error.message || "Error al cargar los datos"}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#d0b5fd] text-center h-64 flex flex-col justify-center">
        <p className="text-[#491d95] mb-2">No hay datos disponibles</p>
        <p className="text-gray-500 text-sm">
          Registra gastos para visualizar el gráfico mensual
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#d0b5fd]">
      <h2 className="text-xl font-bold text-[#2f1065] mb-4">
        ¿Gasto más o menos que antes?
      </h2>
      <div className="h-64">
        <Bar data={getChartData()} options={chartOptions} />
      </div>
    </div>
  );
}
