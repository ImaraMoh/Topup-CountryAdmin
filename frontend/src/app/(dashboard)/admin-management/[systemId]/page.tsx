import TopupSystemDetailPage from "@/components/modules/TopupSystemDetailPage";

export default async function SystemDetailRoute({ params }: { params: Promise<{ systemId: string }> }) {
  const { systemId } = await params;
  return <TopupSystemDetailPage systemId={systemId} />;
}
