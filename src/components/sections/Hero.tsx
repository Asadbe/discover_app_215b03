import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section
      id="hero"
      className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden hero-texture"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/5d95d322-c703-45ed-a493-59bd32d0948d_img_00.jpg"
          alt="Aerial view of New Zealand landscape"
          className="w-full h-full object-cover"
          loading="eager"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.style.display = 'none';
            if (e.currentTarget.parentElement) {
              e.currentTarget.parentElement.style.background = 'linear-gradient(135deg, hsl(215 30% 5%), hsl(160 100% 15%))';
            }
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
        {/* Accent glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-20"
          style={{ background: 'hsl(160 100% 45%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-accent text-xs sm:text-sm tracking-[0.25em] uppercase mb-6 font-medium"
        >
          Aotearoa &mdash; The Land of the Long White Cloud
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="gradient-text font-black tracking-tighter leading-none mb-6"
          style={{ fontSize: 'clamp(56px, 8vw, 110px)' }}
        >
          Discover<br />New Zealand
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Where every landscape tells a story and every adventure changes you forever.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="lg" className="rounded-full gap-2 font-semibold animate-pulseGlow">
            Plan Your Journey
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full gap-2 font-semibold"
            onClick={() => setVideoOpen(true)}
          >
            <Play className="h-4 w-4" />
            Watch Film
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce-arrow">
        <ChevronDown className="h-7 w-7 text-accent/60" />
      </div>

      {/* Video Lightbox */}
      <AnimatePresence>
        {videoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center lightbox-overlay bg-background/80"
            onClick={() => setVideoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl mx-4 aspect-video bg-card rounded-2xl overflow-hidden border border-border/30 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setVideoOpen(false)}
                className="absolute top-4 right-4 z-10 bg-background/60 backdrop-blur-sm rounded-full p-2 text-foreground hover:text-accent transition-colors"
                aria-label="Close video"
              >
                <X className="h-5 w-5" />
              </button>
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/GhDdUB5qdAM?autoplay=1"
                title="New Zealand Film"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
