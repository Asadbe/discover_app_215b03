import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApiQuery, extractList } from '@/hooks/useApiQuery';

interface GalleryPhoto {
  guid: string;
  title: string;
  image: string;
  caption: string;
  category: string;
  sort_order: number;
}

const thumbPool = [
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/5d95d322-c703-45ed-a493-59bd32d0948d_img_00.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/40fd313f-ad59-45de-ba07-be9e4b729736_img_01.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/d971479e-455c-4ef4-918a-cf8c9c21b560_img_02.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/40bcb178-2ccc-40be-aaae-8f7abd38fcef_img_03.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/6f0ddbba-4ac5-4829-aa1c-3980a8a150bf_img_04.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/1377d714-acba-42ca-89df-5f36fa194773_img_05.jpg',
];

const CATEGORIES = ['All', 'Landscapes', 'Culture', 'Attractions', 'Beaches', 'Wildlife'];

export default function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const { data, isLoading } = useApiQuery<unknown>(['gallery_photos'], '/v2/items/gallery_photos');
  const items = extractList<GalleryPhoto>(data);

  const filtered = activeCategory === 'All'
    ? items
    : items.filter((p) => (p.category ?? '').toLowerCase() === activeCategory.toLowerCase());

  const lightboxItems = filtered;

  const goPrev = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx(Math.max(0, lightboxIdx - 1));
  };
  const goNext = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx(Math.min(lightboxItems.length - 1, lightboxIdx + 1));
  };

  return (
    <section id="gallery" className="py-24 px-4 sm:px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-accent text-xs tracking-[0.2em] uppercase mb-3">Visual Journey</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight mb-6">
            Through the Lens
          </h2>
          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-h-[44px] ${
                  activeCategory === cat
                    ? 'bg-accent text-accent-foreground shadow-[0_0_16px_hsl(var(--accent)/0.4)]'
                    : 'border border-border/40 text-muted-foreground hover:border-accent/40 hover:text-accent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Masonry Grid */}
        {isLoading ? (
          <div className="masonry-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="masonry-item rounded-xl bg-card animate-pulse" style={{ height: `${200 + (i % 3) * 80}px` }} />
            ))}
          </div>
        ) : (
          <div className="masonry-grid">
            {filtered.map((photo, i) => (
              <motion.div
                key={photo.guid}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: (i % 6) * 0.08 }}
                className="masonry-item group relative rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setLightboxIdx(i)}
              >
                <img
                  src={photo.image ?? thumbPool[i % thumbPool.length]}
                  alt={photo.title ?? 'Gallery photo'}
                  loading="lazy"
                  className="w-full object-cover block group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.style.background = 'linear-gradient(135deg,hsl(var(--muted)),hsl(var(--accent)/0.2))';
                      e.currentTarget.parentElement.style.minHeight = '200px';
                    }
                  }}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-foreground font-semibold text-sm">{photo.title ?? '—'}</p>
                  {photo.caption && (
                    <p className="text-muted-foreground text-xs mt-1">{photo.caption ?? '—'}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && lightboxItems[lightboxIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center lightbox-overlay bg-background/90"
            onClick={() => setLightboxIdx(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-4xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxIdx(null)}
                className="absolute -top-12 right-0 text-muted-foreground hover:text-foreground transition-colors p-2"
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={lightboxItems[lightboxIdx].image ?? thumbPool[lightboxIdx % thumbPool.length]}
                alt={lightboxItems[lightboxIdx].title ?? 'Gallery'}
                className="w-full h-auto rounded-2xl object-cover max-h-[80vh]"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={goPrev}
                  disabled={lightboxIdx === 0}
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-border/40 text-muted-foreground hover:text-accent hover:border-accent/40 transition-colors disabled:opacity-30"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="text-center">
                  <p className="text-foreground font-semibold">{lightboxItems[lightboxIdx].title ?? '—'}</p>
                  <p className="text-muted-foreground text-sm">{lightboxItems[lightboxIdx].caption ?? '—'}</p>
                </div>
                <button
                  onClick={goNext}
                  disabled={lightboxIdx === lightboxItems.length - 1}
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-border/40 text-muted-foreground hover:text-accent hover:border-accent/40 transition-colors disabled:opacity-30"
                  aria-label="Next"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
