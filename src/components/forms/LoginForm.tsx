import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiClient } from "@/lib/api/ApiClient";
import { useAuthStore } from "@/lib/store/AuthStore";

const LoginSchema = Yup.object().shape({
	email: Yup.string()
		.email("Formato de email inválido")
		.required("El email es obligatorio"),
	password: Yup.string()
		.min(6, "La contraseña debe tener al menos 6 caracteres")
		.required("La contraseña es obligatoria"),
});

export default function LoginForm() {
	const [serverError, setServerError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (values: { email: string; password: string }) => {
		try {
			setIsLoading(true);
			setServerError(null);

			const response = await ApiClient.login(values);

			useAuthStore.getState().setUser(response.user);
			useAuthStore
				.getState()
				.setSession(response.session.access_token, response.session.expires_at);

			router.push("/");
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
				Iniciar Sesión
			</h2>

			{serverError && (
				<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
					{serverError}
				</div>
			)}

			<Formik
				initialValues={{ email: "", password: "" }}
				validationSchema={LoginSchema}
				onSubmit={handleSubmit}
			>
				{({ isSubmitting, errors, touched }) => (
					<Form className="space-y-4">
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

						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									className="appearance-none h-5 w-5 border border-[#d0b5fd] rounded-md bg-white checked:bg-[#7c3aed] checked:border-transparent focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:ring-offset-2"
								/>
								<label
									htmlFor="remember-me"
									className="ml-2 block text-sm text-[#491d95]"
								>
									Recordarme
								</label>
							</div>

							<div className="text-sm">
								<a
									href="#"
									className="font-medium text-[#7c3aed] hover:text-[#6928d9]"
								>
									¿Olvidaste tu contraseña?
								</a>
							</div>
						</div>

						<button
							type="submit"
							disabled={isSubmitting || isLoading}
							className="w-full py-2 px-4 bg-[#7c3aed] hover:bg-[#6928d9] text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7c3aed] disabled:opacity-50"
						>
							{isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
						</button>

						<div className="text-center mt-4">
							<p className="text-sm text-[#491d95]">
								¿No tienes cuenta?{" "}
								<a
									href="/register"
									className="font-medium text-[#7c3aed] hover:text-[#6928d9]"
								>
									Regístrate
								</a>
							</p>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
}
