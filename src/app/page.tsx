import LandingHero from "@/components/features/landing/Hero";
import Sponsor from "@/components/features/landing/Sponsor";

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <div className="pt-60 md:pt-72 lg:pt-100"></div>
      <section className="flex items-center justify-center pb-50">
        <LandingHero />
      </section>
      <section className="w-full mt-2 md:mt-4">
        <Sponsor />
      </section>
    </main>
  );
}
