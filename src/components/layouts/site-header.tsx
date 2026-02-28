'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Sun, Moon, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/content/site';
import { mainNav } from '@/content/navigation';
import { MobileNav } from './mobile-nav';
import { LogoContinuousStroke } from '../logo/LogoContinuousStrok';

export function SiteHeader() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track previous pathname so we only delay-close on actual route changes
  const prevPathname = useRef(pathname);

  useEffect(() => setMounted(true), []);

  // ── Close mobile nav on route change with a delay ──
  // The delay lets the new page mount underneath the nav overlay,
  // so the overlay acts as a transition curtain — no flash of old content.
  useEffect(() => {
    if (pathname === prevPathname.current) return; // same page, nothing to do
    prevPathname.current = pathname;

    if (!mobileOpen) return; // nav already closed

    const timer = setTimeout(() => setMobileOpen(false), 150);
    return () => clearTimeout(timer);
  }, [pathname, mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-500',
          scrolled
            ? 'border-b border-border/40 bg-background/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
          {/* ── Logo ── */}
          <Link
            href="/"
            className="shrink-0 text-base font-bold tracking-tight mt-6"
          >
            <LogoContinuousStroke size={28} />
            <span className="text-muted-foreground/25">.</span>
          </Link>

          {/* ── Connecting line ── */}
          <div className="mx-6 hidden h-px flex-1 bg-border/30 md:block" />

          {/* ── Desktop nav ── */}
          <nav className="hidden items-center gap-7 md:flex">
            {mainNav.map(({ label, href }) => {
              const isActive =
                pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'group relative py-1 font-mono text-xs tracking-[0.15em] uppercase transition-colors duration-300',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground/80 hover:text-foreground'
                  )}
                >
                  {label}
                  <span
                    className={cn(
                      'absolute -bottom-0.5 left-0 h-px bg-foreground transition-all duration-300',
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* ── Divider ── */}
          <div className="mx-3 hidden h-3.5 w-px bg-border/30 md:block" />

          {/* ── Actions ── */}
          <div className="ml-auto flex items-center gap-0.5 md:ml-0">
            {siteConfig.cv.show && (
              <a
                href={siteConfig.cv.url}
                download
                className="hidden h-8 w-8 items-center justify-center rounded-md text-muted-foreground/90 transition-colors duration-200 hover:text-foreground sm:flex"
                aria-label="Download CV"
              >
                <Download className="h-3.5 w-3.5" />
              </a>
            )}

            {mounted && (
              <button
                onClick={() =>
                  setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
                }
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground/90 transition-colors duration-200 hover:text-foreground"
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="h-3.5 w-3.5" />
                ) : (
                  <Moon className="h-3.5 w-3.5" />
                )}
              </button>
            )}

            {/* ── Mobile trigger ── */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 hover:text-foreground md:hidden"
              aria-label="Open menu"
            >
              <div className="flex w-3.5 flex-col items-end gap-1.25">
                <span className="block h-[1.5px] w-full bg-current" />
                <span className="block h-[1.5px] w-[60%] bg-current" />
              </div>
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
