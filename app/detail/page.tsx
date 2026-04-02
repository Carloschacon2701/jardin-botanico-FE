"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";
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
      <Navbar />

      <main className="flex-1">
        {/* Desktop: split layout */}
        <div className="lg:grid lg:grid-cols-2 lg:min-h-[calc(100vh-73px)]">
          {/* Left: hero image */}
          <div className="relative h-[320px] lg:h-auto">
            <Image
              src={thumbnails[activeThumb].src}
              alt={thumbnails[activeThumb].alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          </div>

          {/* Right: content */}
          <div className="flex flex-col">
            {/* Thumbnail gallery */}
            <div className="flex gap-3 px-4 py-4 lg:px-16 lg:pt-16 lg:pb-8">
              {thumbnails.map((thumb, i) => (
                <button
                  key={thumb.id}
                  onClick={() => setActiveThumb(i)}
                  className={`relative w-[77px] h-[77px] lg:w-[97px] lg:h-[80px] rounded-xl overflow-hidden cursor-pointer transition-all ${
                    i === activeThumb
                      ? "ring-2 ring-[var(--green-primary)] ring-offset-2"
                      : "opacity-70 hover:opacity-100"
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

            {/* Text content */}
            <div className="flex flex-col gap-6 px-4 py-4 lg:px-16 lg:py-8 flex-1">
              <h1 className="text-3xl lg:text-5xl font-black text-[var(--green-primary)] tracking-tight leading-tight">
                Red Fox Habitat
              </h1>

              <div className="flex flex-col gap-4 text-base lg:text-lg text-[var(--text-dark)] leading-relaxed">
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

              {/* CTA */}
              <div className="mt-auto pt-8 pb-6 lg:pb-16">
                <Button href="/donate" size="lg" fullWidth>
                  <HeartIcon />
                  <span className="ml-2">
                    ¡Ayudanos a apoyar a nuestros animales!
                  </span>
                </Button>
              </div>
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
