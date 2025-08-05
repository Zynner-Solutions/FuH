"use client";

import { Expense } from "@/lib/types";
type Props = { expenses: Expense[] };
export default function ProfileStats({ expenses }: Props) {
  let expenseCount = expenses.length;
  let mostUsedCategory = "-";
  let daysOfUse = 0;
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
    const sorted = [...expenses].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    const first = new Date(sorted[0].created_at).getTime();
    const last = new Date(sorted[sorted.length - 1].created_at).getTime();
    daysOfUse = Math.max(
      1,
      Math.ceil((last - first) / (1000 * 60 * 60 * 24)) + 1
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
      <div className="border border-gray-200 rounded-lg p-4 text-center shadow-sm">
        <p className="text-2xl md:text-3xl font-bold text-purple-600">
          {expenseCount}
        </p>
        <p className="text-gray-600 text-sm mt-1">Gastos registrados</p>
      </div>
      <div className="border border-gray-200 rounded-lg p-4 text-center shadow-sm">
        <p className="text-lg md:text-xl font-bold text-purple-600 break-words">
          {mostUsedCategory}
        </p>
        <p className="text-gray-600 text-sm mt-1">Categoría más usada</p>
      </div>
      <div className="border border-gray-200 rounded-lg p-4 text-center shadow-sm">
        <p className="text-2xl md:text-3xl font-bold text-purple-600">
          {daysOfUse}
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
