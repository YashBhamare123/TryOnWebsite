const techStack = [
  {
    name: "LangGraph",
    logo: "https://cdn.simpleicons.org/langchain/1C3C3C"
  },
  {
    name: "Groq",
    logo: "/groq-text.svg"
  },
  {
    name: "Modal",
    logo: "/Modal.svg"
  },
  {
    name: "PyTorch",
    logo: "https://cdn.simpleicons.org/pytorch/EE4C2C"
  },
  {
    name: "Hugging Face",
    logo: "https://cdn.simpleicons.org/huggingface/FFD21E"
  },
  {
    name: "Next.js",
    logo: "https://cdn.simpleicons.org/nextdotjs/white"
  },
  {
    name: "Docker",
    logo: "https://cdn.simpleicons.org/docker/2496ED"
  },
  {
    name: "FastAPI",
    logo: "https://cdn.simpleicons.org/fastapi/009688"
  },
  {
    name: "Vercel",
    logo: "https://cdn.simpleicons.org/vercel/white"
  },
  {
    name: "MongoDB",
    logo: "https://cdn.simpleicons.org/mongodb/47A248"
  },
  {
    name: "Cloudinary",
    logo: "https://cdn.simpleicons.org/cloudinary/3448C5"
  },
];

const TechStackMarquee = () => {
  // Triple the items for seamless infinite loop
  const items = [...techStack, ...techStack, ...techStack];

  return (
    <section className="relative py-24 overflow-hidden border-y border-border/50 bg-gradient-to-b from-secondary/20 to-background">
      {/* Grain overlay */}
      <div className="absolute inset-0 grain-overlay" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-6 mb-12">
        <p className="text-center text-sm font-semibold text-primary uppercase tracking-[0.2em]">
          Built With Industry Leaders
        </p>
        <h3 className="text-center text-2xl font-display text-foreground mt-2">
          Powered by the Best
        </h3>
      </div>

      {/* Marquee Container */}
      <div className="relative z-10 overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-background via-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-background via-background to-transparent z-10 pointer-events-none" />

        {/* Marquee Track - Two identical rows for seamless loop */}
        <div className="flex">
          <div className="flex animate-marquee-scroll shrink-0">
            {techStack.map((tech, index) => (
              <div
                key={`${tech.name}-${index}-a`}
                className="group flex items-center gap-5 px-10 py-6 mx-3 rounded-2xl backdrop-blur-md hover:bg-primary/10 transition-all duration-300 cursor-default shrink-0"
                style={{ backgroundColor: 'hsla(25, 50%, 50%, 0.12)' }}
              >
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <img
                    src={tech.logo}
                    alt={tech.name}
                    className="w-full h-full object-contain transition-all duration-300 brightness-0 invert opacity-80 group-hover:opacity-100"
                    style={{
                      filter: 'brightness(0) saturate(100%) invert(55%) sepia(95%) saturate(2000%) hue-rotate(356deg) brightness(100%) contrast(101%)'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <span className="font-sans font-semibold text-foreground/80 group-hover:text-primary whitespace-nowrap text-sm uppercase tracking-widest transition-colors duration-300">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
          <div className="flex animate-marquee-scroll shrink-0">
            {techStack.map((tech, index) => (
              <div
                key={`${tech.name}-${index}-b`}
                className="group flex items-center gap-5 px-10 py-6 mx-3 rounded-2xl backdrop-blur-md hover:bg-primary/10 transition-all duration-300 cursor-default shrink-0"
                style={{ backgroundColor: 'hsla(25, 50%, 50%, 0.12)' }}
              >
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <img
                    src={tech.logo}
                    alt={tech.name}
                    className="w-full h-full object-contain transition-all duration-300 brightness-0 invert opacity-80 group-hover:opacity-100"
                    style={{
                      filter: 'brightness(0) saturate(100%) invert(55%) sepia(95%) saturate(2000%) hue-rotate(356deg) brightness(100%) contrast(101%)'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <span className="font-sans font-semibold text-foreground/80 group-hover:text-primary whitespace-nowrap text-sm uppercase tracking-widest transition-colors duration-300">
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

export default TechStackMarquee;
