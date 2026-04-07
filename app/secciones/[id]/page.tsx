import { notFound } from "next/navigation";
import { getSeccionById, getImagenesSeccion } from "@/lib/secciones";
import SeccionDetailView from "@/components/organisms/SeccionDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SeccionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const seccionId = Number(id);

  if (Number.isNaN(seccionId)) notFound();

  const [seccion, imagenes] = await Promise.all([
    getSeccionById(seccionId),
    getImagenesSeccion(seccionId),
  ]);

  if (!seccion) notFound();

  return <SeccionDetailView seccion={seccion} imagenes={imagenes} />;
}
