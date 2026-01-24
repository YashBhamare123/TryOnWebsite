import { useState, useRef, TouchEvent, MouseEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const galleryImages = [
    {
        id: 1,
        title: "Full Body Try-On",
        garment: "/demo_section/full/0_gar_processed_by_imagy.png",
        subject: "/demo_section/full/0_processed_by_imagy.png",
        output: "/demo_section/full/0.png",
    },
    {
        id: 2,
        title: "Casual Wear",
        garment: "/demo_section/full/1_gar_processed_by_imagy.png",
        subject: "/demo_section/full/1_processed_by_imagy.png",
        output: "/demo_section/full/1.png",
    },
    {
        id: 3,
        title: "Logo Detection",
        garment: "/demo_section/logos/0_gar_processed_by_imagy.png",
        subject: "/demo_section/logos/0_processed_by_imagy.png",
        output: "/demo_section/logos/0.png",
    },
    {
        id: 4,
        title: "Pose Adaptation",
        garment: "/demo_section/poses/1_gar_processed_by_imagy.png",
        subject: "/demo_section/poses/1_processed_by_imagy.png",
        output: "/demo_section/poses/1.png",
    },
];

type ViewMode = 'garment' | 'comparison';

const MobileGallerySection = () => {
    const [activeDemo, setActiveDemo] = useState(0);
    const [viewMode, setViewMode] = useState<ViewMode>('comparison');
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const currentDemo = galleryImages[activeDemo];

    // Handle slider drag
    const updateSliderPosition = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPosition(percentage);
    };

    const handleTouchStart = (e: TouchEvent) => {
        e.stopPropagation();
        setIsDragging(true);
        updateSliderPosition(e.touches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        e.stopPropagation();
        updateSliderPosition(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: TouchEvent) => {
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        updateSliderPosition(e.clientX);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        updateSliderPosition(e.clientX);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handlePrevDemo = () => {
        setActiveDemo((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
        setSliderPosition(50);
    };

    const handleNextDemo = () => {
        setActiveDemo((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
        setSliderPosition(50);
    };

    return (
        <>
            {/* Header Section */}
            <section
                className="relative pt-20 pb-4"
                style={{ background: 'linear-gradient(180deg, hsl(28, 95%, 94%) 0%, hsl(26, 90%, 91%) 100%)' }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[hsl(24,100%,65%)]/25 blur-3xl pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center">
                        <span className="text-primary-dark font-medium text-xs uppercase tracking-widest mb-2 block">
                            Showcase
                        </span>
                        <h2 className="text-3xl font-display font-bold text-zinc-900 mb-4">
                            See It In <span className="text-primary">Action</span>
                        </h2>
                    </div>

                    {/* Demo Navigation */}
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={handlePrevDemo}
                            className="w-8 h-8 rounded-full bg-zinc-900/10 hover:bg-zinc-900/20 flex items-center justify-center transition-colors"
                            aria-label="Previous demo"
                        >
                            <ChevronLeft className="w-4 h-4 text-zinc-700" />
                        </button>

                        <div className="flex gap-1.5">
                            {galleryImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => { setActiveDemo(index); setSliderPosition(50); }}
                                    className={`h-2 rounded-full transition-all duration-300 ${activeDemo === index ? 'bg-zinc-900 w-5' : 'bg-zinc-400 w-2'
                                        }`}
                                    aria-label={`Demo ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNextDemo}
                            className="w-8 h-8 rounded-full bg-zinc-900/10 hover:bg-zinc-900/20 flex items-center justify-center transition-colors"
                            aria-label="Next demo"
                        >
                            <ChevronRight className="w-4 h-4 text-zinc-700" />
                        </button>
                    </div>

                    <p className="text-center text-zinc-700 text-sm font-semibold uppercase tracking-widest mt-3">
                        {currentDemo.title}
                    </p>
                </div>
            </section>

            {/* Image Viewer Section */}
            <section
                className="relative pb-12"
                style={{ background: 'linear-gradient(180deg, hsl(26, 90%, 91%) 0%, hsl(24, 85%, 88%) 100%)' }}
            >
                <div className="container mx-auto px-4">
                    {/* Image Container */}
                    <div className="relative mx-auto max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                        {viewMode === 'garment' ? (
                            // Garment View
                            <img
                                src={currentDemo.garment}
                                alt="Garment"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            // Comparison Slider View
                            <div
                                ref={containerRef}
                                className="relative w-full h-full select-none touch-none"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                            >
                                {/* Output Image (Background - full) */}
                                <img
                                    src={currentDemo.output}
                                    alt="Output"
                                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                    draggable={false}
                                />

                                {/* Subject Image (Foreground - clipped by slider using clip-path) */}
                                <img
                                    src={currentDemo.subject}
                                    alt="Subject"
                                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                                    draggable={false}
                                />

                                {/* Slider Handle */}
                                <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-white/80 pointer-events-none"
                                    style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                                >
                                    {/* Handle Circle */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center border border-white/50">
                                        <div className="flex gap-0.5">
                                            <div className="w-0.5 h-4 bg-zinc-400 rounded-full" />
                                            <div className="w-0.5 h-4 bg-zinc-400 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* View Mode Toggle - Glassy Style */}
                    <div className="flex justify-center gap-3 mt-4">
                        <button
                            onClick={() => setViewMode('garment')}
                            className={`px-3 py-1.5 rounded-full backdrop-blur-sm transition-all duration-300 ${viewMode === 'garment'
                                    ? 'bg-zinc-900/20'
                                    : 'bg-white/30 hover:bg-white/40'
                                }`}
                        >
                            <span className="text-zinc-900/60 font-medium text-xs uppercase tracking-widest">Garment</span>
                        </button>
                        <button
                            onClick={() => setViewMode('comparison')}
                            className={`px-3 py-1.5 rounded-full backdrop-blur-sm transition-all duration-300 ${viewMode === 'comparison'
                                    ? 'bg-zinc-900/20'
                                    : 'bg-white/30 hover:bg-white/40'
                                }`}
                        >
                            <span className="text-zinc-900/60 font-medium text-xs uppercase tracking-widest">Transformation</span>
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default MobileGallerySection;
