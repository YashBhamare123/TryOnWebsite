const techStack = [
    { name: "LangGraph", logo: "https://cdn.simpleicons.org/langchain/1C3C3C" },
    { name: "Groq", logo: "/groq-text.svg" },
    { name: "Modal", logo: "/Modal.svg" },
    { name: "PyTorch", logo: "https://cdn.simpleicons.org/pytorch/EE4C2C" },
    { name: "Hugging Face", logo: "https://cdn.simpleicons.org/huggingface/FFD21E" },
    { name: "Next.js", logo: "https://cdn.simpleicons.org/nextdotjs/white" },
    { name: "Docker", logo: "https://cdn.simpleicons.org/docker/2496ED" },
    { name: "FastAPI", logo: "https://cdn.simpleicons.org/fastapi/009688" },
    { name: "Vercel", logo: "https://cdn.simpleicons.org/vercel/white" },
    { name: "MongoDB", logo: "https://cdn.simpleicons.org/mongodb/47A248" },
    { name: "Cloudinary", logo: "https://cdn.simpleicons.org/cloudinary/3448C5" },
];

const MobileTechStackMarquee = () => {
    return (
        <section className="relative py-12 overflow-hidden border-y border-border/50 bg-gradient-to-b from-secondary/20 to-background">
            {/* Grain overlay */}
            <div className="absolute inset-0 grain-overlay" />

            <div className="relative z-10 container mx-auto px-4 mb-8">
                <p className="text-center text-xs font-semibold text-primary uppercase tracking-[0.15em]">
                    Built With Industry Leaders
                </p>
                <h3 className="text-center text-xl font-display text-foreground mt-2">
                    Powered by the Best
                </h3>
            </div>

            {/* Marquee Container - No fade edges */}
            <div className="relative z-10 overflow-hidden">
                {/* Marquee Track */}
                <div className="flex">
                    <div className="flex animate-marquee-scroll shrink-0">
                        {techStack.map((tech, index) => (
                            <div
                                key={`${tech.name}-${index}-a`}
                                className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl backdrop-blur-md shrink-0"
                                style={{ backgroundColor: 'hsla(25, 50%, 50%, 0.12)' }}
                            >
                                <div className="relative w-8 h-8 flex items-center justify-center">
                                    <img
                                        src={tech.logo}
                                        alt={tech.name}
                                        className="w-full h-full object-contain"
                                        style={{
                                            filter: 'brightness(0) saturate(100%) invert(55%) sepia(95%) saturate(2000%) hue-rotate(356deg) brightness(100%) contrast(101%)'
                                        }}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                                <span className="font-sans font-semibold text-foreground/80 whitespace-nowrap text-xs uppercase tracking-wider">
                                    {tech.name}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex animate-marquee-scroll shrink-0">
                        {techStack.map((tech, index) => (
                            <div
                                key={`${tech.name}-${index}-b`}
                                className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl backdrop-blur-md shrink-0"
                                style={{ backgroundColor: 'hsla(25, 50%, 50%, 0.12)' }}
                            >
                                <div className="relative w-8 h-8 flex items-center justify-center">
                                    <img
                                        src={tech.logo}
                                        alt={tech.name}
                                        className="w-full h-full object-contain"
                                        style={{
                                            filter: 'brightness(0) saturate(100%) invert(55%) sepia(95%) saturate(2000%) hue-rotate(356deg) brightness(100%) contrast(101%)'
                                        }}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                                <span className="font-sans font-semibold text-foreground/80 whitespace-nowrap text-xs uppercase tracking-wider">
                                    {tech.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MobileTechStackMarquee;
