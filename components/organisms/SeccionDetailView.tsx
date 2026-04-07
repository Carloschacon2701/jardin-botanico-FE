"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";
import BackButton from "@/components/atoms/BackButton";
import Button from "@/components/atoms/Button";
import type { SeccionJardin, ImagenSeccion } from "@/lib/secciones";

interface SeccionDetailViewProps {
    seccion: SeccionJardin;
    imagenes: ImagenSeccion[];
}

export default function SeccionDetailView({
    seccion,
    imagenes,
}: SeccionDetailViewProps) {
    const thumbnails = [
        { src: seccion.url_imagen_principal, alt: `${seccion.nombre} - Principal` },
        ...imagenes
            .filter((img) => img.url_imagen !== seccion.url_imagen_principal)
            .map((img, i) => ({
                src: img.url_imagen,
                alt: `${seccion.nombre} - Imagen ${i + 1}`,
            })),
    ];

    const [activeThumb, setActiveThumb] = useState(0);

    return (
        <div className="flex flex-col min-h-screen bg-bg">
            {/* Desktop: full navbar */}
            <div className="hidden lg:block">
                <Navbar />
            </div>

            {/* Mobile: compact top app bar */}
            <header className="lg:hidden sticky top-0 z-50 bg-white border-b border-border flex items-center px-4 h-18.25">
                <BackButton />
                <h1 className="flex-1 text-center text-lg font-bold text-green-primary pr-9 truncate">
                    {seccion.nombre}
                </h1>
            </header>

            <main className="flex-1">
                {/* ===== MOBILE LAYOUT ===== */}
                <div className="lg:hidden flex flex-col">
                    {/* Hero image */}
                    <div className="relative w-full h-80">
                        <Image
                            src={thumbnails[activeThumb].src}
                            alt={thumbnails[activeThumb].alt}
                            fill
                            sizes="100vw"
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Thumbnail gallery */}
                    {thumbnails.length > 1 && (
                        <div className="overflow-x-auto px-4">
                            {/* Agregamos pb-6 para la barra de scroll y px-2 para que los anillos laterales no se corten */}
                            <div className="flex gap-3 pt-2 pb-6 px-2">
                                {thumbnails.map((thumb, i) => (
                                    <button
                                        key={thumb.src}
                                        onClick={() => setActiveThumb(i)}
                                        className={`relative w-20 h-20 rounded-full overflow-hidden cursor-pointer transition-all shrink-0 ${i === activeThumb
                                                ? "ring-2 ring-green-primary ring-offset-2"
                                                : "opacity-60 hover:opacity-100"
                                            }`}
                                        aria-label={`Ver imagen ${i + 1}`}
                                    >
                                        <Image
                                            src={thumb.src}
                                            alt={thumb.alt}
                                            fill
                                            sizes="80px"
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Title & description */}
                    <div className="flex flex-col gap-4 px-4 pb-4">
                        <h2 className="text-[28px] font-bold text-green-primary leading-tight">
                            {seccion.nombre}
                        </h2>
                        <p className="text-base text-text-dark leading-6.5">
                            {seccion.historia_detalle}
                        </p>
                    </div>

                    {/* Mobile bottom CTA */}
                    {seccion.enlace_whatsapp && (
                        <div className="sticky bottom-0 bg-white border-t border-border px-10 py-4">
                            <Button
                                href={seccion.enlace_whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="lg"
                                fullWidth
                            >
                                <WhatsAppIcon />
                                <span className="ml-2">Contactar por WhatsApp</span>
                            </Button>
                        </div>
                    )}
                </div>

                {/* ===== DESKTOP LAYOUT ===== */}
                <div className="hidden lg:grid lg:grid-cols-2 min-h-[calc(100vh-73px)]">
                    {/* Left: full-height hero image */}
                    <div className="relative">
                        <Image
                            src={thumbnails[activeThumb].src}
                            alt={thumbnails[activeThumb].alt}
                            fill
                            sizes="50vw"
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-black/10 to-transparent pointer-events-none" />
                    </div>

                    {/* Right: content */}
                    <div className="flex flex-col px-16 py-16">
                        {/* Title + description */}
                        <div className="flex flex-col gap-6 mb-10">
                            <h2 className="text-5xl font-black text-green-primary tracking-tight leading-tight">
                                {seccion.nombre}
                            </h2>
                            <div className="flex flex-col gap-5 text-lg text-text-dark leading-relaxed whitespace-pre-line">
                                {seccion.historia_detalle}
                            </div>
                        </div>

                        {/* Thumbnail gallery */}
                        {thumbnails.length > 1 && (
                            <div className="overflow-x-auto pl-11 mb-10">
                                <div className="flex gap-3 py-2 pr-2 h-28">
                                    {thumbnails.map((thumb, i) => (
                                        <button
                                            key={thumb.src}
                                            onClick={() => setActiveThumb(i)}
                                            className={`relative w-24.25 h-20 rounded-xl overflow-hidden cursor-pointer transition-all shrink-0 ${i === activeThumb
                                                ? "ring-2 ring-green-primary ring-offset-2 scale-105"
                                                : "opacity-60 hover:opacity-100"
                                                }`}
                                            aria-label={`Ver imagen ${i + 1}`}
                                        >
                                            <Image
                                                src={thumb.src}
                                                alt={thumb.alt}
                                                fill
                                                sizes="97px"
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA button */}
                        {seccion.enlace_whatsapp && (
                            <div className="mt-auto">
                                <Button
                                    href={seccion.enlace_whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    size="lg"
                                    fullWidth
                                >
                                    <WhatsAppIcon />
                                    <span className="ml-2">Contactar por WhatsApp</span>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function WhatsAppIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="shrink-0"
        >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );
}
