'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useBrand } from '@/lib/brand-context';

function Counter({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1800;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - t, 4); // ease-out quart
          setVal(Math.round(ease * to));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {prefix}{val}{suffix}
    </span>
  );
}

const STATS = [
  { label: 'Happy Customers', to: 500, suffix: '+', accent: 'Counting' },
  { label: 'Cotton Purity', to: 100, suffix: '%', accent: 'Premium' },
  { label: 'Avg. Rating', to: 4, suffix: '.9★', accent: 'Loved' },
  { label: 'Pieces Shipped', to: 1200, suffix: '+', accent: 'Delivered' },
];

export default function StatsSection() {
  const brandName = useBrand();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setRevealed(true);
    }, { threshold: 0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-foreground py-20 px-6 lg:px-12">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none lookbook-grain" />

      {/* Decorative floating ring */}
      <div className="absolute -top-20 -right-20 w-64 h-64 border border-white/10 rounded-full float-dot-1 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 border border-white/8 rounded-full float-dot-2 pointer-events-none" />

      <div ref={sectionRef} className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className="text-center mb-16 transition-all duration-1000"
          style={{ opacity: revealed ? 1 : 0, transform: revealed ? 'none' : 'translateY(30px)' }}
        >
          <p className="text-white/40 text-xs tracking-[0.4em] uppercase font-sans mb-3">By the numbers</p>
          <h2 className="font-serif text-white" style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300 }}>
            The {brandName} Standard
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="bg-foreground p-10 lg:p-12 flex flex-col group transition-all duration-500 hover:bg-white/5"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'none' : 'translateY(40px)',
                transition: `opacity 0.8s ease ${i * 0.15}s, transform 0.8s ease ${i * 0.15}s, background 0.3s ease`,
              }}
            >
              <p className="text-accent/60 text-[10px] tracking-[0.3em] uppercase font-sans mb-4 group-hover:text-accent transition-colors duration-300">
                {stat.accent}
              </p>
              <div className="font-serif text-white mb-3" style={{ fontSize: 'clamp(44px, 6vw, 72px)', fontWeight: 300, lineHeight: 1 }}>
                <Counter to={stat.to} suffix={stat.suffix} />
              </div>
              <p className="text-white/40 text-xs tracking-widest uppercase font-sans">{stat.label}</p>
              {/* Animated underline on hover */}
              <div className="mt-6 h-px bg-white/10 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-0 bg-accent group-hover:w-full transition-all duration-700" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom quote */}
        <div
          className="text-center mt-16 transition-all duration-1000 delay-500"
          style={{ opacity: revealed ? 1 : 0 }}
        >
          <p className="font-serif text-white/50 italic" style={{ fontSize: 'clamp(16px, 2vw, 22px)', fontWeight: 300 }}>
            "Built on the belief that comfort and identity aren't opposites."
          </p>
        </div>
      </div>
    </section>
  );
}
