import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TechStackMarquee from "@/components/TechStackMarquee";
import GallerySection from "@/components/GallerySection";
import FeaturesSection from "@/components/FeaturesSection";
import OpensourceSection from "@/components/OpensourceSection";
import Footer from "@/components/Footer";

// Mobile components
import { useMobileDetect } from "@/hooks/useMobileDetect";
import MobileHeroSection from "@/components/mobile/MobileHeroSection";
import MobileTechStackMarquee from "@/components/mobile/MobileTechStackMarquee";
import MobileGallerySection from "@/components/mobile/MobileGallerySection";
import MobileFeaturesSection from "@/components/mobile/MobileFeaturesSection";
import MobileOpensourceSection from "@/components/mobile/MobileOpensourceSection";
import MobileFooter from "@/components/mobile/MobileFooter";

const Index = () => {
  const isMobile = useMobileDetect();

  // Mobile view
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <MobileHeroSection />
          <MobileTechStackMarquee />
          <MobileGallerySection />
          <MobileFeaturesSection />
          <MobileOpensourceSection />
        </main>
        <MobileFooter />
      </div>
    );
  }

  // Desktop view (unchanged)
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <TechStackMarquee />
        <GallerySection />
        <FeaturesSection />
        <OpensourceSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
