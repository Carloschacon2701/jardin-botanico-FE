import Image from "next/image";
import Button from "@/components/atoms/Button";

export default function CTASection() {
  return (
    <section className="w-full px-4 md:px-10 lg:px-0 py-8 md:py-12">
      <div className="mx-auto max-w-[960px] relative overflow-hidden rounded-[var(--radius-xl)] bg-[var(--green-primary)]">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/cta-pattern.png"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
        </div>

        {/* Content */}
        <div className="relative flex flex-col items-center gap-8 px-6 py-16 md:px-24 md:py-24 text-center">
          <div className="flex flex-col gap-6 max-w-2xl">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
              ¡Agenda tu visita hoy!
            </h2>
            <p className="text-base md:text-xl text-[var(--green-light)] opacity-90 leading-relaxed">
              Abierto todos los días de 9:00 a 18:00. Acompáñanos en una visita
              guiada, un taller o un tranquilo paseo matutino.
            </p>
          </div>
          <Button href="/booking" size="lg">
            Agenda tu visita ahora!
          </Button>
        </div>
      </div>
    </section>
  );
}
