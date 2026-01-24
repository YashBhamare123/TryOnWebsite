import { ArrowRight, Layers, Zap, Cloud } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const features = [
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Pipeline",
    description: "Advanced segmentation, inpainting, and image consistency modules working in harmony.",
    color: "from-primary to-accent",
    link: "/docs#pipeline",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Optimization",
    description: "Flash attention, quantization, and caching strategies for production-ready performance.",
    color: "from-accent to-primary-light",
    link: "/docs#optimization",
  },
  {
    icon: <Cloud className="w-6 h-6" />,
    title: "Deployment",
    description: "Containerized, serverless, and edge-ready deployment configurations.",
    color: "from-primary-light to-primary",
    link: "/docs#deployment",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-32 bg-secondary/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
      {/* Grain overlay */}
      <div className="absolute inset-0 grain-overlay" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            Documentation
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
            Deep Dive Into
            <span className="text-gradient"> The Stack</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Comprehensive technical documentation covering every aspect of our virtual try-on system.
          </p>
        </div>

        {/* Architecture Diagram */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="rounded-2xl overflow-hidden border border-border/50 shadow-lg">
            <img
              src="/diagram-export-1-9-2026-2_52_17-PM.png"
              alt="Full System Architecture"
              className="w-full h-auto"
            />
          </div>
          <p className="text-center text-muted-foreground text-sm mt-4">
            Complete system architecture: Agentic System, Segmentation, Preprocessing, Fill Backbone, Postprocessing, and Logo Engine
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              to={feature.link}
              className="group relative bg-card rounded-2xl p-8 border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-glow animate-fade-in-up block"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 text-primary-foreground group-hover:scale-110 group-hover:shadow-glow transition-all duration-300`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Arrow */}
              <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/docs">
            <Button variant="gradient" size="lg" className="group shadow-glow">
              Explore Full Documentation
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

