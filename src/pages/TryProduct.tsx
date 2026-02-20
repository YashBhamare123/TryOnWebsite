import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, Sparkles, Zap, Shield, Play } from "lucide-react";

const features = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "AI-Powered",
    description: "State-of-the-art diffusion models for realistic results",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    description: "Optimized inference for near real-time processing",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Privacy First",
    description: "Your images are processed securely and never stored",
  },
];

const TryProduct = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 gradient-hero opacity-90" />
            <div className="absolute inset-0 grain-overlay pointer-events-none" />
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-20 w-40 h-40 border border-background/20 rounded-full animate-float" />
            <div className="absolute bottom-32 left-16 w-24 h-24 border border-background/10 rounded-full animate-float-slow" />
            <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-background/10 rounded-lg rotate-45 animate-float-reverse" />
          </div>

          <div className="relative z-10 container mx-auto px-6 py-24 text-center">
            <div className="max-w-3xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/20 backdrop-blur-sm border border-background/30 mb-8 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-background opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-background"></span>
                </span>
                <span className="text-sm font-medium text-background">
                  Live Demo Available
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-background leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Experience Virtual
                <br />
                Try On Today
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-background/80 max-w-xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                Upload your photo and any garment to see yourself wearing it instantly.
                No signup required.
              </p>

              {/* CTA Button */}
              <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                <a
                  href="https://attira-tryon.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="hero" size="xl" className="group">
                    <Play className="w-5 h-5" />
                    Launch Attira
                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="text-center p-8 rounded-2xl glass animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-5 text-primary-foreground shadow-glow">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
                How It Works
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
                Three Simple
                <span className="text-gradient"> Steps</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Transform your shopping experience in seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { step: "01", title: "Upload Photo", description: "Take or upload a full-body photo of yourself" },
                { step: "02", title: "Select Garment", description: "Choose any clothing item you want to try on" },
                { step: "03", title: "See Results", description: "View yourself wearing the garment instantly" },
              ].map((item, index) => (
                <div
                  key={item.step}
                  className="relative p-8 text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-8xl font-display font-bold text-gradient opacity-20 absolute top-0 left-1/2 -translate-x-1/2">
                    {item.step}
                  </span>
                  <div className="relative pt-16">
                    <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Final CTA */}
            <div className="text-center mt-16">
              <a
                href="https://attira-tryon.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="gradient" size="lg" className="group shadow-glow">
                  Get Started Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TryProduct;
