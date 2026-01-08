import { ArrowUpRight } from "lucide-react";

const galleryImages = [
  {
    id: 1,
    title: "Full Body Try-On",
    description: "Seamless garment overlay with precise segmentation",
    color: "bg-gradient-to-br from-[hsl(24,95%,78%)] to-[hsl(28,90%,85%)]",
    garment: "/demo_section/full/0_gar_processed_by_imagy.png",
    subject: "/demo_section/full/0_processed_by_imagy.png",
    output: "/demo_section/full/0.png",
  },
  {
    id: 2,
    title: "Casual Wear",
    description: "Natural draping and texture preservation",
    color: "bg-gradient-to-br from-[hsl(26,92%,80%)] to-[hsl(30,88%,86%)]",
    garment: "/demo_section/full/1_gar_processed_by_imagy.png",
    subject: "/demo_section/full/1_processed_by_imagy.png",
    output: "/demo_section/full/1.png",
  },
  {
    id: 3,
    title: "Logo Detection",
    description: "Intelligent logo detection and placement",
    color: "bg-gradient-to-br from-[hsl(22,90%,76%)] to-[hsl(26,92%,83%)]",
    garment: "/demo_section/logos/0_gar_processed_by_imagy.png",
    subject: "/demo_section/logos/0_processed_by_imagy.png",
    output: "/demo_section/logos/0.png",
  },
  {
    id: 4,
    title: "Pose Adaptation",
    description: "Accurate fitting across different poses",
    color: "bg-gradient-to-br from-[hsl(25,94%,79%)] to-[hsl(29,90%,85%)]",
    garment: "/demo_section/poses/1_gar_processed_by_imagy.png",
    subject: "/demo_section/poses/1_processed_by_imagy.png",
    output: "/demo_section/poses/1.png",
  },
];

const GallerySection = () => {
  const cardHeight = 650;
  const headerOffset = 96; // 6rem for navbar
  const visiblePeek = 50; // Amount of previous card that stays visible
  const totalCards = galleryImages.length;
  // Calculate exact spacer needed: just enough for last card to stick
  const lastCardStickyTop = headerOffset + ((totalCards - 1) * visiblePeek);

  return (
    <>
      {/* Header Section - Light orange background shift */}
      <section data-section="gallery-header" className="relative pt-32 pb-16" style={{ background: 'linear-gradient(180deg, hsl(28, 95%, 94%) 0%, hsl(26, 90%, 91%) 100%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[hsl(24,100%,65%)]/25 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-primary-dark font-medium text-sm uppercase tracking-widest mb-4 block">
              Showcase
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-zinc-900 mb-6">
              See It In{" "}
              <span className="text-primary">Action</span>
            </h2>
            <p className="text-zinc-700 text-lg">
              Experience the precision and quality of our virtual try-on technology
              through these demonstrations.
            </p>
          </div>
        </div>
      </section>

      {/* Stack Reveal Gallery - Cards stack as you scroll */}
      <section
        data-section="gallery"
        className="relative"
        style={{ background: 'linear-gradient(180deg, hsl(26, 90%, 91%) 0%, hsl(24, 85%, 88%) 100%)' }}
      >
        {galleryImages.map((image, index) => (
          <div
            key={image.id}
            className="sticky w-full"
            style={{
              // Each card sticks at a position that leaves previous cards peeking
              // First card: sticks at headerOffset
              // Second card: sticks at headerOffset + visiblePeek (so first card peeks)
              // Third card: sticks at headerOffset + 2*visiblePeek (so first two peek)
              top: `${headerOffset + (index * visiblePeek)}px`,
              zIndex: 10 + index,
              // Add margin to create scroll distance between cards
              // This ensures cards start separated and stack as you scroll
              marginBottom: '40vh',
            }}
          >
            <div className="container mx-auto px-6">
              <div
                className="group relative rounded-3xl cursor-pointer shadow-2xl transition-all duration-500"
                style={{
                  height: `${cardHeight}px`,
                  // Add subtle shadow to emphasize stacking
                  boxShadow: '0 -10px 40px -10px rgba(0,0,0,0.15), 0 25px 50px -12px rgba(0,0,0,0.08)',
                }}
              >
                {/* Glassmorphism Background */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden backdrop-blur-xl border border-white/30" style={{ backgroundColor: 'hsla(25, 80%, 70%, 0.25)' }}>
                  <div className="absolute inset-0 grain-overlay-strong rounded-3xl" />
                </div>

                {/* Content - Images Only, Centered */}
                <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8">
                  {/* Demo badge */}
                  <div className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm">
                    <span className="text-zinc-900/60 font-medium text-xs uppercase tracking-widest">
                      Demo {image.id} — {image.title}
                    </span>
                  </div>

                  {/* Demo Images - Garment, Subject, Output */}
                  <div className="flex items-end justify-center gap-8 md:gap-16 lg:gap-20">
                    {/* Garment */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-[280px] h-[420px] md:w-[320px] md:h-[480px] rounded-2xl overflow-hidden shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
                        <img
                          src={image.garment}
                          alt="Garment"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-base font-semibold text-zinc-900/70 uppercase tracking-widest">Garment</span>
                    </div>

                    {/* Subject */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-[280px] h-[420px] md:w-[320px] md:h-[480px] rounded-2xl overflow-hidden shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
                        <img
                          src={image.subject}
                          alt="Subject"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-base font-semibold text-zinc-900/70 uppercase tracking-widest">Subject</span>
                    </div>

                    {/* Output */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-[280px] h-[420px] md:w-[320px] md:h-[480px] rounded-2xl overflow-hidden shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
                        <img
                          src={image.output}
                          alt="Output"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-base font-semibold text-zinc-900/70 uppercase tracking-widest">Output</span>
                    </div>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <ArrowUpRight className="w-6 h-6 text-zinc-900/70" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Minimal spacer - scroll ends immediately when last card sticks */}
        <div style={{ height: `${visiblePeek}px` }} />
      </section>
    </>
  );
};

export default GallerySection;
