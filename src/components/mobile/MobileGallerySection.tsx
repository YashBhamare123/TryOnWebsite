import { useState, useRef, TouchEvent, MouseEvent, useCallback, useEffect } from 'react';
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
    const handleRef = useRef<HTMLDivElement>(null);

    // Touch tracking refs for vertical scroll detection
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);
    const isHorizontalSwipeRef = useRef<boolean | null>(null);
    const rafRef = useRef<number | null>(null);

    const currentDemo = galleryImages[activeDemo];

    // Preload adjacent images for smooth navigation
    useEffect(() => {
        const preloadImage = (src: string) => {
            const img = new Image();
            img.src = src;
        };

        // Preload next and previous demo images
        const nextIndex = (activeDemo + 1) % galleryImages.length;
        const prevIndex = (activeDemo - 1 + galleryImages.length) % galleryImages.length;

        const nextDemo = galleryImages[nextIndex];
        const prevDemo = galleryImages[prevIndex];

        // Preload all images for next/prev demos
        [nextDemo, prevDemo].forEach(demo => {
            preloadImage(demo.garment);
            preloadImage(demo.subject);
            preloadImage(demo.output);
        });
    }, [activeDemo]);

    // Prevent page scroll when dragging slider - uses native event with passive: false
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const preventScroll = (e: globalThis.TouchEvent) => {
            // Check if we're in horizontal drag mode
            if (isHorizontalSwipeRef.current === true) {
                e.preventDefault();
            }
        };

        // Add with passive: false to allow preventDefault
        container.addEventListener('touchmove', preventScroll, { passive: false });

        return () => {
            container.removeEventListener('touchmove', preventScroll);
        };
    }, []);

    // Check if touch is near the slider handle
    const isTouchNearHandle = (clientX: number): boolean => {
        if (!containerRef.current) return false;
        const rect = containerRef.current.getBoundingClientRect();
        const handleX = rect.left + (rect.width * sliderPosition / 100);
        const distance = Math.abs(clientX - handleX);
        return distance < 50; // 50px threshold for easier touch
    };

    // Smooth position update using RAF
    const updateSliderPosition = useCallback((clientX: number) => {
        if (!containerRef.current) return;

        // Cancel any pending RAF
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        rafRef.current = requestAnimationFrame(() => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            setSliderPosition(percentage);
        });
    }, []);

    const handleTouchStart = (e: TouchEvent) => {
        const touch = e.touches[0];

        // Only consider if touching near the handle
        if (!isTouchNearHandle(touch.clientX)) return;

        // Store initial touch position for direction detection
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        isHorizontalSwipeRef.current = null; // Reset direction detection
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!touchStartRef.current) return;

        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
        const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

        // Determine swipe direction if not yet determined
        if (isHorizontalSwipeRef.current === null) {
            // Need at least 10px movement to determine direction
            if (deltaX > 10 || deltaY > 10) {
                // Horizontal if X movement is significantly greater than Y (1.5x ratio)
                isHorizontalSwipeRef.current = deltaX > deltaY * 1.5;

                if (isHorizontalSwipeRef.current) {
                    setIsDragging(true);
                }
            }
        }

        // Only handle horizontal swipe (slider movement)
        if (isHorizontalSwipeRef.current === true) {
            e.preventDefault();
            e.stopPropagation();
            updateSliderPosition(touch.clientX);
        }
        // If vertical, do nothing - let the page scroll naturally
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        touchStartRef.current = null;
        isHorizontalSwipeRef.current = null;

        // Cancel any pending RAF
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    };

    const handleMouseDown = (e: MouseEvent) => {
        if (!isTouchNearHandle(e.clientX)) return;
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
                                loading="eager"
                                decoding="async"
                                fetchPriority="high"
                            />
                        ) : (
                            // Comparison Slider View - allows scroll, only handle is interactive
                            <div
                                ref={containerRef}
                                className="relative w-full h-full select-none"
                                style={{ touchAction: isDragging ? 'none' : 'pan-y' }}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                {/* Output Image (Background - full) */}
                                <img
                                    src={currentDemo.output}
                                    alt="Output"
                                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                    draggable={false}
                                    loading="eager"
                                    decoding="async"
                                    fetchPriority="high"
                                />

                                {/* Subject Image (Foreground - clipped by slider using clip-path) */}
                                <img
                                    src={currentDemo.subject}
                                    alt="Subject"
                                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                    style={{
                                        clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                                        willChange: isDragging ? 'clip-path' : 'auto',
                                        transition: isDragging ? 'none' : 'clip-path 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                    draggable={false}
                                    loading="eager"
                                    decoding="async"
                                    fetchPriority="high"
                                />

                                {/* Slider Divider Line */}
                                <div
                                    ref={handleRef}
                                    className="absolute top-0 bottom-0 pointer-events-none"
                                    style={{
                                        left: `${sliderPosition}%`,
                                        transform: 'translateX(-50%)',
                                        width: '2px',
                                        background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.95) 15%, rgba(255,255,255,0.95) 85%, transparent 100%)',
                                        boxShadow: '0 0 8px rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.1)',
                                        willChange: isDragging ? 'left' : 'auto',
                                        transition: isDragging ? 'none' : 'left 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                >
                                    {/* Handle Circle */}
                                    <div
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.92)',
                                            border: '1px solid rgba(255, 255, 255, 0.7)',
                                            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)'
                                        }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.5 5L3.5 10L7.5 15" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12.5 5L16.5 10L12.5 15" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Drag hint - only show when not dragging */}
                                {!isDragging && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm">
                                        <span className="text-white text-xs font-medium">Drag handle to compare</span>
                                    </div>
                                )}
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
