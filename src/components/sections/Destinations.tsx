import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useApiQuery, extractList } from '@/hooks/useApiQuery';

interface Destination {
  guid: string;
  name: string;
  region: string;
  description: string;
  image: string;
  latitude: string;
  longitude: string;
  highlight: string;
  is_featured: boolean;
}

const thumbPool = [
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/5d95d322-c703-45ed-a493-59bd32d0948d_img_00.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/40fd313f-ad59-45de-ba07-be9e4b729736_img_01.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/d971479e-455c-4ef4-918a-cf8c9c21b560_img_02.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/40bcb178-2ccc-40be-aaae-8f7abd38fcef_img_03.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/6f0ddbba-4ac5-4829-aa1c-3980a8a150bf_img_04.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/1377d714-acba-42ca-89df-5f36fa194773_img_05.jpg',
];

export default function Destinations() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const { data, isLoading } = useApiQuery<unknown>(['destinations'], '/v2/items/destinations');
  const items = extractList<Destination>(data);

  const scroll = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const cardW = 420;
    const newIdx = dir === 'right'
      ? Math.min(activeIdx + 1, Math.max(0, items.length - 1))
      : Math.max(activeIdx - 1, 0);
    setActiveIdx(newIdx);
    carouselRef.current.scrollTo({ left: newIdx * (cardW + 16), behavior: 'smooth' });
  };

  return (
    <section id="destinations" className="py-24 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-accent text-xs tracking-[0.2em] uppercase mb-2">Iconic Places</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
              Explore Iconic<br />Destinations
            </h2>
            <div className="w-16 h-1 bg-accent rounded-full mt-4" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-muted-foreground max-w-sm text-sm leading-relaxed"
          >
            From the mystical Milford Sound to the geothermal wonders of Rotorua, each destination is a world unto itself.
          </motion.p>
        </div>

        {/* Carousel */}
        {isLoading ? (
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[320px] sm:w-[400px] h-[500px] rounded-2xl bg-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto pb-4 carousel-container scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((item, i) => (
              <div
                key={item.guid}
                className="carousel-item relative flex-shrink-0 w-[320px] sm:w-[400px] h-[480px] sm:h-[520px] rounded-2xl overflow-hidden group cursor-pointer hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,229,160,0.15)]"
              >
                <img
                  src={item.image ?? thumbPool[i % thumbPool.length]}
                  alt={item.name ?? 'Destination'}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.style.background = 'linear-gradient(135deg,hsl(var(--muted)),hsl(var(--accent)/0.2))';
                    }
                  }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  {item.highlight && (
                    <Badge className="mb-3 text-xs">{item.highlight ?? '—'}</Badge>
                  )}
                  <h3 className="text-xl font-bold text-foreground mb-1">{item.name ?? '—'}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="h-3 w-3" />
                    <span>{item.region ?? '—'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                className={`transition-all duration-300 rounded-full ${
                  i === activeIdx ? 'w-6 h-2 bg-accent' : 'w-2 h-2 bg-border hover:bg-muted-foreground'
                }`}
                onClick={() => {
                  setActiveIdx(i);
                  if (carouselRef.current) {
                    carouselRef.current.scrollTo({ left: i * (420 + 16), behavior: 'smooth' });
                  }
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-11 h-11 flex items-center justify-center rounded-full border border-border/40 text-muted-foreground hover:text-accent hover:border-accent/40 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-11 h-11 flex items-center justify-center rounded-full border border-border/40 text-muted-foreground hover:text-accent hover:border-accent/40 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
