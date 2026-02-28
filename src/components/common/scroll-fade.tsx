'use client';

import { cn } from '@/lib/utils';
import { useScrollFade } from '@/hooks/use-scroll-fade';
import type { ReactNode, CSSProperties } from 'react';

interface ScrollFadeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollFade({ children, className, delay = 0 }: ScrollFadeProps) {
  const { ref, isVisible, isAboveFold } = useScrollFade(0.1);

  return (
    <div
      ref={ref}
      className={cn(
        'scroll-fade',
        isVisible && 'visible',
        isAboveFold && 'scroll-fade-instant',
        className
      )}
      style={
        // Only apply stagger delay to scroll-triggered (below-fold) elements
        !isAboveFold ? ({ '--delay': `${delay}ms` } as CSSProperties) : undefined
      }
    >
      {children}
    </div>
  );
}


// 'use client';

// import { cn } from '@/lib/utils';
// import { useScrollFade } from '@/hooks/use-scroll-fade';
// import type { ReactNode, CSSProperties } from 'react';

// interface ScrollFadeProps {
//   children: ReactNode;
//   className?: string;
//   delay?: number;
// }

// export function ScrollFade({ children, className, delay = 0 }: ScrollFadeProps) {
//   const { ref, isVisible } = useScrollFade(0.1);

//   return (
//     <div
//       ref={ref}
//       className={cn('scroll-fade', isVisible && 'visible', className)}
//       style={{ '--delay': `${delay}ms` } as CSSProperties}
//     >
//       {children}
//     </div>
//   );
// }