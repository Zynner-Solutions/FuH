import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { ApiClient } from "@/lib/api/ApiClient";
import { useNotification } from "@/components/ui/notifications/useNotification";

const MemberSchema = Yup.object().shape({
  nombre: Yup.string().required("El nombre es obligatorio"),
  apellido: Yup.string().required("El apellido es obligatorio"),
});

export default function MembersForm({
  onSuccess,
  organizationSlug,
}: {
  onSuccess?: () => void;
  organizationSlug: string;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useNotification();

  const handleSubmit = async (values: { nombre: string; apellido: string }) => {
    try {
      setIsLoading(true);
      setServerError(null);
      await ApiClient.addMember(organizationSlug, values);
      success("Miembro añadido correctamente");
      if (onSuccess) onSuccess();
    } catch (err) {
      setServerError(
        (err as Error).message || "Error de conexión. Intente nuevamente."
      );
      error((err as Error).message || "Error de conexión. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#2f1065]">
        Añadir Miembro
      </h2>

      {serverError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {serverError}
        </div>
      )}

      <Formik
        initialValues={{ nombre: "", apellido: "" }}
        validationSchema={MemberSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-[#491d95] mb-1"
              >
                Nombre
              </label>
              <Field
                type="text"
                name="nombre"
                id="nombre"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.nombre && touched.nombre
                    ? "border-red-500"
                    : "border-[#d0b5fd]"
                } focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`}
                placeholder="Nombre del miembro"
              />
              <ErrorMessage
                name="nombre"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="apellido"
                className="block text-sm font-medium text-[#491d95] mb-1"
              >
                Apellido
              </label>
              <Field
                type="text"
                name="apellido"
                id="apellido"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.apellido && touched.apellido
                    ? "border-red-500"
                    : "border-[#d0b5fd]"
                } focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`}
                placeholder="Apellido del miembro"
              />
              <ErrorMessage
                name="apellido"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full py-2 px-4 bg-[#7c3aed] hover:bg-[#6928d9] text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7c3aed] disabled:opacity-50"
            >
              {isLoading ? "Agregando..." : "Añadir miembro"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
