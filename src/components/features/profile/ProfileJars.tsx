"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useNotification } from "@/components/ui/notifications/useNotification";
import { ApiClient } from "@/lib/api/ApiClient";
import type { Jar } from "@/lib/types";
import {
  PiggyBank,
  Target,
  TrendingUp,
  Calendar,
  Sparkles,
  Pencil,
  X,
} from "lucide-react";
import Modal from "@/components/ui/modal/Modal";

const ProfileJars = forwardRef<{ fetchJars: () => void }>((props, ref) => {
  const [jars, setJars] = useState<Jar[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editType, setEditType] = useState<"add" | "remove">("add");
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const jarsPerPage = 6;
  const totalPages = Math.ceil(jars.length / jarsPerPage);
  const paginatedJars = jars.slice(
    (page - 1) * jarsPerPage,
    page * jarsPerPage
  );
  const { confirm, success, error: notifyError } = useNotification();

  const fetchJars = async () => {
    const data = await ApiClient.getProfile();
    if (data && data.user && Array.isArray(data.user.jars)) {
      setJars(data.user.jars);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJars();
  }, []);

  useImperativeHandle(ref, () => ({
    fetchJars,
  }));
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
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paginatedJars.map((jar) => {
          const progress = Math.min(100, (jar.saved / jar.target) * 100);
          const isCompleted = jar.isCompleted || progress >= 100;
          const isEditing = editId === jar.id;
          return (
            <div
              key={jar.id}
              className="group relative rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full flex flex-col"
              style={{
                background: "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)",
                minHeight: "380px",
              }}
            >
              <button
                className={`absolute -top-2 -left-2 w-8 h-8 flex items-center justify-center rounded-full z-10 transition-all duration-200 border-2 border-violet-200 shadow-md ${
                  isCompleted
                    ? "opacity-40 cursor-not-allowed pointer-events-none bg-violet-100 border-violet-100"
                    : "bg-gradient-to-br from-violet-100 to-purple-200 hover:from-violet-500 hover:to-purple-600 text-violet-700 hover:text-white"
                }`}
                disabled={isCompleted}
                onClick={() => {
                  if (isCompleted) return;
                  confirm(
                    `¿Seguro que quieres eliminar el frasco "${jar.name}"?`,
                    async () => {
                      try {
                        await ApiClient.updateProfile({ deleteJar: jar.id });
                        await fetchJars();
                        success("Frasco eliminado correctamente");
                      } catch (e) {
                        notifyError("Error al eliminar el frasco");
                      }
                    }
                  );
                }}
                type="button"
                aria-label="Eliminar frasco"
              >
                <X
                  className={`w-4 h-4 transition-colors duration-200 ${
                    isCompleted ? "text-violet-300" : "group-hover:text-white"
                  }`}
                />
              </button>
              {isCompleted && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-lg font-bold text-gray-900 truncate flex items-center ${
                      isCompleted
                        ? ""
                        : "group-hover:text-violet-700 transition-colors"
                    }`}
                  >
                    {jar.name}
                    <button
                      className={`ml-2 p-1 rounded ${
                        isCompleted
                          ? "opacity-50 cursor-not-allowed pointer-events-none"
                          : "hover:bg-violet-100 text-violet-600"
                      }`}
                      onClick={
                        isCompleted
                          ? undefined
                          : () => {
                              setEditId(jar.id);
                              setEditValue("");
                              setEditType("add");
                              setError("");
                            }
                      }
                      type="button"
                      disabled={isCompleted}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
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
              {isEditing && (
                <Modal open={isEditing} onClose={() => setEditId(null)}>
                  <div className="flex flex-col gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-violet-200 to-purple-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Pencil className="w-8 h-8 text-violet-700" />
                      </div>
                      <h4 className="text-2xl font-bold text-violet-700 mb-2">
                        Editar Frasco
                      </h4>
                      <p className="text-violet-500 text-sm">{jar.name}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        className={`flex-1 px-4 py-3 rounded-xl font-semibold border-2 transition-all duration-200 ${
                          editType === "add"
                            ? "bg-gradient-to-r from-violet-100 to-purple-100 border-violet-300 text-violet-700 shadow-md"
                            : "bg-white/50 border-gray-200 text-gray-600 hover:border-violet-200"
                        }`}
                        onClick={() => setEditType("add")}
                        type="button"
                      >
                        💰 Agregar
                      </button>
                      <button
                        className={`flex-1 px-4 py-3 rounded-xl font-semibold border-2 transition-all duration-200 ${
                          editType === "remove"
                            ? "bg-gradient-to-r from-violet-100 to-purple-100 border-violet-300 text-violet-700 shadow-md"
                            : "bg-white/50 border-gray-200 text-gray-600 hover:border-violet-200"
                        }`}
                        onClick={() => setEditType("remove")}
                        type="button"
                      >
                        💸 Quitar
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full px-4 py-4 rounded-xl border-2 border-violet-200 focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:outline-none text-gray-900 bg-white/70 backdrop-blur-sm text-center text-lg font-semibold placeholder:text-gray-400"
                        placeholder={
                          editType === "add"
                            ? "Monto a agregar"
                            : "Monto a quitar"
                        }
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-500 font-bold text-lg">
                        $
                      </div>
                    </div>
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm text-center font-medium">
                        {error}
                      </div>
                    )}
                    <div className="flex gap-3 pt-2">
                      <button
                        className="flex-1 px-6 py-3 rounded-xl bg-white/70 border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
                        onClick={() => setEditId(null)}
                        type="button"
                      >
                        Cancelar
                      </button>
                      <button
                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                        onClick={async () => {
                          setError("");
                          const value = Number(editValue);
                          if (isNaN(value) || value <= 0) {
                            setError("Ingresa un monto válido");
                            return;
                          }
                          if (editType === "remove" && value > jar.saved) {
                            setError("No puedes quitar más de lo ahorrado");
                            return;
                          }
                          let newSaved = jar.saved;
                          if (editType === "add") newSaved += value;
                          else newSaved -= value;
                          const updatedJar = { ...jar, saved: newSaved };
                          try {
                            await ApiClient.updateJar(updatedJar);
                            setEditId(null);
                            await fetchJars();
                          } catch (error) {
                            setError("Error al actualizar el frasco");
                          }
                        }}
                        type="button"
                      >
                        ✨ Guardar
                      </button>
                    </div>
                  </div>
                </Modal>
              )}
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <button
            className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-2 rounded-lg font-semibold border ${
                page === i + 1
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-violet-50"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-semibold disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
});

ProfileJars.displayName = "ProfileJars";

export default ProfileJars;
