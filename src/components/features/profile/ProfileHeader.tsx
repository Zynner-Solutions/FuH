"use client";

import { UserProfile } from "@/lib/types";

export default function ProfileHeader({ user }: { user: UserProfile }) {
  const userInitial = user.name.charAt(0).toUpperCase();

  return (
    <div className="w-full py-8 mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 rounded-full flex items-center justify-center bg-purple-600 text-white text-4xl font-bold">
          {userInitial}
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            {user.name} {user.surname}
          </h1>
          <p className="text-gray-600 text-lg mt-1">@{user.alias}</p>
          <p className="text-gray-500 mt-2">{user.email}</p>
        </div>
      </div>
    </div>
  );
}
