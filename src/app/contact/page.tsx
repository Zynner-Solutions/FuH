import ContactHero from "@/components/features/contact/ContactHero";
import ContactForm from "@/components/forms/ContactForm";

export default function ContactPage() {
  return (
    <main className="pt-20">
      <ContactHero />
      <section className="py-12 px-4 pb-40">
        <ContactForm />
      </section>
    </main>
  );
}
