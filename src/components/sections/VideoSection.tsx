import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play } from 'lucide-react';

export default function VideoSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [playing, setPlaying] = useState(false);

  return (
    <section className="py-24 px-4 sm:px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="rounded-2xl overflow-hidden border border-border/20 shadow-[0_0_80px_rgba(0,229,160,0.08)] relative aspect-video bg-card"
        >
          {!playing ? (
            <>
              <img
                src="https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/40fd313f-ad59-45de-ba07-be9e4b729736_img_01.jpg"
                alt="New Zealand cinematic landscape"
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.style.background = 'linear-gradient(135deg,hsl(var(--muted)),hsl(var(--accent)/0.2))';
                  }
                }}
              />
              <div className="absolute inset-0 bg-background/40" />
              <button
                onClick={() => setPlaying(true)}
                className="absolute inset-0 flex items-center justify-center group"
                aria-label="Play video"
              >
                <div className="play-btn-glass w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_40px_rgba(0,229,160,0.3)]">
                  <Play className="h-8 w-8 sm:h-10 sm:w-10 text-accent ml-1" />
                </div>
              </button>
            </>
          ) : (
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/GhDdUB5qdAM?autoplay=1"
              title="Experience New Zealand"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-muted-foreground text-sm mt-6 tracking-wide"
        >
          Experience the magic of Aotearoa in 3 minutes
        </motion.p>
      </div>
    </section>
  );
}
