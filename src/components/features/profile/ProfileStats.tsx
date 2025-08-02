"use client";

import { useProfileStats } from "./useProfileStats";

export default function ProfileStats() {
  const { loading, expenseCount, mostUsedCategory, daysOfUse } =
    useProfileStats();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="border border-gray-200 rounded-lg p-4 text-center shadow-sm">
        <p className="text-2xl md:text-3xl font-bold text-purple-600">
          {loading ? "-" : expenseCount}
        </p>
        <p className="text-gray-600 text-sm mt-1">Gastos registrados</p>
      </div>
      <div className="border border-gray-200 rounded-lg p-4 text-center shadow-sm">
        <p className="text-lg md:text-xl font-bold text-purple-600 break-words">
          {loading ? "-" : mostUsedCategory || "-"}
        </p>
        <p className="text-gray-600 text-sm mt-1">Categoría más usada</p>
      </div>
      <div className="border border-gray-200 rounded-lg p-4 text-center shadow-sm">
        <p className="text-2xl md:text-3xl font-bold text-purple-600">
          {loading ? "-" : daysOfUse}
        </p>
        <p className="text-gray-600 text-sm mt-1">Días de uso</p>
      </div>
      <div className="border border-gray-200 rounded-lg p-4 text-center shadow-sm">
        <p className="text-2xl md:text-3xl font-bold text-purple-600">3</p>
        <p className="text-gray-600 text-sm mt-1">Metas cumplidas</p>
      </div>
    </div>
  );
}
