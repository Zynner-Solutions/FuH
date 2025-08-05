"use client";

import { useEffect, useState } from "react";
import { ApiClient } from "@/lib/api/ApiClient";
import OrganizationsCard from "./OrganizationsCard";
import OrganizationsHeader from "./OrganizationsHeader";
import OrganizationForm from "@/components/forms/OrganizationForm";

const OrganizationsContent = () => {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    ApiClient.getOrganizations()
      .then((res) => setOrganizations(res.organizations || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <OrganizationsHeader />
        <div className="flex justify-center items-center py-12">
          <div className="w-10 h-10 border-4 border-violet-200 rounded-full animate-spin border-t-violet-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <OrganizationsHeader />
      <div className="w-full flex justify-center mb-6">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold shadow-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-200"
        >
          {showForm ? "Cerrar formulario" : "Crear organización"}
        </button>
      </div>
      {showForm && (
        <div className="w-full max-w-2xl mx-auto px-2 mb-8">
          <OrganizationForm
            onSuccess={async () => {
              setShowForm(false);
              const res = await ApiClient.getOrganizations();
              setOrganizations(res.organizations || []);
            }}
          />
        </div>
      )}
      {organizations.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No tenés organizaciones registradas.
        </div>
      ) : (
        <div className="w-full max-w-5xl mx-auto px-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {organizations.map((org) => (
            <OrganizationsCard key={org.id} org={org} />
          ))}
        </div>
      )}
    </>
  );
};

export default OrganizationsContent;
