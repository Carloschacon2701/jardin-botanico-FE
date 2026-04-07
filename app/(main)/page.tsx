import HeroSection from "@/components/organisms/HeroSection";
import SpeciesCarousel from "@/components/organisms/SpeciesCarousel";
import GardenHours from "@/components/organisms/GardenHours";
import CTASection from "@/components/organisms/CTASection";
import MobileBookCTA from "@/components/organisms/MobileBookCTA";
import { getSecciones } from "@/lib/secciones";

export default async function Home() {
  const secciones = await getSecciones();

  return (
    <main className="flex-1 flex flex-col">
      <HeroSection />
      <SpeciesCarousel secciones={secciones} />
      <GardenHours />
      <MobileBookCTA />
      <CTASection />
    </main>
  );
}
