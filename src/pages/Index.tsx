import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TechStackMarquee from "@/components/TechStackMarquee";
import GallerySection from "@/components/GallerySection";
import FeaturesSection from "@/components/FeaturesSection";
import OpensourceSection from "@/components/OpensourceSection";
import Footer from "@/components/Footer";

const Index = () => {
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
