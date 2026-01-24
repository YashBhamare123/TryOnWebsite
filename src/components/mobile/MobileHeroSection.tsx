import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const MobileHeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Effects - Same as desktop but scaled */}
            <div className="absolute inset-0 bg-background">
                {/* Main Gradient Orb with Grainy Gradient and Pulse */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full gradient-hero-grainy opacity-20 blur-3xl animate-pulse-glow" />

                {/* Top-Left Gradient Orb - Smaller, Reverse Pulse */}
                <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] rounded-full gradient-hero-grainy opacity-15 blur-3xl animate-pulse-glow-reverse" />

                {/* Secondary Orbs with Different Speeds */}
                <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] rounded-full bg-primary/12 blur-3xl animate-float-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] rounded-full bg-accent/12 blur-3xl animate-float-reverse" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-5 py-32">
                <div className="max-w-lg mx-auto text-center">
                    {/* Badge - Interactive */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-6 animate-fade-in hover:bg-primary/5 transition-all duration-300 cursor-default border border-primary/10">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-xs font-medium text-foreground/80">
                            AI-Powered Fashion Technology
                        </span>
                        <Sparkles className="w-3 h-3 text-primary" />
                    </div>

                    {/* Headline - Slim and Elegant */}
                    <h1 className="text-4xl font-display font-semibold tracking-tight leading-[0.95] mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                        <span className="text-foreground">Introducing</span>
                        <br />
                        <span className="flex items-center justify-center gap-3 mt-2">
                            <img src="/attira-logo.png" alt="Attira" className="w-16 h-16 object-contain" />
                            <span className="text-gradient">Attira</span>
                        </span>
                    </h1>

                    {/* Subtitle - Better Typography */}
                    <p className="text-base text-muted-foreground max-w-sm mx-auto mb-10 animate-fade-in-up leading-relaxed" style={{ animationDelay: "0.2s" }}>
                        Try on any outfit instantly with AI-powered virtual fitting.
                        Upload your photo, choose a garment, and see yourself wearing it in <span className="text-foreground/90 font-medium">seconds</span>.
                    </p>

                    {/* CTA Buttons - Enhanced Hover States */}
                    <div className="flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                        <Link to="/docs" className="w-full">
                            <Button variant="gradient" size="lg" className="w-full group shadow-glow hover:shadow-glow-lg transition-all duration-300">
                                Read Documentation
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <a href="https://tryon-beige.vercel.app/" target="_blank" rel="noopener noreferrer" className="w-full">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full group hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
                            >
                                <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Try Product
                            </Button>
                        </a>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator - Animated */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-fade-in group cursor-pointer" style={{ animationDelay: "0.5s" }}>
                <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 group-hover:border-primary/50 transition-colors flex justify-center pt-1.5">
                    <div className="w-1 h-1.5 rounded-full bg-muted-foreground/50 group-hover:bg-primary/70 animate-bounce transition-colors" />
                </div>
            </div>
        </section>
    );
};

export default MobileHeroSection;
