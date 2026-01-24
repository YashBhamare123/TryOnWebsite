import { ArrowRight, Layers, Zap, Cloud } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const features = [
    {
        icon: <Layers className="w-5 h-5" />,
        title: "Pipeline",
        description: "Advanced segmentation, inpainting, and image consistency modules.",
        color: "from-primary to-accent",
        link: "/docs#pipeline",
    },
    {
        icon: <Zap className="w-5 h-5" />,
        title: "Optimization",
        description: "Flash attention, quantization, and caching strategies.",
        color: "from-accent to-primary-light",
        link: "/docs#optimization",
    },
    {
        icon: <Cloud className="w-5 h-5" />,
        title: "Deployment",
        description: "Containerized, serverless, and edge-ready configurations.",
        color: "from-primary-light to-primary",
        link: "/docs#deployment",
    },
];

const MobileFeaturesSection = () => {
    return (
        <section className="py-16 bg-secondary/20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute inset-0 grain-overlay" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <span className="text-primary font-medium text-xs uppercase tracking-widest mb-2 block">
                        Documentation
                    </span>
                    <h2 className="text-3xl font-display font-bold text-foreground mb-3">
                        Deep Dive Into
                        <span className="text-gradient"> The Stack</span>
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Comprehensive technical documentation covering every aspect.
                    </p>
                </div>

                {/* Architecture Diagram */}
                <div className="mb-8">
                    <div className="rounded-xl overflow-hidden border border-border/50 shadow-lg">
                        <img
                            src="/diagram-export-1-9-2026-2_52_17-PM.png"
                            alt="System Architecture"
                            className="w-full h-auto"
                        />
                    </div>
                    <p className="text-center text-muted-foreground text-xs mt-2 px-4">
                        Complete system architecture overview
                    </p>
                </div>

                {/* Feature Cards - Single Column */}
                <div className="space-y-4 mb-8">
                    {features.map((feature) => (
                        <Link
                            key={feature.title}
                            to={feature.link}
                            className="group relative bg-card rounded-xl p-5 border border-border hover:border-primary/30 transition-all duration-300 block"
                        >
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className={`w-11 h-11 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-primary-foreground shrink-0`}>
                                    {feature.icon}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-lg font-display font-bold text-foreground">
                                            {feature.title}
                                        </h3>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <p className="text-muted-foreground text-sm line-clamp-2">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link to="/docs">
                        <Button variant="gradient" size="lg" className="group shadow-glow w-full">
                            Explore Full Documentation
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default MobileFeaturesSection;
