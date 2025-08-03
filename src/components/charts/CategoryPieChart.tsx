"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useExpenses } from "@/lib/hooks/useExpenses";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryPieChart() {
  const { expenses, isLoading: loading, error } = useExpenses();

  const getChartData = () => {
    const categorias = expenses.reduce((acc, expense) => {
      const { category, amount } = expense;
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {} as { [key: string]: number });

    const backgroundColors = {
      comida: "rgba(75, 192, 192, 0.7)",
      transporte: "rgba(54, 162, 235, 0.7)",
      entretenimiento: "rgba(153, 102, 255, 0.7)",
      suscripciones: "rgba(255, 99, 132, 0.7)",
      salud: "rgba(255, 159, 64, 0.7)",
      vivienda: "rgba(255, 206, 86, 0.7)",
      otros: "rgba(201, 203, 207, 0.7)",
    };

    const labels = Object.keys(categorias);
    const data = Object.values(categorias);
    const colors = labels.map(
      (cat) =>
        backgroundColors[cat as keyof typeof backgroundColors] ||
        "rgba(201, 203, 207, 0.7)"
    );

    return {
      labels,
      datasets: [
        {
          label: "Gastos por categoría",
          data,
          backgroundColor: colors,
          borderColor: colors.map((color) => color.replace("0.7", "1")),
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          font: {
            family: "var(--font-geist-sans)",
            size: 12,
          },
          color: "#491d95",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.chart.getDatasetMeta(0).total;
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(value)} (${percentage}%)`;
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
          Registra gastos para visualizar el gráfico por categorías
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#d0b5fd]">
      <h2 className="text-xl font-bold text-[#2f1065] mb-4">
        ¿En qué se va la plata?
      </h2>
      <div className="h-64">
        <Pie data={getChartData()} options={chartOptions} />
      </div>
    </div>
  );
}
