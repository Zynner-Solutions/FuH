"use client";

import { useState, useEffect, useMemo } from "react";
import { Member, Payment } from "@/lib/types";
import PaymentForm from "@/components/forms/PaymentForm";
import { useNotification } from "@/components/ui/notifications/useNotification";

interface MemberInfoDetailProps {
  member: Member;
  onAddPayment: (payment: Payment) => void;
  onClose: () => void;
}

export default function MemberInfoDetail({
  member,
  onAddPayment,
  onClose,
}: MemberInfoDetailProps) {
  const [showForm, setShowForm] = useState(false);
  const [showAllPayments, setShowAllPayments] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const { success, error: notifyError } = useNotification();

  const paymentsPerPage = 5;

  const handleAddPayment = async (values: {
    amount: number;
    date: string;
    notes: string;
  }) => {
    try {
      await onAddPayment(values);
      success("Pago registrado correctamente");
      setShowForm(false);
      setCurrentPage(1);
    } catch (err: any) {
      notifyError(err.message || "Error al registrar pago");
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const filteredPayments = useMemo(() => {
    if (!member.payments || !Array.isArray(member.payments)) return [];

    return member.payments
      .filter((payment) => {
        if (!searchTerm) return true;

        const searchLower = searchTerm.toLowerCase();

        const monthNamesSpanish = [
          "enero",
          "febrero",
          "marzo",
          "abril",
          "mayo",
          "junio",
          "julio",
          "agosto",
          "septiembre",
          "octubre",
          "noviembre",
          "diciembre",
        ];

        if (payment.notes?.toLowerCase().includes(searchLower)) return true;
        if (payment.amount.toString().includes(searchLower)) return true;
        if (payment.date.includes(searchLower)) return true;

        if (payment.date && /^\d{4}-\d{2}-\d{2}$/.test(payment.date)) {
          const date = new Date(payment.date);
          if (!isNaN(date.getTime())) {
            const monthName = date
              .toLocaleDateString("es", { month: "long" })
              .toLowerCase();
            const yearStr = date.getFullYear().toString();
            const monthYearStr = `${monthName} ${yearStr}`;
            const yearMonthStr = `${yearStr} ${monthName}`;

            if (monthName.includes(searchLower)) return true;
            if (monthYearStr.includes(searchLower)) return true;
            if (yearMonthStr.includes(searchLower)) return true;

            const monthIndex = date.getMonth();
            if (monthNamesSpanish[monthIndex].includes(searchLower))
              return true;
          }
        }

        return false;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [member.payments, searchTerm, sortOrder]);

  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * paymentsPerPage;
    return filteredPayments.slice(startIndex, startIndex + paymentsPerPage);
  }, [filteredPayments, currentPage]);

  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  const displayedPayments = showAllPayments
    ? paginatedPayments
    : filteredPayments.slice(0, 3);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 overflow-y-auto pt-4 pb-4"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#ede9fe] to-[#f5f3ff] rounded-3xl shadow-2xl p-4 sm:p-6 flex flex-col gap-4 border border-violet-200 m-2 my-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-violet-100 text-violet-700 text-2xl font-bold shadow transition"
          aria-label="Cerrar"
          type="button"
        >
          ×
        </button>
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-violet-200 to-purple-300 flex items-center justify-center shadow-lg mb-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-violet-700">
              {member.nombre?.[0]?.toUpperCase() || "?"}
              {member.apellido?.[0]?.toUpperCase() || ""}
            </span>
          </div>
          <span className="text-xl sm:text-2xl font-bold text-violet-800 tracking-tight">
            {member.nombre} {member.apellido}
          </span>
        </div>

        <div className="mt-1">
          <div className="flex flex-row items-center justify-between mb-2">
            <span className="text-base sm:text-lg font-semibold text-[#491d95]">
              Pagos
            </span>
            {member.payments &&
              member.payments.length > 3 &&
              !showAllPayments && (
                <button
                  onClick={() => setShowAllPayments(true)}
                  className="text-violet-600 hover:text-violet-800 font-semibold text-xs sm:text-sm"
                >
                  Ver más pagos
                </button>
              )}
          </div>

          {showAllPayments && (
            <div className="flex flex-col gap-2 mb-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Buscar pagos..."
                  className="border border-violet-200 rounded-lg px-3 py-1 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-violet-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex flex-row gap-1 mt-1 sm:mt-0 justify-end">
                  <button
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border border-violet-200 ${
                      sortOrder === "desc"
                        ? "bg-violet-500 text-white"
                        : "bg-white text-violet-700"
                    }`}
                    onClick={() => setSortOrder("desc")}
                    title="Más recientes primero"
                  >
                    ↓
                  </button>
                  <button
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border border-violet-200 ${
                      sortOrder === "asc"
                        ? "bg-violet-500 text-white"
                        : "bg-white text-violet-700"
                    }`}
                    onClick={() => setSortOrder("asc")}
                    title="Más antiguos primero"
                  >
                    ↑
                  </button>
                </div>
              </div>
            </div>
          )}

          {!member.payments || member.payments.length === 0 ? (
            <span className="text-gray-500">No tiene pagos.</span>
          ) : (
            <>
              <ul className="flex flex-col gap-2">
                {displayedPayments.map((p, i) => (
                  <li
                    key={i}
                    className="flex flex-row items-center gap-2 bg-white rounded-lg p-2 sm:p-3 shadow border border-violet-100"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center">
                        <span className="font-bold text-violet-700 text-base sm:text-lg">
                          ${p.amount.toFixed(2)}
                        </span>
                        <span className="ml-2 text-xs sm:text-sm text-gray-500">
                          {p.date && /^\d{4}-\d{2}-\d{2}$/.test(p.date)
                            ? new Date(p.date).toLocaleDateString("es", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : p.date}
                        </span>
                      </div>
                      {p.notes && (
                        <span className="block text-xs text-gray-400 mt-1 truncate max-w-full">
                          {p.notes}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {showAllPayments && filteredPayments.length > 5 && (
                <div className="flex justify-center mt-2">
                  <div className="flex flex-wrap gap-1 justify-center">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-2 py-0.5 rounded-md text-sm ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-400"
                          : "bg-violet-100 text-violet-700 hover:bg-violet-200"
                      }`}
                    >
                      ←
                    </button>
                    {[...Array(totalPages)].map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`px-2 py-0.5 rounded-md text-sm ${
                          currentPage === idx + 1
                            ? "bg-violet-600 text-white"
                            : "bg-violet-100 text-violet-700 hover:bg-violet-200"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`px-2 py-0.5 rounded-md text-sm ${
                        currentPage === totalPages
                          ? "bg-gray-200 text-gray-400"
                          : "bg-violet-100 text-violet-700 hover:bg-violet-200"
                      }`}
                    >
                      →
                    </button>
                  </div>
                </div>
              )}

              {member.payments.length > 3 && !showAllPayments && (
                <div className="flex justify-center mt-2">
                  <button
                    onClick={() => setShowAllPayments(true)}
                    className="bg-violet-100 hover:bg-violet-200 text-violet-700 px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition shadow-sm hover:shadow"
                  >
                    Ver todos los pagos ({member.payments.length})
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <button
          className="mt-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-bold text-sm sm:text-base shadow hover:from-violet-700 hover:to-purple-700 transition"
          onClick={() => setShowForm((v) => !v)}
        >
          Registrar pago
        </button>

        {showForm && (
          <div className="mt-2 max-h-[250px] overflow-y-auto rounded-lg border border-violet-100">
            <PaymentForm onSubmit={handleAddPayment} />
          </div>
        )}

        {showAllPayments && (
          <button
            className="text-violet-600 hover:text-violet-800 font-semibold mt-2 px-2 py-1 rounded-lg hover:bg-violet-50 transition text-xs sm:text-sm"
            onClick={() => setShowAllPayments(false)}
          >
            Ver menos
          </button>
        )}
      </div>
    </div>
  );
}
