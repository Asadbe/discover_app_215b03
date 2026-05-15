import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useApiQuery, extractList } from '@/hooks/useApiQuery';

interface Destination {
  guid: string;
  name: string;
  region: string;
  image: string;
  highlight: string;
  latitude: string;
  longitude: string;
}

const thumbPool = [
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/5d95d322-c703-45ed-a493-59bd32d0948d_img_00.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/40fd313f-ad59-45de-ba07-be9e4b729736_img_01.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/d971479e-455c-4ef4-918a-cf8c9c21b560_img_02.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/40bcb178-2ccc-40be-aaae-8f7abd38fcef_img_03.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/6f0ddbba-4ac5-4829-aa1c-3980a8a150bf_img_04.jpg',
  'https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/1377d714-acba-42ca-89df-5f36fa194773_img_05.jpg',
];

// NZ SVG approximate marker positions (% of 400x600 viewport)
// Based on real lat/lon mapped to SVG coords
const defaultMarkers = [
  { name: 'Auckland',        region: 'Northland',   x: 62, y: 22 },
  { name: 'Rotorua',         region: 'Bay of Plenty', x: 68, y: 31 },
  { name: 'Wellington',      region: 'Wellington',  x: 66, y: 62 },
  { name: 'Queenstown',      region: 'Otago',       x: 40, y: 82 },
  { name: 'Milford Sound',   region: 'Fiordland',   x: 28, y: 85 },
  { name: 'Christchurch',    region: 'Canterbury',  x: 58, y: 72 },
  { name: 'Abel Tasman',     region: 'Nelson',      x: 52, y: 55 },
  { name: 'Bay of Islands',  region: 'Northland',   x: 55, y: 10 },
];

export default function InteractiveMap() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<number | null>(null);

  const { data } = useApiQuery<unknown>(['destinations-map'], '/v2/items/destinations');
  const apiItems = extractList<Destination>(data);

  // Build marker list from API or use defaults
  const markers = apiItems.length > 0
    ? apiItems.map((item, i) => ({
        guid: item.guid,
        name: item.name ?? '—',
        region: item.region ?? '—',
        image: item.image ?? thumbPool[i % thumbPool.length],
        highlight: item.highlight ?? '',
        x: defaultMarkers[i % defaultMarkers.length].x,
        y: defaultMarkers[i % defaultMarkers.length].y,
      }))
    : defaultMarkers.map((m, i) => ({ ...m, guid: String(i), image: thumbPool[i % thumbPool.length], highlight: '' }));

  const displayItems = apiItems.length > 0 ? apiItems : defaultMarkers.map((m, i) => ({
    guid: String(i),
    name: m.name,
    region: m.region,
    image: thumbPool[i % thumbPool.length],
    highlight: '',
  }));

  return (
    <section className="py-24 px-4 sm:px-6 bg-card/30" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-accent text-xs tracking-[0.2em] uppercase mb-3">Navigate Aotearoa</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
            Interactive Map
          </h2>
          <div className="w-16 h-1 bg-accent rounded-full mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col lg:flex-row gap-6 rounded-2xl border border-border/20 overflow-hidden bg-card"
        >
          {/* Sidebar */}
          <div className="lg:w-2/5 p-6 border-b lg:border-b-0 lg:border-r border-border/20 overflow-y-auto max-h-[500px] lg:max-h-none">
            <p className="text-muted-foreground text-xs uppercase tracking-widest mb-5">Destinations</p>
            <ul className="space-y-1">
              {displayItems.map((item, i) => (
                <li key={item.guid ?? i}>
                  <button
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 min-h-[44px] ${
                      activeMarker === i
                        ? 'bg-accent/15 text-accent border border-accent/30'
                        : 'text-foreground hover:bg-muted/50 border border-transparent'
                    }`}
                    onClick={() => setActiveMarker(activeMarker === i ? null : i)}
                  >
                    <MapPin className={`h-4 w-4 shrink-0 ${activeMarker === i ? 'text-accent' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="font-medium text-sm">{item.name ?? '—'}</p>
                      <p className="text-muted-foreground text-xs">{item.region ?? '—'}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Map */}
          <div className="lg:w-3/5 relative min-h-[420px] lg:min-h-0">
            {/* NZ SVG Map */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative w-full h-full">
                <svg
                  viewBox="0 0 400 620"
                  className="w-full h-full"
                  style={{ maxHeight: '560px' }}
                  aria-label="Map of New Zealand"
                >
                  {/* North Island */}
                  <path
                    d="M 260 30 C 280 40 310 60 315 90 C 320 120 300 145 290 165 C 285 180 295 195 290 215 C 285 235 270 250 260 265 C 245 285 235 295 220 305 C 205 315 190 320 175 325 C 160 330 148 328 140 315 C 130 300 132 280 140 265 C 148 248 165 238 172 222 C 180 205 175 188 180 170 C 186 150 200 135 205 115 C 212 90 205 65 215 45 C 225 25 245 18 260 30Z"
                    fill="hsl(var(--muted))"
                    stroke="hsl(var(--accent)/0.3)"
                    strokeWidth="1"
                  />
                  {/* South Island */}
                  <path
                    d="M 240 355 C 255 360 268 375 272 395 C 278 420 265 445 255 465 C 245 485 240 500 230 520 C 218 542 205 558 190 568 C 175 578 158 575 148 560 C 135 542 138 520 145 500 C 152 480 165 465 165 445 C 165 425 152 408 148 390 C 142 368 148 348 162 338 C 178 325 200 325 218 332 C 228 338 233 350 240 355Z"
                    fill="hsl(var(--muted))"
                    stroke="hsl(var(--accent)/0.3)"
                    strokeWidth="1"
                  />
                  {/* Stewart Island */}
                  <ellipse cx="185" cy="600" rx="18" ry="12" fill="hsl(var(--muted))" stroke="hsl(var(--accent)/0.3)" strokeWidth="1" />

                  {/* Markers */}
                  {markers.map((m, i) => (
                    <g key={m.guid ?? i}>
                      {/* Pulse ring */}
                      <circle
                        cx={`${(m.x / 100) * 400}`}
                        cy={`${(m.y / 100) * 620}`}
                        r="12"
                        fill="hsl(var(--accent)/0.15)"
                        className="marker-pulse"
                        style={{ animationDelay: `${i * 0.3}s` }}
                      />
                      {/* Marker dot */}
                      <circle
                        cx={`${(m.x / 100) * 400}`}
                        cy={`${(m.y / 100) * 620}`}
                        r="6"
                        fill={activeMarker === i || hoveredMarker === i ? 'hsl(var(--accent))' : 'hsl(var(--accent)/0.7)'}
                        stroke="hsl(var(--background))"
                        strokeWidth="2"
                        className="cursor-pointer transition-all duration-200"
                        style={{ filter: activeMarker === i ? 'drop-shadow(0 0 8px hsl(160 100% 45%))' : 'none' }}
                        onClick={() => setActiveMarker(activeMarker === i ? null : i)}
                        onMouseEnter={() => setHoveredMarker(i)}
                        onMouseLeave={() => setHoveredMarker(null)}
                      />
                    </g>
                  ))}
                </svg>

                {/* Tooltip */}
                {hoveredMarker !== null && markers[hoveredMarker] && (
                  <div
                    className="absolute z-10 bg-card border border-border/40 rounded-xl overflow-hidden shadow-2xl w-52 pointer-events-none"
                    style={{
                      left: `${markers[hoveredMarker].x}%`,
                      top: `${markers[hoveredMarker].y}%`,
                      transform: 'translate(-50%, -110%)',
                    }}
                  >
                    <img
                      src={markers[hoveredMarker].image}
                      alt={markers[hoveredMarker].name}
                      className="w-full h-28 object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="p-3">
                      <p className="font-semibold text-sm text-foreground">{markers[hoveredMarker].name}</p>
                      <p className="text-muted-foreground text-xs">{markers[hoveredMarker].region}</p>
                      {markers[hoveredMarker].highlight && (
                        <p className="text-accent text-xs mt-1">{markers[hoveredMarker].highlight}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
