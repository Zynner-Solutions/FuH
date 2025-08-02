"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Shield,
  Smartphone,
  HelpCircle,
} from "lucide-react";

export default function FAQContent() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const faqSections = [
    {
      title: "Sobre la aplicación",
      icon: <Smartphone className="w-6 h-6" />,
      questions: [
        {
          question: "¿Qué es esta aplicación?",
          answer:
            "Es una herramienta inteligente que te ayuda a gestionar tus finanzas personales. Analiza los datos que ingresas, te da recomendaciones para ahorrar y te ayuda a planificar tus metas financieras.",
        },
        {
          question: "¿Cómo me ayuda a ahorrar dinero?",
          answer:
            "La aplicación analiza tus hábitos de gasto, basándose en la información que le proporcionas, y te da sugerencias personalizadas sobre dónde puedes recortar. Por ejemplo, te puede notificar si gastaste más de lo habitual en una categoría o sugerirte un plan de ahorro basado en tu salario.",
        },
      ],
    },
    {
      title: "Seguridad y privacidad",
      icon: <Shield className="w-6 h-6" />,
      questions: [
        {
          question: "¿Mis datos están seguros?",
          answer:
            "Sí, la seguridad es nuestra prioridad. Usamos plataformas con estándares de seguridad robustos, como Supabase o Firebase, para manejar tus datos. Toda la información que ingresas está encriptada y protegida.",
        },
        {
          question: "¿Qué información personal guardan?",
          answer:
            "Solo la información que necesitas para que la app funcione. Con la autenticación de Google, solo almacenamos tu email y el nombre que uses. No compartimos tus datos con terceros.",
        },
        {
          question: "¿Tienen acceso a mis cuentas bancarias?",
          answer:
            "No. La aplicación no tiene acceso a ninguna de tus cuentas bancarias. Funciona basándose exclusivamente en los gastos e ingresos que tú mismo registras manualmente. Esto te da el control total sobre la información que quieres gestionar.",
        },
      ],
    },
    {
      title: "Funcionalidades",
      icon: <HelpCircle className="w-6 h-6" />,
      questions: [
        {
          question: "¿Cómo categorizan mis gastos?",
          answer:
            'Tú eres quien asigna una categoría (por ejemplo, "Comida", "Transporte", "Ocio") cada vez que registras un gasto. Con el tiempo, la aplicación puede aprender de tus hábitos para sugerirte la categoría más probable en futuros registros.',
        },
        {
          question: "¿Qué tipo de notificaciones push envían?",
          answer:
            'Enviamos notificaciones útiles, como alertas de gastos elevados ("¡Gasto elevado en delivery esta semana!"), recordatorios para registrar un gasto o notificaciones cuando te acercas a cumplir una meta de ahorro.',
        },
        {
          question: "¿Puedo simular diferentes metas de ahorro?",
          answer:
            'Sí. Puedes crear metas de ahorro (por ejemplo, "Ahorrar para vacaciones" o "Fondo de emergencia") y la aplicación te mostrará cuánto necesitas ahorrar cada semana o mes para alcanzar ese objetivo. Incluso te dará consejos para lograrlo.',
        },
        {
          question: "¿Cómo funciona el asistente?",
          answer:
            "El asistente de la aplicación actúa como tu asesor financiero personal. Te ayuda a organizar tus finanzas, te da análisis detallados de tus gastos y te ofrece sugerencias para mejorar tus hábitos financieros.",
        },
      ],
    },
  ];

  let questionIndex = 0;

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      {faqSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-12">
          <div className="flex items-center mb-8">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mr-4">
              <div className="text-purple-600">{section.icon}</div>
            </div>
            <h2 className="text-2xl font-bold text-purple-900">
              {section.title}
            </h2>
          </div>

          <div className="space-y-4">
            {section.questions.map((item, itemIndex) => {
              const currentIndex = questionIndex++;
              const isOpen = openItems.includes(currentIndex);

              return (
                <div
                  key={itemIndex}
                  className="bg-white border border-purple-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <button
                    onClick={() => toggleItem(currentIndex)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-purple-50 rounded-lg transition-colors duration-200"
                  >
                    <span className="font-semibold text-purple-800 pr-4">
                      {item.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-4">
                      <div className="border-t border-purple-100 pt-4">
                        <p className="text-purple-700 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="mt-16 text-center">
        <div className="bg-purple-50 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-purple-900 mb-4">
            ¿No encontraste lo que buscabas?
          </h3>
          <p className="text-purple-700 mb-6">
            Estamos aquí para ayudarte. Contáctanos y resolveremos todas tus
            dudas.
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            Contactar Soporte
          </button>
        </div>
      </div>
    </div>
  );
}
