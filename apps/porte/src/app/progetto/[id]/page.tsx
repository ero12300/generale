import { ProgettoView } from "./progetto-view";

export default async function ProgettoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProgettoView id={id} />;
}
