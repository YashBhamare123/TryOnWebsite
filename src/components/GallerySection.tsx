import { useState, useRef, useEffect, MouseEvent } from 'react';

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

// Comparison Slider Component
const ComparisonSlider = ({ beforeImage, afterImage }: { beforeImage: string; afterImage: string }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSliderPosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateSliderPosition(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Global mouse up handler
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: globalThis.MouseEvent) => {
      if (isDragging) updateSliderPosition(e.clientX);
    };

    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('mousemove', handleGlobalMouseMove);
    }
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden rounded-2xl"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* After Image (Background - full) */}
      <img
        src={afterImage}
        alt="After"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* Before Image (Foreground - clipped by slider using clip-path) */}
      <img
        src={beforeImage}
        alt="Before"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        draggable={false}
      />

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/80 pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center border border-white/50">
          <div className="flex gap-1">
            <div className="w-0.5 h-5 bg-zinc-400 rounded-full" />
            <div className="w-0.5 h-5 bg-zinc-400 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

const GallerySection = () => {
  const cardHeight = 650;
  const headerOffset = 96;
  const visiblePeek = 50;
  const totalCards = galleryImages.length;

  return (
    <>
      {/* Header Section */}
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

      {/* Stack Reveal Gallery */}
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
              top: `${headerOffset + (index * visiblePeek)}px`,
              zIndex: 10 + index,
              marginBottom: '40vh',
            }}
          >
            <div className="container mx-auto px-6">
              <div
                className="group relative rounded-3xl shadow-2xl transition-all duration-500"
                style={{
                  height: `${cardHeight}px`,
                  boxShadow: '0 -10px 40px -10px rgba(0,0,0,0.15), 0 25px 50px -12px rgba(0,0,0,0.08)',
                }}
              >
                {/* Glassmorphism Background */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden backdrop-blur-xl border border-white/30" style={{ backgroundColor: 'hsla(25, 80%, 70%, 0.25)' }}>
                  <div className="absolute inset-0 grain-overlay-strong rounded-3xl" />
                </div>

                {/* Content - Garment Left, Comparison Right */}
                <div className="absolute inset-0 flex items-end justify-center p-6 md:p-8 pb-8">
                  {/* Demo badge */}
                  <div className="absolute top-5 left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/30 backdrop-blur-sm">
                    <span className="text-zinc-900/60 font-medium text-xs uppercase tracking-widest">
                      Demo {image.id} — {image.title}
                    </span>
                  </div>

                  {/* Two Column Layout: Garment + Comparison Slider */}
                  <div className="flex items-start justify-center gap-12 lg:gap-20">
                    {/* Garment (Left) */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-[300px] h-[450px] md:w-[400px] md:h-[520px] rounded-2xl overflow-hidden shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
                        <img
                          src={image.garment}
                          alt="Garment"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/30 backdrop-blur-sm">
                        <span className="text-zinc-900/60 font-medium text-xs uppercase tracking-widest">Garment</span>
                      </div>
                    </div>

                    {/* Comparison Slider (Right) */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-[300px] h-[450px] md:w-[400px] md:h-[520px] shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
                        <ComparisonSlider
                          beforeImage={image.subject}
                          afterImage={image.output}
                        />
                      </div>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/30 backdrop-blur-sm">
                        <span className="text-zinc-900/60 font-medium text-xs uppercase tracking-widest">Transformation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Minimal spacer */}
        <div style={{ height: `${visiblePeek}px` }} />
      </section>
    </>
  );
};

export default GallerySection;
