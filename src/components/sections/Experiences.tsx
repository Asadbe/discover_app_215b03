import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Clock, DollarSign, Zap, Flame, Star, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useApiQuery, extractList } from '@/hooks/useApiQuery';

interface Experience {
  guid: string;
  title: string;
  description: string;
  icon: string;
  price_from: number;
  duration: string;
  image: string;
}

const thumbPool = [
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/5d95d322-c703-45ed-a493-59bd32d0948d_img_00.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/40fd313f-ad59-45de-ba07-be9e4b729736_img_01.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/d971479e-455c-4ef4-918a-cf8c9c21b560_img_02.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/40bcb178-2ccc-40be-aaae-8f7abd38fcef_img_03.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/6f0ddbba-4ac5-4829-aa1c-3980a8a150bf_img_04.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/1377d714-acba-42ca-89df-5f36fa194773_img_05.jpg',
];

const iconMap: Record<string, React.ReactNode> = {
  zap: <Zap className="h-5 w-5" />,
  flame: <Flame className="h-5 w-5" />,
  star: <Star className="h-5 w-5" />,
  activity: <Activity className="h-5 w-5" />,
};

function formatCurrency(val: number): string {
  return `From $${val.toLocaleString()} NZD`;
}

export default function Experiences() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const { data, isLoading } = useApiQuery<unknown>(['experiences'], '/v2/items/experiences');
  const items = extractList<Experience>(data);

  return (
    <section id="experiences" className="py-24 px-4 sm:px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-accent text-xs tracking-[0.2em] uppercase mb-3">What Awaits You</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
            Unforgettable Experiences
          </h2>
          <div className="w-16 h-1 bg-accent rounded-full mx-auto" />
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-56 rounded-2xl bg-card animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, i) => (
              <motion.div
                key={item.guid}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col sm:flex-row gap-0 rounded-2xl border border-border/20 bg-card overflow-hidden hover:border-accent/30 hover:shadow-[0_0_32px_rgba(0,229,160,0.1)] transition-all duration-400"
              >
                {/* Image */}
                <div className="relative sm:w-48 h-52 sm:h-auto flex-shrink-0 overflow-hidden">
                  <img
                    src={item.image ?? thumbPool[i % thumbPool.length]}
                    alt={item.title ?? 'Experience'}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.parentElement) {
                        e.currentTarget.parentElement.style.background = 'linear-gradient(135deg,hsl(var(--muted)),hsl(var(--accent)/0.2))';
                      }
                    }}
                  />
                </div>
                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-accent">
                        {iconMap[item.icon ?? 'zap'] ?? <Zap className="h-5 w-5" />}
                      </span>
                      <h3 className="text-lg font-bold text-foreground">{item.title ?? '—'}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {item.description ?? '—'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-accent text-sm font-medium">
                        <DollarSign className="h-3.5 w-3.5" />
                        {formatCurrency(item.price_from ?? 0)}
                      </span>
                      {item.duration && (
                        <Badge variant="outline" className="flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          {item.duration ?? '—'}
                        </Badge>
                      )}
                    </div>
                    <button className="text-accent text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all duration-200">
                      Learn More <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
