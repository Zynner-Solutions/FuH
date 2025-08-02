import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiClient } from "@/lib/api/ApiClient";

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("El nombre es obligatorio"),
  surname: Yup.string().required("El apellido es obligatorio"),
  alias: Yup.string()
    .min(3, "El alias debe tener al menos 3 caracteres")
    .max(30, "El alias no puede superar los 30 caracteres")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "El alias solo puede contener letras, números y guiones bajos"
    )
    .required("El alias es obligatorio"),
  email: Yup.string()
    .email("Formato de email inválido")
    .required("El email es obligatorio"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirma tu contraseña"),
});

export default function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: {
    name: string;
    surname: string;
    alias: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      setIsLoading(true);
      setServerError(null);

      const { confirmPassword, ...registerData } = values;

      await ApiClient.register(registerData);

      router.push("/login?registered=true");
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
        Crear una cuenta
      </h2>

      {serverError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {serverError}
        </div>
      )}

      <Formik
        initialValues={{
          name: "",
          surname: "",
          alias: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={RegisterSchema}
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
                  placeholder="Juan"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-600 text-xs mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="surname"
                  className="block text-sm font-medium text-[#491d95] mb-1"
                >
                  Apellido
                </label>
                <Field
                  type="text"
                  name="surname"
                  id="surname"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.surname && touched.surname
                      ? "border-red-500"
                      : "border-[#d0b5fd]"
                  } focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`}
                  placeholder="Pérez"
                />
                <ErrorMessage
                  name="surname"
                  component="div"
                  className="text-red-600 text-xs mt-1"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="alias"
                className="block text-sm font-medium text-[#491d95] mb-1"
              >
                Alias (nombre de usuario)
              </label>
              <Field
                type="text"
                name="alias"
                id="alias"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.alias && touched.alias
                    ? "border-red-500"
                    : "border-[#d0b5fd]"
                } focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`}
                placeholder="juanperez123"
              />
              <ErrorMessage
                name="alias"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#491d95] mb-1"
              >
                Email
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.email && touched.email
                    ? "border-red-500"
                    : "border-[#d0b5fd]"
                } focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`}
                placeholder="tu@email.com"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#491d95] mb-1"
              >
                Contraseña
              </label>
              <Field
                type="password"
                name="password"
                id="password"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.password && touched.password
                    ? "border-red-500"
                    : "border-[#d0b5fd]"
                } focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`}
                placeholder="••••••••"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[#491d95] mb-1"
              >
                Confirmar Contraseña
              </label>
              <Field
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.confirmPassword && touched.confirmPassword
                    ? "border-red-500"
                    : "border-[#d0b5fd]"
                } focus:outline-none focus:ring-2 focus:ring-[#7c3aed]`}
                placeholder="••••••••"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-[#7c3aed] focus:ring-[#7c3aed] border-[#d0b5fd] rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-[#491d95]"
              >
                Acepto los{" "}
                <a
                  href="#"
                  className="font-medium text-[#7c3aed] hover:text-[#6928d9]"
                >
                  términos y condiciones
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full py-2 px-4 bg-[#7c3aed] hover:bg-[#6928d9] text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7c3aed] disabled:opacity-50"
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-[#491d95]">
                ¿Ya tienes una cuenta?{" "}
                <a
                  href="/login"
                  className="font-medium text-[#7c3aed] hover:text-[#6928d9]"
                >
                  Inicia sesión
                </a>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
