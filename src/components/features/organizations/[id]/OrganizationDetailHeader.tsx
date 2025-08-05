import { notFound } from "next/navigation";

export default function OrganizationDetailHeader({
  organization,
}: {
  organization: any;
}) {
  if (!organization) {
    return notFound();
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
      <span className="text-base sm:text-lg text-gray-500 mb-2">
        Vistazo sobre la organización:
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-violet-600 via-purple-500 to-violet-400 bg-clip-text text-transparent mb-2 break-words">
        {organization.name}
      </h1>
    </div>
  );
}
