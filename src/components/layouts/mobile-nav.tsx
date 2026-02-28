'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { X, Sun, Moon, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/content/site';
import { mainNav } from '@/content/navigation';
import { SocialLinks } from '@/components/common';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex flex-col bg-background',
        'transition-opacity duration-500 ease-in-out',
        open ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
      aria-hidden={!open}
    >
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 pt-5 pb-2">
        <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground/60 uppercase select-none">
          Navigation
        </span>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ── Links ── */}
      <nav className="flex flex-1 flex-col justify-center overflow-y-auto px-8 sm:px-12">
        {mainNav.map(({ label, href }, i) => {
          const isActive =
            pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={() => {
                // Only close immediately when tapping the already-active page
                // (pathname won't change, so the header effect won't fire).
                if (isActive) onClose();
                // For new-page navigation: do nothing here.
                // SiteHeader will close the nav after the route change,
                // keeping the overlay as a transition curtain.
              }}
              className={cn(
                'group flex items-baseline gap-5 border-b border-border/20 py-5',
                'transition-all duration-500 ease-out',
                open
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-6 opacity-0'
              )}
              style={{
                transitionDelay: open ? `${100 + i * 70}ms` : '0ms',
              }}
            >
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground/20 transition-colors group-hover:text-muted-foreground/50">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={cn(
                  'text-3xl font-bold leading-tight tracking-tight transition-colors sm:text-4xl',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground/60 group-hover:text-foreground'
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom bar ── */}
      <div
        className={cn(
          'border-t border-border/20 px-6 py-5',
          'transition-all duration-500 ease-out',
          open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
        style={{
          transitionDelay: open
            ? `${100 + mainNav.length * 70 + 50}ms`
            : '0ms',
        }}
      >
        <div className="flex items-center justify-between">
          <SocialLinks />
          <div className="flex items-center gap-1">
            {siteConfig.cv.show && (
              <a
                href={siteConfig.cv.url}
                download
                className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground/50 transition-colors hover:text-foreground"
                aria-label={siteConfig.cv.label}
              >
                <Download className="h-4 w-4" />
              </a>
            )}
            {mounted && (
              <button
                onClick={() =>
                  setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
                }
                className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground/50 transition-colors hover:text-foreground"
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
