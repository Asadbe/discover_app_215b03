import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import StatsBar from '@/components/sections/StatsBar';
import Destinations from '@/components/sections/Destinations';
import VideoSection from '@/components/sections/VideoSection';
import Experiences from '@/components/sections/Experiences';
import Gallery from '@/components/sections/Gallery';
import InteractiveMap from '@/components/sections/InteractiveMap';
import Testimonials from '@/components/sections/Testimonials';
import Newsletter from '@/components/sections/Newsletter';
import CTABanner from '@/components/sections/CTABanner';

export default function LandingPage() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const h = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        {/* Section 1: Hero */}
        <Hero />
        {/* Section 2: Stats / Introduction */}
        <StatsBar />
        {/* Section 3: Destinations Carousel */}
        <Destinations />
        {/* Section 4: Hero Video */}
        <VideoSection />
        {/* Section 5: Experiences */}
        <Experiences />
        {/* Section 6: Photo Gallery */}
        <Gallery />
        {/* Section 7: Interactive Map */}
        <InteractiveMap />
        {/* Section 8: Testimonials */}
        <Testimonials />
        {/* Section 9: Newsletter */}
        <Newsletter />
        {/* Section 10: CTA Banner */}
        <CTABanner />
      </main>
      <Footer />

      {/* Scroll to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-accent text-accent-foreground w-11 h-11 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50 animate-pulseGlow"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
