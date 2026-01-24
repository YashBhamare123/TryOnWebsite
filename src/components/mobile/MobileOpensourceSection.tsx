import { useEffect, useRef, useState } from "react";
import { Github, Box, FileCode } from "lucide-react";

const MobileOpensourceSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [hasLanded, setHasLanded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasLanded) {
                        setIsVisible(true);
                        setTimeout(() => {
                            setHasLanded(true);
                        }, 400);
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [hasLanded]);

    const links = [
        {
            icon: Github,
            title: "GitHub Repository",
            description: "Full source code and documentation",
            href: "https://github.com/YashBhamare123/TryOnPort",
            color: "from-zinc-700 to-zinc-900",
        },
        {
            icon: Box,
            title: "PixelForge Nodes",
            description: "Custom ComfyUI node pack",
            href: "https://github.com/ThunderBolt4931/comfyui_pixel_forge/tree/main",
            color: "from-primary to-primary-dark",
        },
        {
            icon: FileCode,
            title: "Architecture Docs",
            description: "Technical design deep dive",
            href: "/docs",
            color: "from-accent to-accent-light",
        },
    ];

    return (
        <section
            ref={sectionRef}
            className="py-16 relative overflow-hidden bg-background"
        >
            {/* Background grain */}
            <div className="absolute inset-0 grain-overlay pointer-events-none" />

            {/* Subtle glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Title */}
                <div className="text-center mb-12 relative">
                    {/* Simplified shockwave ring */}
                    <div
                        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/30 pointer-events-none ${hasLanded ? "animate-shockwave" : "opacity-0 scale-0"
                            }`}
                        style={{ width: "60px", height: "60px" }}
                    />

                    <div className="relative">
                        <h2
                            className={`text-4xl font-display font-bold transition-all ${isVisible
                                    ? hasLanded
                                        ? "translate-y-0 scale-100 opacity-100"
                                        : "translate-y-0 scale-105 opacity-100"
                                    : "-translate-y-[100px] scale-125 opacity-0"
                                }`}
                            style={{
                                transitionDuration: isVisible
                                    ? hasLanded
                                        ? "150ms"
                                        : "400ms"
                                    : "0ms",
                                transitionTimingFunction: hasLanded
                                    ? "cubic-bezier(0.22, 1, 0.36, 1)"
                                    : "cubic-bezier(0.55, 0, 1, 0.45)",
                            }}
                        >
                            <span className="text-gradient">Completely</span>
                            <br />
                            <span className="text-foreground">Opensource</span>
                        </h2>

                        {/* Ground impact line */}
                        <div
                            className={`absolute left-1/2 -translate-x-1/2 bottom-[-12px] h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all ${hasLanded ? "w-[200px] opacity-100" : "w-0 opacity-0"
                                }`}
                            style={{
                                transitionDuration: "300ms",
                                transitionDelay: "100ms",
                            }}
                        />
                    </div>

                    <p
                        className={`text-base text-muted-foreground mt-6 transition-all duration-500 ${hasLanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                            }`}
                        style={{ transitionDelay: "200ms" }}
                    >
                        Built in the open. Every model, workflow, and line of code.
                    </p>
                </div>

                {/* Links - Single Column */}
                <div
                    className={`space-y-3 transition-all duration-500 ${hasLanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                    style={{ transitionDelay: "350ms" }}
                >
                    {links.map((link) => (
                        <a
                            key={link.title}
                            href={link.href}
                            target={link.href.startsWith("http") ? "_blank" : undefined}
                            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all"
                        >
                            {/* Icon */}
                            <div
                                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center shrink-0`}
                            >
                                <link.icon className="w-6 h-6 text-white" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {link.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">{link.description}</p>
                            </div>

                            {/* Arrow */}
                            <svg
                                className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 17L17 7M17 7H7M17 7v10"
                                />
                            </svg>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MobileOpensourceSection;
