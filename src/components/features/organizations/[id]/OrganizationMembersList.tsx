"use client";

import { useEffect, useState, useMemo } from "react";
import { ApiClient } from "@/lib/api/ApiClient";
import { useNotification } from "@/components/ui/notifications/useNotification";
import MemberInfoDetail from "./MemberInfoDetail";

export default function OrganizationMembersList({ slug }: { slug: string }) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { confirm, success, error: notifyError } = useNotification();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const membersPerPage = 9;

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await ApiClient.getOrganizationBySlug(slug);
      setMembers(res.organization.members || []);
    } catch (err: any) {
      setError(err.message || "Error al obtener miembros");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [slug]);

  const handleDelete = (index: number) => {
    confirm("¿Seguro que deseas eliminar este miembro?", async () => {
      try {
        await ApiClient.deleteMember(slug, index);
        success("Miembro eliminado correctamente");
        if (selectedIdx === index) setSelectedIdx(null);
        fetchMembers();
      } catch (err) {
        notifyError((err as Error).message || "Error al eliminar miembro");
      }
    });
  };

  const handleAddPayment = async (payment: any) => {
    if (selectedIdx === null) return;
    const member = members[selectedIdx];
    const updatedPayments = Array.isArray(member.payments)
      ? [...member.payments, payment]
      : [payment];
    try {
      await ApiClient.updateMember(slug, selectedIdx, {
        nombre: member.nombre,
        apellido: member.apellido,
        payments: updatedPayments,
      });
      success("Pago agregado correctamente");
      fetchMembers();
    } catch (err) {
      notifyError((err as Error).message || "Error al agregar pago");
    }
  };

  const filteredMembers = useMemo(() => {
    if (!searchTerm) return members;

    const searchLower = searchTerm.toLowerCase();
    return members.filter(
      (member) =>
        member.nombre?.toLowerCase().includes(searchLower) ||
        member.apellido?.toLowerCase().includes(searchLower)
    );
  }, [members, searchTerm]);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * membersPerPage;
    return filteredMembers.slice(startIndex, startIndex + membersPerPage);
  }, [filteredMembers, currentPage, membersPerPage]);

  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh] sm:min-h-[40vh] w-full">
        <span className="text-[#7c3aed] font-semibold text-base sm:text-lg">
          Cargando miembros...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[30vh] sm:min-h-[40vh] w-full px-4">
        <span className="text-red-600 font-semibold text-base sm:text-lg text-center">
          {error}
        </span>
      </div>
    );
  }

  if (!members.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[30vh] sm:min-h-[40vh] w-full px-4">
        <span className="text-gray-500 text-base sm:text-lg text-center">
          No hay miembros en esta organización.
        </span>
      </div>
    );
  }

  return (
    <section className="w-full min-h-[60vh] flex flex-col items-center justify-center py-4 sm:py-8 px-2 sm:px-6">
      <h3 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 text-[#2f1065] text-center tracking-tight">
        Miembros
      </h3>

      <div className="w-full max-w-6xl mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre o apellido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-white border border-violet-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 pl-14"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          )}
        </div>
        {searchTerm && filteredMembers.length === 0 && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            No se encontraron miembros que coincidan con la búsqueda.
          </p>
        )}
      </div>

      <div className="w-full max-w-6xl grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
        {paginatedMembers.map((member, idx) => (
          <div
            key={members.indexOf(member)}
            className={`group relative rounded-xl sm:rounded-2xl border border-gray-200 p-2 sm:p-4 md:p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full flex flex-col items-center bg-gradient-to-br from-[#ede9fe] to-[#f5f3ff] min-h-[120px] sm:min-h-[150px] md:min-h-[180px] cursor-pointer ${
              selectedIdx === members.indexOf(member)
                ? "ring-2 ring-violet-400"
                : ""
            }`}
            onClick={() => setSelectedIdx(members.indexOf(member))}
          >
            <button
              className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full z-10 transition-all duration-200 border border-violet-200 sm:border-2 shadow-md bg-gradient-to-br from-violet-100 to-purple-200 hover:from-violet-500 hover:to-purple-600 text-violet-700 hover:text-white text-sm sm:text-base"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(members.indexOf(member));
              }}
              type="button"
              aria-label="Eliminar miembro"
            >
              ×
            </button>
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full mb-2 sm:mb-3 md:mb-4">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-violet-600">
                {member.nombre?.[0]?.toUpperCase() || "?"}
                {member.apellido?.[0]?.toUpperCase() || ""}
              </span>
            </div>
            <span className="block font-semibold text-[#491d95] text-sm sm:text-base md:text-lg text-center truncate max-w-full">
              {member.nombre} {member.apellido}
            </span>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 flex-wrap gap-1">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-2 py-1 rounded-md text-sm ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400"
                : "bg-violet-100 text-violet-700 hover:bg-violet-200"
            }`}
          >
            ←
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-2 py-1 rounded-md text-sm ${
                currentPage === idx + 1
                  ? "bg-violet-600 text-white"
                  : "bg-violet-100 text-violet-700 hover:bg-violet-200"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-2 py-1 rounded-md text-sm ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400"
                : "bg-violet-100 text-violet-700 hover:bg-violet-200"
            }`}
          >
            →
          </button>
        </div>
      )}

      {selectedIdx !== null && members[selectedIdx] && (
        <MemberInfoDetail
          member={members[selectedIdx]}
          onAddPayment={handleAddPayment}
          onClose={() => setSelectedIdx(null)}
        />
      )}
    </section>
  );
}
