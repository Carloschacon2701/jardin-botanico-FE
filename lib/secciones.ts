import { supabase } from "./supabase";

export interface SeccionJardin {
  id_seccion: number;
  nombre: string;
  descripcion_corta: string;
  historia_detalle: string;
  enlace_whatsapp: string;
  necesidades_donacion: string;
  url_imagen_principal: string;
}

export interface ImagenSeccion {
  url_imagen: string;
}

export type SeccionResumen = Pick<
  SeccionJardin,
  "id_seccion" | "nombre" | "descripcion_corta" | "url_imagen_principal"
>;

export async function getSecciones(): Promise<SeccionResumen[]> {
  const { data, error } = await supabase
    .from("secciones_jardin")
    .select("id_seccion, nombre, descripcion_corta, url_imagen_principal")
    .order("id_seccion");

  if (error) throw error;
  return data ?? [];
}

export async function getSeccionById(
  id: number
): Promise<SeccionJardin | null> {
  const { data, error } = await supabase
    .from("secciones_jardin")
    .select("*")
    .eq("id_seccion", id)
    .single();

  // PGRST116 = no rows found, not a real error
  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function getImagenesSeccion(
  idSeccion: number
): Promise<ImagenSeccion[]> {
  const { data, error } = await supabase
    .from("imagenes_seccion")
    .select("url_imagen")
    .eq("id_seccion", idSeccion);

  if (error) throw error;
  return data ?? [];
}
