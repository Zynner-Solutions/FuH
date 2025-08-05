import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface PaymentFormProps {
  onSubmit: (values: { amount: number; date: string; notes: string }) => void;
}

const validationSchema = Yup.object({
  amount: Yup.number().min(0.01, "Monto mínimo 0.01").required("Requerido"),
  date: Yup.string().required("Requerido"),
  notes: Yup.string().required("Requerido"),
});

export default function PaymentForm({ onSubmit }: PaymentFormProps) {
  return (
    <Formik
      initialValues={{ amount: "", date: "", notes: "" }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit({
          amount: parseFloat(values.amount as any),
          date: values.date,
          notes: values.notes,
        });
        resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-4">
          <div>
            <Field
              type="number"
              name="amount"
              placeholder="Monto"
              className="border-2 border-violet-200 rounded-lg px-4 py-2 w-full"
              min="0.01"
              step="0.01"
            />
            <ErrorMessage
              name="amount"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div>
            <Field
              type="date"
              name="date"
              className="border-2 border-violet-200 rounded-lg px-4 py-2 w-full"
            />
            <ErrorMessage
              name="date"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <div>
            <Field
              as="textarea"
              name="notes"
              placeholder="Notas"
              className="border-2 border-violet-200 rounded-lg px-4 py-2 w-full"
              rows={2}
            />
            <ErrorMessage
              name="notes"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg px-6 py-2 font-bold hover:from-violet-700 hover:to-purple-700 transition"
            disabled={isSubmitting}
          >
            Registrar pago
          </button>
        </Form>
      )}
    </Formik>
  );
}
