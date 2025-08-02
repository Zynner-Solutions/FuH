"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ApiClient } from "@/lib/api/ApiClient";

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

export default function ExpensesForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
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

      setSuccess(true);
      resetForm();

      setTimeout(() => {
        setSuccess(false);
      }, 3000);

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error al crear gasto:", error);

      if (error.message && error.message.includes("row-level security")) {
        setError(
          "Error de permisos: No tienes autorización para crear gastos. Por favor, vuelve a iniciar sesión."
        );
      } else if (error.message && error.message.includes("No autorizado")) {
        setError("Sesión expirada. Por favor, vuelve a iniciar sesión.");
      } else {
        setError(error.message || "Error al crear el gasto");
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

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md">
          ¡Gasto registrado con éxito!
        </div>
      )}

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
              <Field
                as="select"
                name="category"
                id="category"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.category && touched.category
                    ? "border-red-500"
                    : "border-[#d0b5fd]"
                } focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`}
              >
                <option value="">Selecciona una categoría</option>
                <option value="comida">Comida</option>
                <option value="transporte">Transporte</option>
                <option value="entretenimiento">Entretenimiento</option>
                <option value="suscripciones">Suscripciones</option>
                <option value="salud">Salud</option>
                <option value="vivienda">Vivienda</option>
                <option value="otros">Otros</option>
              </Field>
              <ErrorMessage
                name="category"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
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
