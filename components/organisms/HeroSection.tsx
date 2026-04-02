import Image from "next/image";
import Button from "@/components/atoms/Button";

export default function HeroSection() {
  return (
    <section className="w-full px-4 pt-6 pb-8 md:px-10 lg:px-0 lg:pt-24 lg:pb-0">
      <div className="mx-auto max-w-[960px] grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12 items-center">
        {/* Text content */}
        <div className="flex flex-col gap-6 md:gap-8 order-2 md:order-1 text-center md:text-left">
          {/* Mobile logo decoration */}
          <div className="flex justify-center md:hidden">
            <div className="w-[85px] h-[85px] relative">
              <Image
                src="/images/logo-leaf.svg"
                alt=""
                fill
                sizes="85px"
                className="object-contain opacity-50"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 items-center md:items-start">
            {/* Welcome badge - desktop only */}
            <span className="hidden md:inline-flex self-start px-3 py-1 rounded-full bg-[var(--green-light)] text-xs font-bold uppercase tracking-[1.2px] text-[var(--green-primary)]">
              Bienvenido a nuestro espacio
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-[var(--green-primary)] tracking-tight leading-tight md:leading-none">
              Descubre la magia de la naturaleza{" "}
              <span className="text-[var(--terracotta)]">Unetense</span>
            </h1>

            <p className="text-sm sm:text-base md:text-xl text-[var(--text-dark)] leading-relaxed max-w-lg">
              Ten un rato diferente y ven a disfrutar de uno de los sitios
              naturales más hermosos de la ciudad de San Cristóbal
            </p>
          </div>

          {/* Desktop CTA only */}
          <div className="hidden md:flex gap-3">
            <Button href="/booking" size="lg">
              RESERVAR
            </Button>
          </div>
        </div>

        {/* Hero image - hidden on mobile per Figma mobile design */}
        <div className="relative order-1 md:order-2 hidden md:block">
          <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/images/hero-garden.png"
              alt="Jardín Botánico UNET - Vista del jardín"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
