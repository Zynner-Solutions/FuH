"use client";

import { useEffect, useState } from "react";
import { ApiClient } from "@/lib/api/ApiClient";
import type { Jar } from "@/lib/types";
import {
  PiggyBank,
  Target,
  TrendingUp,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function ProfileJars() {
  const [jars, setJars] = useState<Jar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJars = async () => {
      const data = await ApiClient.getProfile();
      if (data && data.user && Array.isArray(data.user.jars)) {
        setJars(data.user.jars);
      }
      setLoading(false);
    };
    fetchJars();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-violet-200 rounded-full animate-spin border-t-violet-600"></div>
          <PiggyBank className="w-5 h-5 text-violet-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    );
  }

  if (!jars.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
          <PiggyBank className="w-8 h-8 text-violet-600" />
        </div>
        <p className="text-gray-600">No tienes frascos creados aún.</p>
      </div>
    );
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "from-emerald-500 to-green-600";
    if (percentage >= 75) return "from-blue-500 to-indigo-600";
    if (percentage >= 50) return "from-violet-500 to-purple-600";
    if (percentage >= 25) return "from-amber-500 to-orange-600";
    return "from-rose-500 to-pink-600";
  };

  return (
    <div className="w-full px-0 py-8">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6"
        style={{ width: "100vw", maxWidth: "100vw" }}
      >
        {jars.map((jar) => {
          const progress = Math.min(100, (jar.saved / jar.target) * 100);
          const isCompleted = jar.isCompleted || progress >= 100;

          return (
            <div
              key={jar.id}
              className="group relative rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-w-0 flex flex-col"
              style={{
                minWidth: 0,
                width: "100%",
                background: "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)",
              }}
            >
              {isCompleted && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-violet-700 transition-colors">
                    {jar.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${
                      isCompleted
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-violet-100 text-violet-800"
                    }`}
                  >
                    {isCompleted ? "Completado" : "En progreso"}
                  </span>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center ml-3">
                  <PiggyBank className="w-6 h-6 text-violet-600" />
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-6 line-clamp-2 min-h-[40px]">
                {jar.description}
              </p>

              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <Target className="w-4 h-4 mr-2" />
                    <span className="text-xs font-medium">Meta</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    ${jar.target.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span className="text-xs font-medium">Ahorrado</span>
                  </div>
                  <span className="text-sm font-bold text-violet-700">
                    ${jar.saved.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                      Progreso
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getProgressColor(
                        progress
                      )} transition-all duration-500 ease-out`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span className="text-xs">
                      Creado{" "}
                      {new Date(jar.createdAt).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
