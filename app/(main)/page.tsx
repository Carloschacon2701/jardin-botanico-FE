import HeroSection from "@/components/organisms/HeroSection";
import SpeciesCarousel from "@/components/organisms/SpeciesCarousel";
import GardenHours from "@/components/organisms/GardenHours";
import CTASection from "@/components/organisms/CTASection";
import MobileBookCTA from "@/components/organisms/MobileBookCTA";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      <HeroSection />
      <SpeciesCarousel />
      <GardenHours />
      <MobileBookCTA />
      <CTASection />
    </main>
  );
}
