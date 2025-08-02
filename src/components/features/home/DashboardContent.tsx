"use client";

import { useState } from "react";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import DailyTrendChart from "@/components/charts/DailyTrendChart";
import ExpensesCalendar from "@/components/charts/ExpensesCalendar";
import ExpensesMetrics from "@/components/charts/ExpensesMetrics";

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState<"charts" | "calendar">("charts");

  return (
    <div>
      <section className="mb-8">
        <ExpensesMetrics />
      </section>

      <div className="flex border-b border-[#d0b5fd] mb-6">
        <button
          onClick={() => setActiveTab("charts")}
          className={`px-6 py-2 text-sm font-medium ${
            activeTab === "charts"
              ? "border-b-2 border-[#7c3aed] text-[#7c3aed]"
              : "text-gray-500 hover:text-[#7c3aed]"
          }`}
        >
          📊 Gráficos
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className={`px-6 py-2 text-sm font-medium ${
            activeTab === "calendar"
              ? "border-b-2 border-[#7c3aed] text-[#7c3aed]"
              : "text-gray-500 hover:text-[#7c3aed]"
          }`}
        >
          📆 Calendario
        </button>
      </div>

      {activeTab === "charts" ? (
        <>
          <section className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryPieChart />
              <MonthlyBarChart />
            </div>
          </section>

          <section>
            <DailyTrendChart />
          </section>
        </>
      ) : (
        <>
          <section>
            <ExpensesCalendar />
          </section>
        </>
      )}
    </div>
  );
}
