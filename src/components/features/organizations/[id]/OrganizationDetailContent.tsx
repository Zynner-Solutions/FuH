"use client";

import OrganizationDetailHeader from "./OrganizationDetailHeader";
import MembersForm from "@/components/forms/MembersForm";
import OrganizationMembersList from "./OrganizationMembersList";
import { useState } from "react";

export default function OrganizationDetailContent({
  organization,
}: {
  organization: any;
}) {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen">
      <OrganizationDetailHeader organization={organization} />
      <div className="flex justify-center mt-6">
        <button
          className="py-2 px-4 bg-[#7c3aed] hover:bg-[#6928d9] text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7c3aed]"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Cerrar" : "Añadir miembro"}
        </button>
      </div>
      {showForm && (
        <MembersForm
          organizationSlug={organization.slug}
          onSuccess={() => {
            setShowForm(false);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}
      <OrganizationMembersList slug={organization.slug} key={refreshKey} />
    </div>
  );
}
