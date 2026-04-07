"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";
import BackButton from "@/components/atoms/BackButton";
import Button from "@/components/atoms/Button";

const thumbnails = [
  { id: 1, src: "/images/red-fox.jpg", alt: "Species detail view 1" },
  { id: 2, src: "/images/red-fox.jpg", alt: "Species detail view 2" },
  { id: 3, src: "/images/red-fox.jpg", alt: "Species detail view 3" },
  { id: 4, src: "/images/red-fox.jpg", alt: "Species detail view 4" },
];

export default function DetailPage() {
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
        <h1 className="flex-1 text-center text-lg font-bold text-green-primary pr-9">
          Red Fox Habitat
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
          <div className="flex gap-3 px-4 py-4">
            {thumbnails.map((thumb, i) => (
              <button
                key={thumb.id}
                onClick={() => setActiveThumb(i)}
                className={`relative w-19.25 h-19.25 rounded-xl overflow-hidden cursor-pointer transition-all shrink-0 ${
                  i === activeThumb
                    ? "ring-2 ring-green-primary ring-offset-2"
                    : "opacity-60 hover:opacity-100"
                }`}
                aria-label={`Ver imagen ${i + 1}`}
              >
                <Image
                  src={thumb.src}
                  alt={thumb.alt}
                  fill
                  sizes="77px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Title & description */}
          <div className="flex flex-col gap-4 px-4 pb-4">
            <h2 className="text-[28px] font-bold text-green-primary leading-tight">
              Red Fox Habitat
            </h2>
            <p className="text-base text-text-dark leading-6.5">
              The red fox (Vulpes vulpes) is the largest of the true foxes and
              one of the most widely distributed members of the order Carnivora,
              being present across the entire Northern Hemisphere. In our
              botanical garden, they frequent the dense woodland borders and open
              meadows, playing a crucial role in our local ecosystem by
              controlling small mammal populations.
            </p>
          </div>

          {/* Mobile bottom CTA */}
          <div className="sticky bottom-0 bg-white border-t border-border px-10 py-4">
            <Button href="/donate" size="lg" fullWidth>
              <HeartIcon />
              <span className="ml-2">Donar</span>
            </Button>
          </div>
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
                Red Fox Habitat
              </h2>
              <div className="flex flex-col gap-5 text-lg text-text-dark leading-relaxed">
                <p>
                  The Red Fox habitat in our botanical garden mimics the diverse
                  temperate forests where these adaptable mammals thrive. Known
                  for their striking reddish-orange fur and bushy white-tipped
                  tails, red foxes are essential for maintaining the ecological
                  balance of their environment.
                </p>
                <p>
                  This exhibit focuses on the intersection of flora and fauna,
                  showcasing the native plants that provide cover and food
                  sources for the fox&apos;s prey, creating a holistic
                  representation of their natural ecosystem.
                </p>
              </div>
            </div>

            {/* Thumbnail gallery */}
            <div className="flex gap-3 mb-10 pl-11">
              {thumbnails.map((thumb, i) => (
                <button
                  key={thumb.id}
                  onClick={() => setActiveThumb(i)}
                  className={`relative w-24.25 h-20 rounded-xl overflow-hidden cursor-pointer transition-all shrink-0 ${
                    i === activeThumb
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

            {/* CTA button */}
            <div className="mt-auto">
              <Button href="/donate" size="lg" fullWidth>
                <HeartIcon />
                <span className="ml-2">
                  ¡Ayudanos a apoyar a nuestros animales!
                </span>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function HeartIcon() {
  return (
    <svg
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M8.5 14.35L7.43 13.39C3.5 9.82 1 7.57 1 4.79C1 2.54 2.72 0.85 5 0.85C6.28 0.85 7.5 1.43 8.5 2.37C9.5 1.43 10.72 0.85 12 0.85C14.28 0.85 16 2.54 16 4.79C16 7.57 13.5 9.82 9.57 13.4L8.5 14.35Z" />
    </svg>
  );
}
