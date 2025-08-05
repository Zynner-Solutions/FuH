import { notFound } from "next/navigation";
import { getOrganizationBySlug } from "@/lib/actions/organizations";
import OrganizationDetailContent from "@/components/features/organizations/[id]/OrganizationDetailContent";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const organization = await getOrganizationBySlug(slug);

  if (!organization) {
    return notFound();
  }

  return <OrganizationDetailContent organization={organization} />;
}
