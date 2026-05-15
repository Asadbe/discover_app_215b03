import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTABanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24 px-4 sm:px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden border border-accent/20 p-10 sm:p-16 text-center"
        >
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src="https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/2a8e7182-db72-4a3f-ac2e-ca914e894350_img_07.jpg"
              alt="New Zealand landscape"
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.parentElement) {
                  e.currentTarget.parentElement.style.background = 'linear-gradient(135deg,hsl(var(--card)),hsl(var(--accent)/0.1))';
                }
              }}
            />
            <div className="absolute inset-0 bg-background/80" />
          </div>
          {/* Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 rounded-full blur-[80px] opacity-20"
            style={{ background: 'hsl(160 100% 45%)' }}
          />

          <div className="relative z-10">
            <p className="text-accent text-xs tracking-[0.25em] uppercase mb-4">Your Adventure Awaits</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight gradient-text mb-5">
              The Journey of a Lifetime<br />Starts with One Step
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
              From the turquoise lakes of the South Island to the rolling hills of the North, New Zealand is ready to be explored. Let us help you craft the perfect itinerary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full gap-2 font-semibold">
                Start Planning
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full">
                View All Experiences
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
