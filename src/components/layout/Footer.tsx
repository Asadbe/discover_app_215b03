import React from 'react';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-1 mb-4">
              <span className="text-accent font-bold text-2xl" style={{ fontFamily: 'var(--font-heading)' }}>Discover</span>
              <span className="text-foreground font-bold text-2xl" style={{ fontFamily: 'var(--font-heading)' }}>NZ</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Your gateway to Aotearoa — the land of pristine wilderness, Māori culture, and adventures that reshape you.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Website" className="w-10 h-10 flex items-center justify-center rounded-full border border-border/40 text-muted-foreground hover:text-accent hover:border-accent/50 transition-colors">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Email" className="w-10 h-10 flex items-center justify-center rounded-full border border-border/40 text-muted-foreground hover:text-accent hover:border-accent/50 transition-colors">
                <Mail className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Phone" className="w-10 h-10 flex items-center justify-center rounded-full border border-border/40 text-muted-foreground hover:text-accent hover:border-accent/50 transition-colors">
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-foreground font-semibold mb-5 text-sm tracking-widest uppercase">Quick Links</h4>
            <ul className="space-y-3">
              {['Destinations', 'Experiences', 'Gallery', 'Plan Your Trip'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-accent text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-foreground font-semibold mb-5 text-sm tracking-widest uppercase">Practical Info</h4>
            <ul className="space-y-3">
              {['Visa Info', 'Best Time to Visit', 'Getting Around', 'Travel Insurance'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-accent text-sm transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-foreground font-semibold mb-5 text-sm tracking-widest uppercase">Contact</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span>Tourism New Zealand, 5 Queens Wharf, Wellington 6011</span>
              </li>
              <li className="flex gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span>hello@discovernz.co.nz</span>
              </li>
              <li className="flex gap-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span>+64 4 917 5400</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs">&copy; {year} Discover NZ. All rights reserved.</p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms', 'Accessibility'].map((item) => (
              <a key={item} href="#" className="text-muted-foreground hover:text-accent text-xs transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
