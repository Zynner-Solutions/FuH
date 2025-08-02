"use client";

import { UserProfile } from "@/lib/types";

export default function ProfileInfo({ user }: { user: UserProfile }) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Información personal
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <p className="text-sm font-medium text-gray-500">Nombre completo</p>
            <p className="mt-1 text-gray-800">
              {user.name} {user.surname}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Alias</p>
            <p className="mt-1 text-gray-800">@{user.alias}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">
              Correo electrónico
            </p>
            <p className="mt-1 text-gray-800">{user.email}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">ID de usuario</p>
            <p className="mt-1 text-gray-800 font-mono text-xs truncate">
              {user.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
