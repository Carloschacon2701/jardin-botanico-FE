import Navbar from "@/components/organisms/Navbar";
import HeroSection from "@/components/organisms/HeroSection";
import SpeciesCarousel from "@/components/organisms/SpeciesCarousel";
import GardenHours from "@/components/organisms/GardenHours";
import CTASection from "@/components/organisms/CTASection";
import MobileBookCTA from "@/components/organisms/MobileBookCTA";
import Footer from "@/components/organisms/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <HeroSection />
        <SpeciesCarousel />
        <GardenHours />
        <MobileBookCTA />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
