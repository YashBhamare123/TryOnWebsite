import { useState, useRef, TouchEvent } from 'react';
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

const imageTypes = ['garment', 'subject', 'output'] as const;
const imageLabels = { garment: 'Garment', subject: 'Subject', output: 'Output' };

const MobileGallerySection = () => {
    const [activeDemo, setActiveDemo] = useState(0);
    const [cardOrder, setCardOrder] = useState([0, 1, 2]); // Stack order: [top, middle, bottom]
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const touchStartX = useRef(0);
    const containerWidth = useRef(300);

    const currentDemo = galleryImages[activeDemo];
    const topCardIndex = cardOrder[0];

    const handleTouchStart = (e: TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        containerWidth.current = (e.currentTarget as HTMLElement).offsetWidth;
        setIsDragging(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - touchStartX.current;
        setDragOffset(diff);
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;

        const threshold = containerWidth.current * 0.15;

        if (Math.abs(dragOffset) > threshold) {
            // Move top card to bottom of stack
            setCardOrder(prev => [prev[1], prev[2], prev[0]]);
        }

        setDragOffset(0);
        setIsDragging(false);
    };

    const handlePrevDemo = () => {
        setActiveDemo((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
        setCardOrder([0, 1, 2]);
    };

    const handleNextDemo = () => {
        setActiveDemo((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
        setCardOrder([0, 1, 2]);
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
                                    onClick={() => { setActiveDemo(index); setCardOrder([0, 1, 2]); }}
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

            {/* Stacked Cards with Infinite Swipe */}
            <section
                className="relative pb-12"
                style={{ background: 'linear-gradient(180deg, hsl(26, 90%, 91%) 0%, hsl(24, 85%, 88%) 100%)' }}
            >
                <div className="container mx-auto px-4">
                    {/* Stacked Image Container */}
                    <div
                        className="relative mx-auto max-w-sm aspect-[3/4] touch-pan-y"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Render cards in stack order (reversed so first in array is on top) */}
                        {[...cardOrder].reverse().map((typeIndex, stackPosition) => {
                            const type = imageTypes[typeIndex];
                            const isTopCard = stackPosition === 2; // Last rendered = on top
                            const stackOffset = (2 - stackPosition) * 4; // Slight offset for stacked effect

                            return (
                                <div
                                    key={type}
                                    className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl"
                                    style={{
                                        zIndex: stackPosition + 1,
                                        transform: isTopCard && isDragging
                                            ? `translateX(${dragOffset}px) rotate(${dragOffset * 0.03}deg)`
                                            : `translateY(${stackOffset}px) scale(${1 - stackOffset * 0.01})`,
                                        transition: isDragging && isTopCard ? 'none' : 'transform 0.3s ease-out',
                                        backgroundColor: 'hsla(25, 80%, 70%, 0.25)',
                                    }}
                                >
                                    <img
                                        src={currentDemo[type]}
                                        alt={imageLabels[type]}
                                        className="w-full h-full object-cover"
                                        draggable={false}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Image Type Label */}
                    <div className="text-center mt-4">
                        <span className="text-lg font-semibold text-zinc-900 uppercase tracking-widest">
                            {imageLabels[imageTypes[topCardIndex]]}
                        </span>
                    </div>

                    {/* Image Type Dots */}
                    <div className="flex justify-center gap-2 mt-3">
                        {imageTypes.map((type, index) => (
                            <button
                                key={type}
                                onClick={() => setCardOrder([index, (index + 1) % 3, (index + 2) % 3])}
                                className={`h-2 rounded-full transition-all duration-300 ${topCardIndex === index ? 'bg-zinc-900 w-5' : 'bg-zinc-400 w-2'
                                    }`}
                                aria-label={`View ${imageLabels[type]}`}
                            />
                        ))}
                    </div>

                    <p className="text-center text-zinc-500 text-xs mt-3">
                        Swipe to cycle through images
                    </p>
                </div>
            </section>
        </>
    );
};

export default MobileGallerySection;
