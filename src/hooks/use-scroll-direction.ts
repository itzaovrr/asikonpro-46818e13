import { useState, useEffect, useCallback } from 'react';

interface ScrollDirectionResult {
  scrollDirection: 'up' | 'down' | null;
  isScrolled: boolean;
  scrollY: number;
}

export function useScrollDirection(threshold = 10): ScrollDirectionResult {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);

  const updateScrollDirection = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    if (Math.abs(currentScrollY - lastScrollY) < threshold) {
      return;
    }

    const direction = currentScrollY > lastScrollY ? 'down' : 'up';
    
    if (direction !== scrollDirection) {
      setScrollDirection(direction);
    }

    setScrollY(currentScrollY);
    setLastScrollY(currentScrollY);
  }, [lastScrollY, scrollDirection, threshold]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollDirection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [updateScrollDirection]);

  return {
    scrollDirection,
    isScrolled: scrollY > 0,
    scrollY,
  };
}
