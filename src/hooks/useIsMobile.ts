import { useState, useEffect } from 'react';

/**
 * Custom hook to detect mobile viewport
 * Returns true if viewport width is less than 768px
 */
export const useIsMobile = (breakpoint: number = 768): boolean => {
    const [isMobile, setIsMobile] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < breakpoint;
        }
        return false;
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isMobile;
};

export default useIsMobile;
