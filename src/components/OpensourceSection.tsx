import { useEffect, useRef, useState } from "react";
import { Github, Box, FileCode } from "lucide-react";

const OpensourceSection = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [hasLanded, setHasLanded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasLanded) {
                        setIsVisible(true);
                        // Delay the "landed" state to allow the drop animation to complete
                        setTimeout(() => {
                            setHasLanded(true);
                        }, 600);
                    }
                });
            },
            { threshold: 0.3 }
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
            description: "Full source code, models, and documentation",
            href: "https://github.com",
            color: "from-zinc-700 to-zinc-900",
        },
        {
            icon: Box,
            title: "ComfyUI Workflows",
            description: "Ready-to-use nodes for your pipelines",
            href: "https://github.com",
            color: "from-primary to-primary-dark",
        },
        {
            icon: FileCode,
            title: "Architecture Docs",
            description: "Deep dive into our technical design",
            href: "/docs",
            color: "from-accent to-accent-light",
        },
    ];

    return (
        <section
            ref={sectionRef}
            className="py-32 relative overflow-hidden bg-background"
        >
            {/* Background grain */}
            <div className="absolute inset-0 grain-overlay pointer-events-none" />

            {/* Subtle glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Impact Title Container */}
                <div className="text-center mb-20 relative">
                    {/* Smoke/Dust particles - appear on land */}
                    <div
                        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${hasLanded ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        {/* Left side smoke particles */}
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={`left-${i}`}
                                className={`absolute w-3 h-3 rounded-full bg-primary/40 blur-sm ${hasLanded ? "animate-smoke-left" : ""
                                    }`}
                                style={{
                                    left: "50%",
                                    top: "60%",
                                    animationDelay: `${i * 50}ms`,
                                    animationDuration: `${800 + i * 100}ms`,
                                }}
                            />
                        ))}
                        {/* Right side smoke particles */}
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={`right-${i}`}
                                className={`absolute w-3 h-3 rounded-full bg-primary/40 blur-sm ${hasLanded ? "animate-smoke-right" : ""
                                    }`}
                                style={{
                                    left: "50%",
                                    top: "60%",
                                    animationDelay: `${i * 50}ms`,
                                    animationDuration: `${800 + i * 100}ms`,
                                }}
                            />
                        ))}
                        {/* Center dust cloud */}
                        <div
                            className={`absolute left-1/2 -translate-x-1/2 top-[70%] w-[600px] h-32 ${hasLanded ? "animate-dust-cloud" : "opacity-0"
                                }`}
                            style={{
                                background:
                                    "radial-gradient(ellipse at center, hsl(24, 100%, 55%, 0.3) 0%, transparent 70%)",
                                filter: "blur(20px)",
                            }}
                        />
                    </div>

                    {/* Impact shockwave ring */}
                    <div
                        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/50 pointer-events-none ${hasLanded ? "animate-shockwave" : "opacity-0 scale-0"
                            }`}
                        style={{ width: "100px", height: "100px" }}
                    />

                    {/* Main Title - Drop animation */}
                    <div className="relative overflow-visible">
                        <h2
                            className={`text-5xl md:text-7xl lg:text-8xl font-display font-bold transition-all ${isVisible
                                    ? hasLanded
                                        ? "translate-y-0 scale-100 opacity-100"
                                        : "translate-y-0 scale-110 opacity-100"
                                    : "-translate-y-[200px] scale-150 opacity-0"
                                }`}
                            style={{
                                transitionDuration: isVisible
                                    ? hasLanded
                                        ? "150ms"
                                        : "500ms"
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
                            className={`absolute left-1/2 -translate-x-1/2 bottom-[-20px] h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all ${hasLanded
                                    ? "w-[400px] opacity-100"
                                    : "w-0 opacity-0"
                                }`}
                            style={{
                                transitionDuration: "400ms",
                                transitionDelay: "100ms",
                            }}
                        />
                    </div>

                    <p
                        className={`text-xl text-muted-foreground mt-8 max-w-2xl mx-auto transition-all duration-700 ${hasLanded
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                            }`}
                        style={{ transitionDelay: "300ms" }}
                    >
                        Built in the open. Every model, every workflow, every line of
                        code—available for you to explore, modify, and improve.
                    </p>
                </div>

                {/* Links Grid */}
                <div
                    className={`grid md:grid-cols-3 gap-6 max-w-5xl mx-auto transition-all duration-700 ${hasLanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                        }`}
                    style={{ transitionDelay: "500ms" }}
                >
                    {links.map((link, index) => (
                        <a
                            key={link.title}
                            href={link.href}
                            target={link.href.startsWith("http") ? "_blank" : undefined}
                            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-2"
                            style={{ transitionDelay: `${600 + index * 100}ms` }}
                        >
                            {/* Icon */}
                            <div
                                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                            >
                                <link.icon className="w-7 h-7 text-white" />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                {link.title}
                            </h3>
                            <p className="text-muted-foreground">{link.description}</p>

                            {/* Arrow indicator */}
                            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                <svg
                                    className="w-5 h-5 text-primary"
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
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OpensourceSection;
