import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import apiClient from '@/lib/api';

export default function Newsletter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await apiClient.post('/v2/items/newsletter_subscribers', {
        email,
        first_name: firstName,
        travel_interest: interest,
        subscribed: true,
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-28 px-4 sm:px-6 overflow-hidden" ref={ref}>
      {/* Parallax bg */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('https://cdn-api.ucode.run/98d90215-1f89-4764-a75f-e682f307e88d/discover_new_zealand_images/40bcb178-2ccc-40be-aaae-8f7abd38fcef_img_03.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-[120px] opacity-15"
        style={{ background: 'hsl(160 100% 45%)' }}
      />

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent text-xs tracking-[0.2em] uppercase mb-4">Join the Journey</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
            Start Your New Zealand Story
          </h2>
          <p className="text-muted-foreground mb-10 leading-relaxed">
            Get curated travel guides, hidden gems, and exclusive deals delivered to your inbox.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 py-10"
          >
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
              <Check className="h-8 w-8 text-accent" />
            </div>
            <p className="text-foreground text-xl font-semibold">{'You\'re on the list!'}</p>
            <p className="text-muted-foreground text-sm">Welcome to the Discover NZ community. Adventures await.</p>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="flex-1 h-11 px-4 rounded-lg border border-border/40 bg-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-11 px-4 rounded-lg border border-border/40 bg-input text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Select value={interest} onValueChange={setInterest}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Travel interest..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="culture">Culture</SelectItem>
                    <SelectItem value="nature">Nature</SelectItem>
                    <SelectItem value="food">Food &amp; Wine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="sm:w-auto gap-2 font-semibold rounded-lg"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-muted-foreground text-xs mt-1">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </motion.form>
        )}
      </div>
    </section>
  );
}
