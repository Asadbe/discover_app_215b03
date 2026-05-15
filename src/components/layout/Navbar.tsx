import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useScrollPosition } from '@/hooks/useScrollPosition';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const scrolled = useScrollPosition(40);

  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', update);
    return () => window.removeEventListener('scroll', update);
  }, []);

  const links = [
    { label: 'Destinations', href: '#destinations' },
    { label: 'Experiences', href: '#experiences' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Stories', href: '#testimonials' },
  ];

  return (
    <>
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-primary to-accent z-[100] transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'backdrop-blur-xl bg-background/70 border-b border-border/40 shadow-lg'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group">
              <span
                className="font-bold text-xl tracking-wide transition-colors duration-300"
                style={{ fontFamily: 'var(--font-heading)', color: scrolled ? 'var(--color-accent)' : '#ffffff' }}
              >
                Discover
              </span>
              <span
                className="font-bold text-xl tracking-wide transition-colors duration-300"
                style={{ fontFamily: 'var(--font-heading)', color: scrolled ? 'var(--color-foreground)' : '#ffffff' }}
              >
                NZ
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className={cn(
                    'text-sm transition-colors duration-300 relative group',
                    scrolled
                      ? 'text-muted-foreground hover:text-foreground'
                      : 'text-white hover:text-white/80'
                  )}
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex">
              <Button
                size="sm"
                className={cn(
                  'rounded-full px-5 text-xs font-semibold tracking-wide transition-all duration-300',
                  !scrolled && 'bg-white text-gray-900 hover:bg-white/90'
                )}
              >
                Book Now
              </Button>
            </div>

            {/* Hamburger */}
            <button
              className={cn(
                'md:hidden p-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center',
                scrolled ? 'text-foreground hover:text-accent' : 'text-white hover:text-white/80'
              )}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border/40 p-6 flex flex-col gap-5 md:hidden">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-foreground hover:text-accent transition-colors text-lg font-medium min-h-[44px] flex items-center"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Button className="rounded-full mt-2 w-full">Book Now</Button>
          </div>
        )}
      </nav>
    </>
  );
}
