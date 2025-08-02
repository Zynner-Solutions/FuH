"use client";

import { useState } from "react";
import ExpensesForm from "@/components/forms/ExpensesForm";
import ExpensesList from "@/components/features/home/ExpensesList";
import ExpensesStats from "@/components/features/home/ExpensesStats";
import DashboardContent from "@/components/features/home/DashboardContent";

export default function HomeContent() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const handleExpenseAdded = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#2f1065] mb-2">
          Gestión de gastos
        </h1>
        <p className="text-[#491d95]">
          Registra, visualiza y analiza todos tus gastos para mantener un mejor
          control financiero.
        </p>
      </div>

      <div className="flex border-b border-[#d0b5fd] mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-6 py-3 text-sm font-medium whitespace-nowrap flex items-center ${
            activeTab === "dashboard"
              ? "border-b-2 border-[#7c3aed] text-[#7c3aed]"
              : "text-gray-500 hover:text-[#7c3aed]"
          }`}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setActiveTab("register")}
          className={`px-6 py-3 text-sm font-medium whitespace-nowrap flex items-center ${
            activeTab === "register"
              ? "border-b-2 border-[#7c3aed] text-[#7c3aed]"
              : "text-gray-500 hover:text-[#7c3aed]"
          }`}
        >
          ➕ Registrar gastos
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={`px-6 py-3 text-sm font-medium whitespace-nowrap flex items-center ${
            activeTab === "list"
              ? "border-b-2 border-[#7c3aed] text-[#7c3aed]"
              : "text-gray-500 hover:text-[#7c3aed]"
          }`}
        >
          📋 Listar gastos
        </button>
      </div>

      {activeTab === "dashboard" && <DashboardContent />}

      {activeTab === "register" && (
        <div className="max-w-md mx-auto">
          <ExpensesForm onSuccess={handleExpenseAdded} />
        </div>
      )}

      {activeTab === "list" && (
        <div className="space-y-6">
          <ExpensesStats key={`stats-${refreshKey}`} />
          <ExpensesList key={`list-${refreshKey}`} />
        </div>
      )}
    </div>
  );
}
