'use client';

import { useEffect, useRef, useState } from 'react';

export function useScrollFade(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAboveFold, setIsAboveFold] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Elements already in the viewport on mount get shown instantly —
    // the page-level animation handles their entrance instead.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      setIsAboveFold(true);
      setIsVisible(true);
      return;
    }

    // Below-fold elements use the normal scroll-triggered animation
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible, isAboveFold };
}