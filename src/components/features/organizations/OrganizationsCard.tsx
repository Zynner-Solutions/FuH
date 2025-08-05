import { useRouter } from "next/navigation";
import { Building2, Calendar } from "lucide-react";

export default function OrganizationsCard({ org }: { org: any }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/organizations/${org.slug}`)}
      className="group flex flex-col items-start justify-between rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 p-0 min-h-[180px] cursor-pointer hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-violet-400 w-full relative"
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-500 to-purple-600"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      <div className="flex-1 w-full p-6">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-violet-600" />
          </div>
          <div className="bg-violet-50 text-violet-700 text-xs px-2 py-1 rounded-md ml-auto font-medium">
            ID: {org.id.slice(0, 6)}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 group-hover:text-violet-700 truncate">
          {org.name}
        </h3>
        <p className="text-gray-500 text-sm mt-2 mb-4 line-clamp-2 min-h-[2.5rem]">
          {org.description || "Sin descripción"}
        </p>
      </div>

      <div className="flex items-center w-full px-6 py-3 mt-auto border-t border-gray-100 bg-gray-50 group-hover:bg-violet-50 transition-colors duration-300">
        <Calendar className="w-3.5 h-3.5 text-violet-500 mr-1.5" />
        <span className="text-xs text-gray-500">
          {new Date(org.created_at).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </button>
  );
}
