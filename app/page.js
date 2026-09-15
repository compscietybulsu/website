import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AnnouncementCarousel from "@/components/AnnouncementCarousel";
import PartnersSection from "@/components/PartnersSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import FadeIn from "@/components/ui/FadeIn";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020806] via-[#0a2818] to-[#0d3320]">
      <Navbar />
      <Hero />
      <FadeIn>
        <AnnouncementCarousel />
      </FadeIn>
      <FadeIn>
        <PartnersSection />
      </FadeIn>
      <FadeIn>
        <AboutSection />
      </FadeIn>
      <Footer />
    </div>
  );
}