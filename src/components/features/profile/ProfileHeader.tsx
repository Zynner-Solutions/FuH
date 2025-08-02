"use client";

import { UserProfile } from "@/lib/types";
import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { useAuthStore } from "@/lib/store/AuthStore";
import { ApiClient } from "@/lib/api/ApiClient";

export default function ProfileHeader({ user }: { user: UserProfile }) {
  const userInitial = user.name.charAt(0).toUpperCase();
  const [imageError, setImageError] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || "");
  const [tempAvatarUrl, setTempAvatarUrl] = useState(user.avatar_url || "");
  const { setUser } = useAuthStore();

  useEffect(() => {
    const handleToggleEditMode = (event: any) => {
      setEditMode(event.detail.editMode);
      if (event.detail.editMode) {
        setTempAvatarUrl(user.avatar_url || "");
      }
    };

    window.addEventListener("toggleEditMode", handleToggleEditMode);
    return () => {
      window.removeEventListener("toggleEditMode", handleToggleEditMode);
    };
  }, [user.avatar_url]);

  const handleAvatarUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempAvatarUrl(e.target.value);
  };

  useEffect(() => {
    const handleSave = async () => {
      try {
        if (tempAvatarUrl !== user.avatar_url) {
          const response = await ApiClient.updateProfile({
            avatarUrl: tempAvatarUrl,
          });
          setAvatarUrl(tempAvatarUrl);
          setUser(response.user);
        }
        setEditMode(false);
      } catch (error) {
        setTempAvatarUrl(user.avatar_url || "");
      }
    };

    const handleCancel = () => {
      setEditMode(false);
      setTempAvatarUrl(user.avatar_url || "");
    };

    window.addEventListener("profileSave", handleSave);
    window.addEventListener("profileCancel", handleCancel);

    return () => {
      window.removeEventListener("profileSave", handleSave);
      window.removeEventListener("profileCancel", handleCancel);
    };
  }, [editMode, tempAvatarUrl, user.avatar_url, setUser]);

  return (
    <div className="w-full py-8 mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {!editMode && user.avatar_url && !imageError ? (
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img
              src={user.avatar_url}
              alt={`Avatar de ${user.name}`}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        ) : !editMode ? (
          <div className="w-24 h-24 rounded-full flex items-center justify-center bg-purple-600 text-white text-4xl font-bold">
            {userInitial}
          </div>
        ) : (
          <div className="relative">
            <div className="w-24 h-24 rounded-full flex items-center justify-center bg-purple-600 text-white text-4xl font-bold relative group">
              {tempAvatarUrl && !imageError ? (
                <img
                  src={tempAvatarUrl}
                  alt={`Avatar de ${user.name}`}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                userInitial
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <Pencil size={20} className="text-white" />
              </div>
            </div>
            {editMode && (
              <input
                type="text"
                value={tempAvatarUrl}
                onChange={handleAvatarUrlChange}
                placeholder="URL de imagen"
                className="mt-2 w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            )}
          </div>
        )}

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
