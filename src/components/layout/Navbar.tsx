"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  Home,
  HelpCircle,
  Mail,
  UserPlus,
  LogIn,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/AuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-purple-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Zynee</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/home"
                className="flex items-center space-x-2 text-purple-700 hover:text-purple-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                <Home className="w-4 h-4" />
                <span>Inicio</span>
              </Link>
              <Link
                href={mounted && isAuthenticated ? "/profile" : "/login"}
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                <User className="w-4 h-4" />
                <span>Perfil</span>
              </Link>
              <Link
                href="/faq"
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                <HelpCircle className="w-4 h-4" />
                <span>FAQ</span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                <span>Contacto</span>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {mounted ? (
              isAuthenticated ? (
                <>
                  <div className="mr-4 text-purple-700">
                    <span className="font-medium">Bienvenido, </span>
                    <span className="font-bold">{user?.alias}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Iniciar Sesión</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Registro</span>
                  </Link>
                </>
              )
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Iniciar Sesión</span>
                </Link>
                <Link
                  href="/register"
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Registro</span>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-purple-600 hover:text-purple-800 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-colors duration-200"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-purple-50 border-t border-purple-200">
            {mounted && isAuthenticated && (
              <div className="px-3 py-2 font-medium text-purple-700">
                <span>Bienvenido, </span>
                <span className="font-bold">{user?.alias}</span>
              </div>
            )}
            <Link
              href="/"
              className="flex items-center space-x-3 text-purple-700 hover:text-purple-800 hover:bg-purple-100 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            >
              <Home className="w-5 h-5" />
              <span>Inicio</span>
            </Link>
            <Link
              href={mounted && isAuthenticated ? "/profile" : "/login"}
              className="flex items-center space-x-3 text-purple-600 hover:text-purple-800 hover:bg-purple-100 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            >
              <User className="w-5 h-5" />
              <span>Perfil</span>
            </Link>
            <Link
              href="/faq"
              className="flex items-center space-x-3 text-purple-600 hover:text-purple-800 hover:bg-purple-100 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            >
              <HelpCircle className="w-5 h-5" />
              <span>FAQ</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center space-x-3 text-purple-600 hover:text-purple-800 hover:bg-purple-100 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            >
              <Mail className="w-5 h-5" />
              <span>Contacto</span>
            </Link>
            <div className="border-t border-purple-200 pt-4 pb-3">
              {mounted ? (
                isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center space-x-3 text-purple-600 hover:text-purple-800 hover:bg-purple-100 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center space-x-3 text-purple-600 hover:text-purple-800 hover:bg-purple-100 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Iniciar Sesión</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center space-x-3 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-base font-medium mt-2 transition-colors duration-200"
                    >
                      <UserPlus className="w-5 h-5" />
                      <span>Registro</span>
                    </Link>
                  </>
                )
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center space-x-3 text-purple-600 hover:text-purple-800 hover:bg-purple-100 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Iniciar Sesión</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center space-x-3 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-base font-medium mt-2 transition-colors duration-200"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Registro</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
