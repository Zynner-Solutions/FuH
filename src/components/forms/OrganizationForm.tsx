import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { ApiClient } from "@/lib/api/ApiClient";

const OrganizationSchema = Yup.object().shape({
  name: Yup.string().required("El nombre es obligatorio"),
  description: Yup.string().required("La descripción es obligatoria"),
});

export default function OrganizationForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: {
    name: string;
    description: string;
  }) => {
    try {
      setIsLoading(true);
      setServerError(null);
      await ApiClient.createOrganization(values);
      if (onSuccess) onSuccess();
    } catch (error) {
      setServerError(
        (error as Error).message || "Error de conexión. Intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#2f1065]">
        Crear Organización
      </h2>

      {serverError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {serverError}
        </div>
      )}

      <Formik
        initialValues={{ name: "", description: "" }}
        validationSchema={OrganizationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#491d95] mb-1"
              >
                Nombre
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
                placeholder="Nombre de la organización"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-[#491d95] mb-1"
              >
                Descripción
              </label>
              <Field
                type="text"
                name="description"
                id="description"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.description && touched.description
                    ? "border-red-500"
                    : "border-[#d0b5fd]"
                } focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`}
                placeholder="Descripción de la organización"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full py-2 px-4 bg-[#7c3aed] hover:bg-[#6928d9] text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7c3aed] disabled:opacity-50"
            >
              {isLoading ? "Creando..." : "Crear organización"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
