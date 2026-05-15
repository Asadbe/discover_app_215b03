import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useApiQuery, extractList } from '@/hooks/useApiQuery';

interface Testimonial {
  guid: string;
  name: string;
  country: string;
  quote: string;
  avatar: string;
  rating: number;
  trip_type: string;
}

const thumbPool = [
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/5d95d322-c703-45ed-a493-59bd32d0948d_img_00.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/40fd313f-ad59-45de-ba07-be9e4b729736_img_01.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/d971479e-455c-4ef4-918a-cf8c9c21b560_img_02.jpg',
];

function getInitials(name: string): string {
  return (name ?? '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);

  const { data, isLoading } = useApiQuery<unknown>(['testimonials'], '/v2/items/testimonials');
  const items = extractList<Testimonial>(data);

  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => {
      setDir(1);
      setIdx((prev) => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(t);
  }, [items.length]);

  const goTo = (newIdx: number) => {
    setDir(newIdx > idx ? 1 : -1);
    setIdx(newIdx);
  };
  const prev = () => { setDir(-1); setIdx((p) => Math.max(0, p - 1)); };
  const next = () => { setDir(1); setIdx((p) => Math.min(items.length - 1, p + 1)); };

  const current = items[idx];

  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-card/60 to-background" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/d971479e-455c-4ef4-918a-cf8c9c21b560_img_02.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-accent text-xs tracking-[0.2em] uppercase mb-3">Traveler Stories</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Words from the Road
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="h-64 rounded-2xl bg-card animate-pulse" />
        ) : current ? (
          <div className="relative min-h-[320px] flex items-center justify-center">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={current.guid ?? idx}
                custom={dir}
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.5 }}
                className="text-center px-4"
              >
                {/* Decorative quote */}
                <Quote className="h-16 w-16 text-accent/20 mx-auto mb-6" />

                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: Math.min(5, Math.max(0, Number(current.rating ?? 5))) }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg sm:text-xl text-foreground/90 italic leading-relaxed max-w-2xl mx-auto mb-8">
                  &ldquo;{current.quote ?? '—'}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarImage
                      src={current.avatar ?? thumbPool[idx % thumbPool.length]}
                      alt={current.name ?? 'Traveler'}
                    />
                    <AvatarFallback>{getInitials(current.name ?? 'TN')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-foreground font-semibold">{current.name ?? '—'}</p>
                    <p className="text-muted-foreground text-sm">{current.country ?? '—'}</p>
                    {current.trip_type && (
                      <span className="inline-block mt-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs">
                        {current.trip_type ?? '—'}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : null}

        {/* Controls */}
        {items.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prev}
              disabled={idx === 0}
              className="w-11 h-11 flex items-center justify-center rounded-full border border-border/40 text-muted-foreground hover:text-accent hover:border-accent/40 transition-colors disabled:opacity-30"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === idx ? 'w-6 h-2 bg-accent' : 'w-2 h-2 bg-border hover:bg-muted-foreground'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              disabled={idx === items.length - 1}
              className="w-11 h-11 flex items-center justify-center rounded-full border border-border/40 text-muted-foreground hover:text-accent hover:border-accent/40 transition-colors disabled:opacity-30"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
