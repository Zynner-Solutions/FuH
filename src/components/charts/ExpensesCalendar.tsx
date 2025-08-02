"use client";

import { useState, useEffect } from "react";
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
          new Set(
            response.expenses.map((expense: Expense) => expense.category)
          )
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

    const total = dateExpenses.reduce((sum, expense) => sum + expense.amount, 0);

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

    const total = dateExpenses.reduce((sum, expense) => sum + expense.amount, 0);
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
        <div className="flex">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 bg-[#f7f3ff] text-[#491d95] rounded-md border border-[#d0b5fd]"
          >
            <option value="todas">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
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
