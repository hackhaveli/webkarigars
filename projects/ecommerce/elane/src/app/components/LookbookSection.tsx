'use client';

import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import { useBrand } from '@/lib/brand-context';

const LOOKS = [
  {
    id: 1,
    image: '/assets/images/lookbook_1.png',
    label: 'The Street Set',
    tag: 'Look 01',
    desc: 'Oversized Hoodie + Cargo Pant',
    accent: '#C8A882',
  },
  {
    id: 2,
    image: '/assets/images/lookbook_2.png',
    label: 'The Essential',
    tag: 'Look 02',
    desc: 'Box Tee + Wide-Leg Trouser',
    accent: '#A8B4C0',
  },
];

export default function LookbookSection() {
  const brandName = useBrand();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reveal on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealed(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Auto-cycle looks every 4s
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIdx(i => (i + 1) % LOOKS.length);
        setIsTransitioning(false);
      }, 400);
    }, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const switchTo = (idx: number) => {
    if (idx === activeIdx) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setIsTransitioning(true);
    setTimeout(() => { setActiveIdx(idx); setIsTransitioning(false); }, 400);
  };

  const look = LOOKS[activeIdx];

  return (
    <section
      ref={sectionRef}
      className="bg-background py-24 px-6 lg:px-12 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className="text-center mb-16 transition-all duration-1000"
          style={{ opacity: revealed ? 1 : 0, transform: revealed ? 'none' : 'translateY(30px)' }}
        >
          <p className="text-muted-foreground text-xs tracking-[0.4em] uppercase font-sans mb-3">
            Editorial
          </p>
          <h2 className="font-serif text-foreground" style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 300 }}>
            The Lookbook
          </h2>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Image panel */}
          <div
            className="relative transition-all duration-1000 delay-100"
            style={{ opacity: revealed ? 1 : 0, transform: revealed ? 'none' : 'translateX(-40px)' }}
          >
            {/* Background accent blob */}
            <div
              className="absolute -inset-6 rounded-full blur-3xl opacity-15 transition-colors duration-1000 pointer-events-none"
              style={{ backgroundColor: look.accent }}
            />

            {/* Image */}
            <div className="relative aspect-[3/4] max-w-sm mx-auto overflow-hidden">
              <div
                className="absolute inset-0 z-10 transition-opacity duration-400"
                style={{ opacity: isTransitioning ? 0 : 1 }}
              >
                <AppImage
                  src={look.image}
                  alt={look.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Film-grain overlay */}
              <div className="absolute inset-0 z-20 pointer-events-none lookbook-grain opacity-20" />

              {/* Look tag */}
              <div className="absolute top-4 right-4 z-30">
                <span className="bg-background/90 backdrop-blur-sm text-foreground text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 font-sans font-medium border border-border">
                  {look.tag}
                </span>
              </div>
            </div>

            {/* Look selector dots */}
            <div className="flex justify-center gap-3 mt-6">
              {LOOKS.map((l, i) => (
                <button
                  key={l.id}
                  onClick={() => switchTo(i)}
                  className="lookbook-dot transition-all duration-500"
                  style={{
                    width: i === activeIdx ? '32px' : '8px',
                    height: '8px',
                    borderRadius: '9999px',
                    backgroundColor: i === activeIdx ? 'var(--foreground)' : 'var(--border)',
                  }}
                  aria-label={`Look ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Text panel */}
          <div
            className="flex flex-col justify-center gap-8 transition-all duration-1000 delay-200"
            style={{ opacity: revealed ? 1 : 0, transform: revealed ? 'none' : 'translateX(40px)' }}
          >
            {/* Look info */}
            <div
              className="transition-all duration-400"
              style={{ opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)' }}
            >
              <p className="text-muted-foreground text-xs tracking-[0.35em] uppercase font-sans mb-3">
                {look.tag}
              </p>
              <h3 className="font-serif text-foreground mb-2" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 300 }}>
                {look.label}
              </h3>
              <p className="text-muted-foreground font-sans text-sm tracking-widest uppercase">
                {look.desc}
              </p>
            </div>

            {/* Divider */}
            <div className="w-12 h-px bg-accent" />

            {/* Story text */}
            <div className="space-y-4">
              <p className="text-foreground/70 font-sans text-sm leading-relaxed max-w-sm">
                Every look in the {brandName} collection is designed to move with you — from morning commute to late-night streets. Minimal by intention. Impactful by design.
              </p>
              <p className="text-foreground/50 font-sans text-sm leading-relaxed max-w-sm">
                Fabricated from 380gsm premium cotton, each piece holds its shape across every wear, every wash, every season.
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              {['380gsm heavyweight cotton', 'Pre-washed & preshrunk', 'Dropped shoulder silhouette', 'Available in 4 colourways'].map((feat) => (
                <div key={feat} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <span className="text-foreground/60 font-sans text-xs tracking-wider">{feat}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/collection"
              className="self-start inline-flex items-center gap-3 group"
            >
              <span className="text-foreground font-sans text-xs tracking-[0.25em] uppercase font-medium border-b border-foreground pb-0.5 group-hover:opacity-60 transition-opacity duration-300">
                Shop the Look
              </span>
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
