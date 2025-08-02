"use client";

export default function ProfileStats() {
  const stats = [
    { label: "Gastos registrados", value: "124" },
    { label: "Categorías usadas", value: "8" },
    { label: "Días de uso", value: "45" },
    { label: "Metas cumplidas", value: "3" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="border border-gray-200 rounded-lg p-4 text-center shadow-sm"
        >
          <p className="text-2xl md:text-3xl font-bold text-purple-600">
            {stat.value}
          </p>
          <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
