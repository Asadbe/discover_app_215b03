import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface Stat {
  value: string;
  label: string;
  numeric: number;
  suffix: string;
  prefix: string;
}

const stats: Stat[] = [
  { value: '14', label: 'National Parks', numeric: 14, suffix: '', prefix: '' },
  { value: '15,000', label: 'km Coastline', numeric: 15000, suffix: '', prefix: '' },
  { value: '#1', label: 'Adventure Destination', numeric: 1, suffix: '', prefix: '#' },
  { value: '100%', label: 'Pure Nature', numeric: 100, suffix: '%', prefix: '' },
];

function CountUp({ target, suffix, prefix }: { target: number; suffix: string; prefix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {prefix}{count >= 1000 ? count.toLocaleString() : count}{suffix}
    </span>
  );
}

export default function StatsBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24 px-4 sm:px-6 bg-background" ref={ref}>
      <div className="max-w-5xl mx-auto">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-foreground/90 text-lg sm:text-xl leading-relaxed" style={{ maxWidth: '65ch', margin: '0 auto' }}>
            New Zealand is not just a destination — it is a living, breathing masterpiece of nature. From fjords that pierce the clouds to beaches where dolphins play at dawn, every corner of Aotearoa is a testament to the extraordinary.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-border/30">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center py-8 px-4"
            >
              <span
                className="text-4xl sm:text-5xl font-black text-accent mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                <CountUp target={stat.numeric} suffix={stat.suffix} prefix={stat.prefix} />
              </span>
              <span className="text-muted-foreground text-sm">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
