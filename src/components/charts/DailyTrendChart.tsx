"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ApiClient } from "@/lib/api/ApiClient";
import { Expense } from "@/lib/types";
import {
  format,
  parseISO,
  subDays,
  eachDayOfInterval,
  isValid,
  startOfDay,
} from "date-fns";
import { es } from "date-fns/locale";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DailyTrendChart() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<"daily" | "weekly">("daily");

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ApiClient.getExpenses();
        setExpenses(response.expenses);
      } catch (error) {
        setError(
          (error as Error).message || "Error al cargar datos para el gráfico"
        );
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, []);

  const getChartData = () => {
    const today = new Date();
    const daysToShow = period === "daily" ? 14 : 28;
    const startDate = subDays(today, daysToShow);

    const dateRange = eachDayOfInterval({
      start: startDate,
      end: today,
    });

    const expensesByDate: Record<string, number> = {};

    dateRange.forEach((date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      expensesByDate[dateKey] = 0;
    });

    expenses.forEach((expense) => {
      const expenseDate = parseISO(expense.date);
      if (isValid(expenseDate)) {
        const dateKey = format(startOfDay(expenseDate), "yyyy-MM-dd");
        if (expensesByDate[dateKey] !== undefined) {
          expensesByDate[dateKey] += expense.amount;
        }
      }
    });

    let labels: string[] = [];
    let data: number[] = [];

    if (period === "daily") {
      labels = Object.keys(expensesByDate).map((dateKey) =>
        format(parseISO(dateKey), "dd MMM", { locale: es })
      );
      data = Object.values(expensesByDate);
    } else {
      const weeklyData: Record<string, number> = {};
      Object.entries(expensesByDate).forEach(([dateKey, amount]) => {
        const date = parseISO(dateKey);
        const weekKey = format(date, "'Sem' w, yyyy", { locale: es });
        weeklyData[weekKey] = (weeklyData[weekKey] || 0) + amount;
      });

      labels = Object.keys(weeklyData);
      data = Object.values(weeklyData);
    }

    return {
      labels,
      datasets: [
        {
          label: period === "daily" ? "Gastos diarios" : "Gastos semanales",
          data,
          borderColor: "rgba(124, 58, 237, 1)",
          backgroundColor: "rgba(124, 58, 237, 0.2)",
          fill: true,
          tension: 0.4,
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
          callback: function (tickValue: string | number) {
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
          maxRotation: 45,
          minRotation: 45,
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
        {error}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-[#d0b5fd] text-center h-64 flex flex-col justify-center">
        <p className="text-[#491d95] mb-2">No hay datos disponibles</p>
        <p className="text-gray-500 text-sm">
          Registra gastos para visualizar la evolución de gastos
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#d0b5fd]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#2f1065]">
          Evolución de gastos
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setPeriod("daily")}
            className={`px-3 py-1 text-sm rounded-md ${
              period === "daily"
                ? "bg-[#7c3aed] text-white"
                : "bg-[#f7f3ff] text-[#491d95] hover:bg-[#e5d6fe]"
            }`}
          >
            Diario
          </button>
          <button
            onClick={() => setPeriod("weekly")}
            className={`px-3 py-1 text-sm rounded-md ${
              period === "weekly"
                ? "bg-[#7c3aed] text-white"
                : "bg-[#f7f3ff] text-[#491d95] hover:bg-[#e5d6fe]"
            }`}
          >
            Semanal
          </button>
        </div>
      </div>
      <div className="h-64">
        <Line data={getChartData()} options={chartOptions} />
      </div>
    </div>
  );
}
