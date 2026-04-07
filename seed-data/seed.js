require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = "secciones-jardin";
const IMAGES_DIR = path.join(__dirname, "imagenes");

async function procesarSecciones() {
  const secciones = [];

  console.log("📖 Leyendo archivo CSV...");
  fs.createReadStream(path.join(__dirname, "data.csv"))
    .pipe(
      csv({
        mapHeaders: ({ header }) => header.trim(),
        mapValues: ({ value }) => value.trim(),
      }),
    )
    .on("data", (row) => secciones.push(row))
    .on("end", async () => {
      console.log(
        `✅ CSV cargado. Encontradas ${secciones.length} secciones.\n`,
      );

      for (const seccion of secciones) {
        const nombreSeccion = seccion.titulo || seccion.nombre;
        console.log(`🚀 Procesando: ${nombreSeccion}...`);

        const { data: nuevaSeccion, error: errorSeccion } = await supabase
          .from("secciones_jardin")
          .insert({
            nombre: nombreSeccion,
            descripcion_corta: seccion.descripcion_corta,
            historia_detalle: seccion.descripcion_larga,
            enlace_whatsapp: "https://wa.me/584140000000",
            necesidades_donacion: "Información sobre donativos próximamente.",
            url_imagen_principal: "https://temporal.com/cargando.jpg",
          })
          .select()
          .single();

        if (errorSeccion) {
          console.error(
            `❌ Error insertando sección ${seccion.slug}:`,
            errorSeccion.message,
          );
          continue;
        }

        const idSeccion = nuevaSeccion.id_seccion;

        const carpetaSeccion = path.join(IMAGES_DIR, seccion.slug);

        if (fs.existsSync(carpetaSeccion)) {
          const archivos = fs.readdirSync(carpetaSeccion);
          const imagenes = archivos.filter(
            (archivo) =>
              archivo.toLowerCase().endsWith(".jpg") ||
              archivo.toLowerCase().endsWith(".jpeg") ||
              archivo.toLowerCase().endsWith(".png"),
          );

          for (const imagen of imagenes) {
            const rutaCompleta = path.join(carpetaSeccion, imagen);
            const buffer = fs.readFileSync(rutaCompleta);

            const rutaStorage = `${seccion.slug}/${imagen}`;
            const esPrincipal = imagen.toLowerCase().includes("principal");

            const { error: errorUpload } = await supabase.storage
              .from(BUCKET_NAME)
              .upload(rutaStorage, buffer, {
                contentType: imagen.toLowerCase().endsWith(".png")
                  ? "image/png"
                  : "image/jpeg",
                upsert: true,
              });

            if (errorUpload) {
              console.error(
                `  ⚠️ Error subiendo imagen ${imagen}:`,
                errorUpload.message,
              );
              continue;
            }

            const {
              data: { publicUrl },
            } = supabase.storage.from(BUCKET_NAME).getPublicUrl(rutaStorage);

            const { error: errorDbImagen } = await supabase
              .from("imagenes_seccion")
              .insert({
                id_seccion: idSeccion,
                url_imagen: publicUrl,
              });

            if (errorDbImagen) {
              console.error(
                `  ⚠️ Error guardando URL en BD para ${imagen}:`,
                errorDbImagen.message,
              );
            } else {
              console.log(
                `  📸 Imagen guardada en tabla hija: ${imagen} (Principal: ${esPrincipal})`,
              );
            }

            if (esPrincipal) {
              const { error: errorUpdate } = await supabase
                .from("secciones_jardin")
                .update({ url_imagen_principal: publicUrl })
                .eq("id_seccion", idSeccion);

              if (errorUpdate) {
                console.error(
                  `  ⚠️ Error actualizando url_imagen_principal:`,
                  errorUpdate.message,
                );
              } else {
                console.log(
                  `  🌟 URL principal actualizada en la tabla secciones_jardin`,
                );
              }
            }
          }
        } else {
          console.log(
            `  ⚠️ No se encontró la carpeta de imágenes para: ${seccion.slug}`,
          );
        }
        console.log("-----------------------------------");
      }

      console.log("🎉 ¡Carga masiva completada!");
    });
}

procesarSecciones();
