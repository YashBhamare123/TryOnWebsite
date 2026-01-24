import { useState, useEffect } from 'react';

/**
 * Custom hook to detect mobile viewport.
 * Returns true when viewport width is less than 768px.
 * Uses matchMedia for efficient detection with resize handling.
 */
export const useMobileDetect = () => {
    const [isMobile, setIsMobile] = useState(() => {
        // Initial check - only runs on client
        if (typeof window !== 'undefined') {
            return window.innerWidth < 768;
        }
        return false;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 767px)');

        const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
            setIsMobile(e.matches);
        };

        // Set initial value
        handleChange(mediaQuery);

        // Listen for changes
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return isMobile;
};

export default useMobileDetect;
