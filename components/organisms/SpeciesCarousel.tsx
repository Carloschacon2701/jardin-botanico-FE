"use client";

import { useRef } from "react";
import SpeciesCard from "@/components/molecules/SpeciesCard";
import type { SeccionResumen } from "@/lib/secciones";

interface SpeciesCarouselProps {
  secciones: SeccionResumen[];
}

export default function SpeciesCarousel({ secciones }: SpeciesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 280;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full py-12 md:py-16 bg-(--green-bg-subtle) overflow-hidden">
      <div className="mx-auto max-w-360 px-4 md:px-10 lg:px-40">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h2 className="text-2xl md:text-4xl font-bold text-green-primary tracking-tight">
              Descubre cada uno de nuestros espacios
            </h2>
            <p className="text-base md:text-lg text-text-dark">
              Ecosistemas diversos, cuidados para la conservación y la
              educación ambiental.
            </p>
          </div>

          {/* Desktop carousel controls */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-full border border-(--border-green-light) flex items-center justify-center hover:bg-green-light transition-colors cursor-pointer"
              aria-label="Anterior"
            >
              <svg
                width="7"
                height="12"
                viewBox="0 0 7 12"
                fill="none"
                stroke="var(--green-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 1L1 6L6 11" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full border border-(--border-green-light) flex items-center justify-center hover:bg-green-light transition-colors cursor-pointer"
              aria-label="Siguiente"
            >
              <svg
                width="7"
                height="12"
                viewBox="0 0 7 12"
                fill="none"
                stroke="var(--green-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 1L6 6L1 11" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable cards */}
        <div
          ref={scrollRef}
          className="flex gap-5 md:gap-7 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {secciones.map((seccion) => (
            <div key={seccion.id_seccion} className="snap-start">
              <SpeciesCard
                title={seccion.nombre}
                description={seccion.descripcion_corta}
                imageSrc={seccion.url_imagen_principal}
                detailHref={`/secciones/${seccion.id_seccion}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
