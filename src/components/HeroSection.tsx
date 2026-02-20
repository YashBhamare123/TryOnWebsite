import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects - More Dynamic */}
      <div className="absolute inset-0 bg-background">
        {/* Main Gradient Orb with Grainy Gradient and Pulse */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full gradient-hero-grainy opacity-20 blur-3xl animate-pulse-glow" />

        {/* Top-Left Gradient Orb - Smaller, Reverse Pulse */}
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full gradient-hero-grainy opacity-15 blur-3xl animate-pulse-glow-reverse" />

        {/* Secondary Orbs with Different Speeds */}
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full bg-primary/12 blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-accent/12 blur-3xl animate-float-reverse" />

        {/* Additional Accent Orbs */}
        <div className="absolute top-1/3 right-1/3 w-[250px] h-[250px] rounded-full bg-primary-light/8 blur-3xl animate-float" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge - Interactive */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in hover:bg-primary/5 transition-all duration-300 cursor-default border border-primary/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-foreground/80">
              AI-Powered Fashion Technology
            </span>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>

          {/* Headline - Slim and Elegant */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-semibold tracking-tight leading-[0.95] mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <span className="text-foreground">Introducing</span>
            <br />
            <span className="flex items-center justify-center gap-4">
              <img src="/attira-logo.png" alt="Attira" className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain" />
              <span className="text-gradient">Attira</span>
            </span>
          </h1>

          {/* Subtitle - Better Typography */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in-up leading-relaxed" style={{ animationDelay: "0.2s" }}>
            Try on any outfit instantly with AI-powered virtual fitting.
            Upload your photo, choose a garment, and see yourself wearing it in <span className="text-foreground/90 font-medium">seconds</span>.
          </p>

          {/* CTA Buttons - Enhanced Hover States */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/docs">
              <Button variant="gradient" size="xl" className="group shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105">
                Read Documentation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="https://attira-tryon.vercel.app/" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="xl"
                className="group hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
              >
                <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Try Product
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Animated */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in group cursor-pointer" style={{ animationDelay: "0.5s" }}>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 group-hover:border-primary/50 transition-colors flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-muted-foreground/50 group-hover:bg-primary/70 animate-bounce transition-colors" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
