'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Home page hero should appear instantly — no fade/shift.
  // ScrollFade handles individual section entrances there.
  if (pathname === '/') {
    return <>{children}</>;
  }

  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}