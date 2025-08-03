import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Background from "@/components/layout/background";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthGuard from "@/components/features/auth/AuthGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zynee",
  description:
    "Plataforma para gestionar tus hábitos, gastos y metas diarias de forma sencilla, visual y segura. Organiza tu vida, analiza tus tendencias y mejora cada día.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Background>
          <Navbar />
          <AuthGuard>{children}</AuthGuard>
          <Footer />
        </Background>
      </body>
    </html>
  );
}
