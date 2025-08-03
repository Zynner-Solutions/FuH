"use client";

import { useState, useEffect, useRef } from "react";
function CustomDropdown({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const selectedOption = options.find((option) => option.value === value);
  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-1 rounded-md border border-[#d0b5fd] focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent outline-none transition-all duration-200 bg-[#f7f3ff] text-left flex items-center justify-between"
      >
        <span
          className={`${
            !selectedOption ? "text-gray-500" : "text-[#491d95] font-medium"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-[#7c3aed] transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-[#d0b5fd] rounded-lg shadow-lg overflow-hidden">
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-[#f3e8ff] flex items-center justify-between ${
                  value === option.value
                    ? "bg-[#f3e8ff] text-[#7c3aed]"
                    : "text-[#491d95]"
                }`}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <svg
                    className="w-4 h-4 text-[#7c3aed]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, parseISO, isValid, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { ApiClient } from "@/lib/api/ApiClient";
import { Expense } from "@/lib/types";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function ExpensesCalendar() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [selectedExpenses, setSelectedExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ApiClient.getExpenses();
        setExpenses(response.expenses);

        const uniqueCategories = Array.from(
          new Set(response.expenses.map((expense: Expense) => expense.category))
        ) as string[];
        setCategories(uniqueCategories);
      } catch (error) {
        setError((error as Error).message || "Error al cargar gastos");
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, []);

  useEffect(() => {
    if (selectedDate instanceof Date) {
      const filtered = expenses.filter((expense) => {
        const expenseDate = parseISO(expense.date);
        return (
          isValid(expenseDate) &&
          isSameDay(expenseDate, selectedDate) &&
          (selectedCategory === "todas" ||
            expense.category === selectedCategory)
        );
      });
      setSelectedExpenses(filtered);
    } else {
      setSelectedExpenses([]);
    }
  }, [selectedDate, expenses, selectedCategory]);

  const getTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const dateExpenses = expenses.filter((expense) => {
      const expenseDate = parseISO(expense.date);
      return isValid(expenseDate) && isSameDay(expenseDate, date);
    });

    if (dateExpenses.length === 0) return null;

    const total = dateExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    return (
      <div className="expense-indicator">
        <div className="text-xs mt-1 font-medium text-purple-700">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            notation: "compact",
          }).format(total)}
        </div>
      </div>
    );
  };

  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return "";

    const dateExpenses = expenses.filter((expense) => {
      const expenseDate = parseISO(expense.date);
      if (selectedCategory !== "todas") {
        return (
          isValid(expenseDate) &&
          isSameDay(expenseDate, date) &&
          expense.category === selectedCategory
        );
      }
      return isValid(expenseDate) && isSameDay(expenseDate, date);
    });

    if (dateExpenses.length === 0) return "";

    const total = dateExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    let intensity = "bg-purple-100";

    if (total > 10000) intensity = "bg-purple-300";
    if (total > 30000) intensity = "bg-purple-500 text-white";

    return `${intensity}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
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

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#d0b5fd]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h2 className="text-xl font-bold text-[#2f1065]">
          Calendario de gastos
        </h2>
        <div className="flex w-56">
          <CustomDropdown
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={[
              { value: "todas", label: "Todas las categorías" },
              ...categories.map((cat) => ({ value: cat, label: cat })),
            ]}
            placeholder="Filtrar por categoría"
          />
        </div>
      </div>

      <div className="calendar-container">
        <style jsx global>{`
          .react-calendar {
            width: 100%;
            border: none;
            font-family: inherit;
          }
          .react-calendar__tile {
            position: relative;
            height: 70px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 10px;
          }
          .react-calendar__tile--now {
            background-color: #f0e6ff;
          }
          .react-calendar__tile--active {
            background-color: #7c3aed !important;
            color: white;
          }
          .react-calendar__navigation button {
            color: #491d95;
            font-weight: bold;
          }
          .react-calendar__month-view__weekdays {
            color: #491d95;
          }
        `}</style>

        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={getTileContent}
          tileClassName={getTileClassName}
          locale="es"
        />
      </div>

      <div className="mt-6">
        <h3 className="font-medium text-[#2f1065] mb-2">
          {selectedDate instanceof Date
            ? `Gastos del ${format(selectedDate, "d 'de' MMMM, yyyy", {
                locale: es,
              })}`
            : "Selecciona una fecha"}
        </h3>

        {selectedExpenses.length > 0 ? (
          <div className="space-y-2">
            {selectedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="p-3 border border-[#d0b5fd] rounded-md bg-[#f7f3ff]"
              >
                <div className="flex justify-between">
                  <span className="font-medium">{expense.name}</span>
                  <span className="font-bold text-purple-700">
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    }).format(expense.amount)}
                  </span>
                </div>
                <div className="text-sm text-[#491d95] mt-1">
                  {expense.category}
                </div>
                {expense.notes && (
                  <div className="text-sm text-gray-600 mt-1">
                    {expense.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : selectedDate instanceof Date ? (
          <p className="text-gray-500">
            No hay gastos registrados para esta fecha.
          </p>
        ) : null}
      </div>
    </div>
  );
}
