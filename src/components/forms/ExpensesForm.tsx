"use client";

import { useState, useRef, useEffect } from "react";
import { useNotification } from "@/components/ui/notifications/useNotification";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";import * as Yup from "yup";
import { ApiClient } from "@/lib/api/ApiClient";
import { ApiCache } from "@/lib/cache/ApiCache";
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
        className="w-full px-4 py-2 rounded-lg border border-[#d0b5fd] focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent outline-none transition-all duration-200 bg-white text-left flex items-center justify-between"
      >
        <span
          className={`${
            !selectedOption ? "text-gray-500" : "text-[#2f1065] font-medium"
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
                    : "text-[#2f1065]"
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

const ExpenseSchema = Yup.object().shape({
  name: Yup.string().required("El nombre del gasto es obligatorio"),
  amount: Yup.number()
    .required("El monto es obligatorio")
    .positive("El monto debe ser positivo"),
  category: Yup.string().required("La categoría es obligatoria"),
  date: Yup.date().default(() => new Date()),
  notes: Yup.string(),
  is_recurring: Yup.boolean().default(false),
});

type ExpensesFormProps = {
  onSuccess?: () => void;
};

export default function ExpensesForm({ onSuccess }: ExpensesFormProps) {
  const { success: notifySuccess, error: notifyError } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (
    values: any,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      await ApiClient.createExpense({
        name: values.name,
        amount: parseFloat(values.amount),
        category: values.category,
        date: values.date,
        notes: values.notes,
        is_recurring: values.is_recurring,
      });

      notifySuccess("¡Gasto registrado con éxito!");
      resetForm();

      await ApiCache.refreshExpenses();

      if (onSuccess) onSuccess();
    } catch (error: any) {
      if (error.message && error.message.includes("row-level security")) {
        notifyError(
          "Error de permisos: No tienes autorización para crear gastos. Por favor, vuelve a iniciar sesión."
        );
      } else if (error.message && error.message.includes("No autorizado")) {
        notifyError("Sesión expirada. Por favor, vuelve a iniciar sesión.");
      } else {
        notifyError(error.message || "Error al crear el gasto");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-[#d0b5fd]">
      <h2 className="text-2xl font-bold text-[#2f1065] mb-4">
        Registrar nuevo gasto
      </h2>

      <Formik
        initialValues={{
          name: "",
          amount: "",
          category: "",
          date: new Date().toISOString().split("T")[0],
          notes: "",
          is_recurring: false,
        }}
        validationSchema={ExpenseSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-[#491d95] mb-1"
                >
                  💬 Nombre del gasto
                </label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.name && touched.name
                      ? "border-red-500"
                      : "border-[#d0b5fd]"
                  } focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`}
                  placeholder="Ej: Verdulería, Spotify, Gas"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-600 text-xs mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-[#491d95] mb-1"
                >
                  💰 Monto
                </label>
                <Field
                  type="number"
                  name="amount"
                  id="amount"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.amount && touched.amount
                      ? "border-red-500"
                      : "border-[#d0b5fd]"
                  } focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`}
                  placeholder="0.00"
                  step="0.01"
                />
                <ErrorMessage
                  name="amount"
                  component="div"
                  className="text-red-600 text-xs mt-1"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-[#491d95] mb-1"
              >
                🗂️ Categoría
              </label>
              <Field name="category">
                {({ field, form }: any) => (
                  <>
                    <CustomDropdown
                      value={field.value}
                      onChange={(val) => form.setFieldValue("category", val)}
                      options={[
                        { value: "", label: "Selecciona una categoría" },
                        { value: "comida", label: "Comida" },
                        { value: "transporte", label: "Transporte" },
                        { value: "entretenimiento", label: "Entretenimiento" },
                        { value: "suscripciones", label: "Suscripciones" },
                        { value: "salud", label: "Salud" },
                        { value: "vivienda", label: "Vivienda" },
                        { value: "otros", label: "Otros" },
                      ]}
                      placeholder="Selecciona una categoría"
                    />
                    {errors.category && touched.category && (
                      <div className="text-red-600 text-xs mt-1">
                        {errors.category}
                      </div>
                    )}
                  </>
                )}
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-[#491d95] mb-1"
                >
                  🗓️ Fecha
                </label>
                <Field
                  type="date"
                  name="date"
                  id="date"
                  className="w-full px-4 py-2 rounded-lg border border-[#d0b5fd] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>

              <div className="flex items-center h-full pt-6">
                <label className="flex items-center cursor-pointer">
                  <Field
                    type="checkbox"
                    name="is_recurring"
                    className="h-5 w-5 text-[#7c3aed] border-[#d0b5fd] rounded focus:ring-[#7c3aed]"
                  />
                  <span className="ml-2 text-sm text-[#491d95]">
                    🔁 Es un gasto recurrente
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-[#491d95] mb-1"
              >
                📝 Notas (opcional)
              </label>
              <Field
                as="textarea"
                name="notes"
                id="notes"
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-[#d0b5fd] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                placeholder="Detalles adicionales sobre este gasto..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full py-3 px-4 bg-[#7c3aed] hover:bg-[#6928d9] text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7c3aed] disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full mr-2"></span>
                  Guardando...
                </span>
              ) : (
                "Registrar gasto"
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
