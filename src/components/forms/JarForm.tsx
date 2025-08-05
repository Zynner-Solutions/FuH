"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import type { Jar } from "@/lib/types";
import { useState } from "react";
import { useNotification } from "@/components/ui/notifications/useNotification";
import {
  PiggyBank,
  Target,
  DollarSign,
  FileText,
  Sparkles,
  Loader2,
} from "lucide-react";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Nombre requerido")
    .max(50, "Máximo 50 caracteres"),
  description: yup
    .string()
    .required("Descripción requerida")
    .max(200, "Máximo 200 caracteres"),
  target: yup
    .number()
    .typeError("Meta debe ser un número")
    .required("Meta requerida")
    .min(1, "Meta debe ser mayor a 0")
    .max(1000000000, "Meta muy alta"),
  saved: yup
    .number()
    .typeError("Ahorro debe ser un número")
    .required("Ahorro requerido")
    .min(0, "Ahorro no puede ser negativo")
    .test(
      "saved-less-than-target",
      "El ahorro no puede ser mayor a la meta",
      function (value) {
        const { target } = this.parent;
        return !target || !value || value <= target;
      }
    ),
});

export default function JarForm({ onSuccess }: { onSuccess?: () => void }) {
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 md:px-6">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-violet-100 to-purple-100 px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            <div className="w-12 h-12 bg-white/40 rounded-xl flex items-center justify-center mb-3 sm:mb-0 sm:mr-4">
              <PiggyBank className="w-6 h-6 text-violet-400" />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-violet-700">
                Crear Nuevo Frasco
              </h2>
              <p className="text-violet-400">Define tu meta de ahorro</p>
            </div>
          </div>
        </div>

        <Formik
          initialValues={{ name: "", description: "", target: "", saved: "" }}
          validationSchema={schema}
          onSubmit={async (values, { resetForm }) => {
            setLoading(true);
            try {
              const newJar: Jar = {
                id: crypto.randomUUID(),
                name: values.name,
                description: values.description,
                target: Number(values.target),
                saved: Number(values.saved),
                isCompleted: false,
                createdAt: new Date().toISOString(),
                updatedAt: undefined,
              };
              const res = await fetch("/api/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ addJar: newJar }),
                credentials: "include",
              });
              if (!res.ok) throw new Error();
              success("¡Frasco creado exitosamente!");
              resetForm();
              if (onSuccess) onSuccess();
            } catch {
              error("Error al crear el frasco");
            } finally {
              setLoading(false);
            }
          }}
        >
          {({ values, errors, touched }) => (
            <Form className="p-4 sm:p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <FileText className="w-4 h-4 mr-2 text-violet-600" />
                    Nombre del frasco
                  </label>
                  <Field name="name">
                    {({ field }: any) => (
                      <input
                        {...field}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-gray-50 focus:bg-white focus:outline-none ${
                          errors.name && touched.name
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-violet-500"
                        }`}
                        placeholder="Ej: Vacaciones en Europa"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-2 flex items-center"
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <Sparkles className="w-4 h-4 mr-2 text-violet-600" />
                    Descripción
                  </label>
                  <Field name="description">
                    {({ field }: any) => (
                      <textarea
                        {...field}
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-gray-50 focus:bg-white focus:outline-none resize-none ${
                          errors.description && touched.description
                            ? "border-red-300 focus:border-red-500"
                            : "border-gray-200 focus:border-violet-500"
                        }`}
                        placeholder="Describe tu meta de ahorro..."
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                <div className="col-span-1">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <Target className="w-4 h-4 mr-2 text-violet-600" />
                    Meta de ahorro
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Field name="target">
                      {({ field }: any) => (
                        <input
                          {...field}
                          type="number"
                          min="1"
                          step="0.01"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 bg-gray-50 focus:bg-white focus:outline-none ${
                            errors.target && touched.target
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-violet-500"
                          }`}
                          placeholder="0.00"
                        />
                      )}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="target"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                <div className="col-span-1">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <PiggyBank className="w-4 h-4 mr-2 text-violet-600" />
                    Ahorro inicial
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Field name="saved">
                      {({ field }: any) => (
                        <input
                          {...field}
                          type="number"
                          min="0"
                          step="0.01"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-200 bg-gray-50 focus:bg-white focus:outline-none ${
                            errors.saved && touched.saved
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-violet-500"
                          }`}
                          placeholder="0.00"
                        />
                      )}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="saved"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>
              </div>

              {values.target &&
                values.saved &&
                Number(values.target) > 0 &&
                Number(values.saved) >= 0 && (
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-3 sm:p-4 border border-violet-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Progreso inicial
                      </span>
                      <span className="text-sm font-bold text-violet-600">
                        {(
                          (Number(values.saved) / Number(values.target)) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-200 to-purple-300 transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            100,
                            (Number(values.saved) / Number(values.target)) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 sm:py-4 sm:px-6 bg-gradient-to-r from-violet-200 to-purple-300 text-violet-800 font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin text-violet-500" />
                    Creando frasco...
                  </>
                ) : (
                  <>
                    <PiggyBank className="w-5 h-5 mr-2 text-violet-500" />
                    Crear frasco
                  </>
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
