"use client";

import { useState, useEffect, useRef } from "react";
import { ProfileUpdateData } from "@/lib/types";
import { Pencil, X, Check } from "lucide-react";
import { ApiClient } from "@/lib/api/ApiClient";

import { UserProfile } from "@/lib/types";
type Props = { user: UserProfile };
export default function ProfileInfo({ user }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alias, setAlias] = useState(user.alias);
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAlias(user.alias);
    setAvatarUrl(user.avatar_url || "");
  }, [user]);

  useEffect(() => {
    const handleToggleEditMode = (event: any) => {
      setEditMode(event.detail.editMode);
    };
    window.addEventListener("toggleEditMode", handleToggleEditMode);
    return () => {
      window.removeEventListener("toggleEditMode", handleToggleEditMode);
    };
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      window.dispatchEvent(new CustomEvent("profileSave"));
      const updateData: ProfileUpdateData = {};
      if (user && alias !== user.alias) {
        updateData.alias = alias;
      }
      if (password) {
        updateData.password = password;
      }
      if (Object.keys(updateData).length > 0) {
        const response = await ApiClient.updateProfile(updateData);
      }
      setEditMode(false);
      setPassword("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al actualizar el perfil"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.dispatchEvent(new CustomEvent("profileCancel"));
    if (user) setAlias(user.alias);
    setPassword("");
    setEditMode(false);
  };

  if (!user) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 shadow-sm mb-8 text-center text-gray-500">
        Cargando información del usuario...
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-xl font-semibold text-gray-800">
          Información personal
        </h2>
        {editMode && (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <X size={16} className="mr-1" /> Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center p-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-1"></div>
              ) : (
                <Check size={16} className="mr-1" />
              )}
              Guardar
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-y-3 md:grid-cols-2 md:gap-x-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Nombre completo</p>
            <p className="mt-1 text-gray-800">
              {user.name} {user.surname}
            </p>
          </div>

          <div>
            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-500">Alias</p>
              {editMode && (
                <Pencil size={14} className="ml-2 text-purple-500" />
              )}
            </div>
            {editMode ? (
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                className="mt-1 w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            ) : (
              <p className="mt-1 text-gray-800">@{user.alias}</p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">
              Correo electrónico
            </p>
            <p className="mt-1 text-gray-800">{user.email}</p>
          </div>

          {editMode && (
            <div>
              <div className="flex items-center">
                <p className="text-sm font-medium text-gray-500">Contraseña</p>
                <Pencil size={14} className="ml-2 text-purple-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nueva contraseña"
                className="mt-1 w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          )}

          {!editMode && (
            <div>
              <p className="text-sm font-medium text-gray-500">ID de usuario</p>
              <p className="mt-1 text-gray-800 font-mono text-xs truncate">
                {user.id}
              </p>
            </div>
          )}

          {!editMode && (
            <div>
              <p className="text-sm font-medium text-gray-500">
                Fecha de Creación
              </p>
              <p className="mt-1 text-gray-800 font-mono text-xs truncate">
                {user.created_at
                  ? (() => {
                      const date = new Date(user.created_at);
                      if (isNaN(date.getTime())) {
                        return "Fecha inválida";
                      }
                      return date.toLocaleString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                        timeZone: "UTC",
                      });
                    })()
                  : "No disponible"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
