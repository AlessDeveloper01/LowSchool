import { RoutePlaceholder } from "@/features/dashboard/components/route-placeholder";

interface DynamicPageProps {
  params: Promise<{ segments: string[] }>;
}

export default async function DynamicDashboardPage({
  params,
}: DynamicPageProps) {
  const { segments } = await params;
  return <RoutePlaceholder pathname={`/${segments.join("/")}`} />;
}
