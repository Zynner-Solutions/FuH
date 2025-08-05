"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { ApiClient } from "@/lib/api/ApiClient";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";
import ProfileInfo from "./ProfileInfo";
import QuickActions from "./QuickActions";
import ProfileJars from "./ProfileJars";

import { UserProfile, Expense } from "@/lib/types";
export default function ProfileContent() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const router = useRouter();
  const profileJarsRef = useRef<{ fetchJars: () => void } | null>(null);

  const fetchProfile = async () => {
    const data = await ApiClient.getProfile();
    if (!data) {
      router.push("/login");
      return;
    }
    setUser(data.user);
    setExpenses(data.expenses);
    setLoading(false);
  };

  const handleJarCreated = () => {
    if (profileJarsRef.current) {
      profileJarsRef.current.fetchJars();
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-6 min-h-screen">
      <ProfileHeader user={user} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="order-1 lg:order-2 w-full lg:col-span-1">
          <QuickActions expenses={expenses} onJarCreated={handleJarCreated} />
        </div>
        <div className="order-2 lg:order-1 lg:col-span-2 space-y-6">
          <ProfileStats expenses={expenses} jars={user.jars || []} />
          <ProfileInfo user={user} />
          <ProfileJars ref={profileJarsRef} />
        </div>
      </div>
    </div>
  );
}
