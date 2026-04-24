'use client';

import React, { useEffect, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import AppLogo from '@/components/ui/AppLogo';
import { supabase } from '@/lib/supabase';
import { ScrambleText } from './ScrambleText';
import { useBrand } from '@/lib/brand-context';

export default function HeroSection() {
  const brandName = useBrand();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.from('site_settings').select('key, value')
      .in('key', [
        'hero_headline', 'hero_subtext', 'hero_image',
        'hero_stat_1_value', 'hero_stat_1_label',
        'hero_stat_2_value', 'hero_stat_2_label',
        'hero_stat_3_value', 'hero_stat_3_label',
        'whatsapp_number',
      ])
      .then(({ data }) => {
        const map: Record<string, string> = {};
        (data || []).forEach((s: any) => { map[s.key] = s.value || ''; });
        setSettings(map);
        setLoaded(true);
      });
  }, []);

  const phone = settings['whatsapp_number'] || '1234567890';

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`Hi, I'm interested in shopping from ${brandName}`)}`, '_blank');
  };

  const heroImage = settings['hero_image'] || '/assets/images/IMG-20260422-WA0031-1776880941756.jpg';
  const headline = settings['hero_headline'] || 'Redefining Street Elegance';
  const subtext = settings['hero_subtext'] || 'Premium cotton. Timeless streetwear.';

  // Split headline at last space to italicize last word(s) if single-line, 
  // or keep original two-line format
  const headlineParts = headline.split('\n');

  return (
    <section id="hero" className="relative min-h-screen flex flex-col overflow-hidden" style={{ minHeight: '100svh' }}>
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 hero-drift">
          <AppImage
            src={heroImage}
            alt={`${brandName} hero background`}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
        {/* Floating accent dots */}
        <div className="float-dot-1 absolute top-1/4 right-16 w-2 h-2 rounded-full bg-accent/60 hidden lg:block" />
        <div className="float-dot-2 absolute bottom-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-white/30 hidden lg:block" />
        <div className="float-dot-3 absolute top-1/2 right-1/3 w-1 h-1 rounded-full bg-accent/40 hidden lg:block" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 pt-32 pb-24 text-center">
        {/* Logo badge */}
        <div className="hero-animate mb-8 flex items-center justify-center" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3">
            <AppLogo size={36} className="opacity-90" />
            <span className="text-white text-sm font-medium tracking-[0.4em] uppercase opacity-90" style={{ fontFamily: 'var(--font-dm-sans)' }}>
              {brandName}
            </span>
          </div>
        </div>

        {/* Main headline */}
        <h1
          className="hero-animate font-serif text-white leading-[0.9] tracking-tight mb-6"
          style={{ animationDelay: '0.25s', fontSize: 'clamp(52px, 10vw, 120px)', fontWeight: 300, letterSpacing: '-0.02em' }}
        >
          {headlineParts.length > 1 ? (
            <>
              {headlineParts[0]}<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>{headlineParts[1]}</em>
            </>
          ) : (
            <>
              {headline.includes(' ') ? (
                <>
                  {headline.split(' ').slice(0, -2).join(' ')}<br />
                  <em style={{ fontStyle: 'italic', fontWeight: 300 }}>{headline.split(' ').slice(-2).join(' ')}</em>
                </>
              ) : headline}
            </>
          )}
        </h1>

        {/* Subtext — scramble reveal */}
        <p
          className="hero-animate text-white/75 font-sans font-light mb-12 max-w-md"
          style={{ animationDelay: '0.45s', fontSize: 'clamp(15px, 2.5vw, 18px)', letterSpacing: '0.02em' }}
        >
          <ScrambleText text={subtext} delay={700} duration={1000} />
        </p>

        {/* CTAs */}
        <div className="hero-animate flex flex-col sm:flex-row items-center gap-4" style={{ animationDelay: '0.65s' }}>
          <button onClick={scrollToProducts}
            className="btn-primary bg-white text-foreground px-10 py-4 text-sm font-medium tracking-[0.12em] uppercase min-w-[200px]">
            Explore Collection
          </button>
          <button onClick={openWhatsApp}
            className="btn-outline border border-white/70 text-white px-10 py-4 text-sm font-medium tracking-[0.12em] uppercase min-w-[200px] hover:bg-white hover:text-foreground">
            Chat on WhatsApp
          </button>
        </div>

        {/* Stats row */}
        <div className="hero-animate flex items-center gap-10 mt-16 pt-10 border-t border-white/15" style={{ animationDelay: '0.85s' }}>
          <div className="text-center">
            <div className="text-white text-2xl font-serif font-light">{settings['hero_stat_1_value'] || '100%'}</div>
            <div className="text-white/55 text-xs tracking-widest uppercase mt-1">{settings['hero_stat_1_label'] || 'Premium Cotton'}</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <div className="text-white text-2xl font-serif font-light">{settings['hero_stat_2_value'] || '500+'}</div>
            <div className="text-white/55 text-xs tracking-widest uppercase mt-1">{settings['hero_stat_2_label'] || 'Happy Customers'}</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <div className="text-white text-2xl font-serif font-light">{settings['hero_stat_3_value'] || 'Free'}</div>
            <div className="text-white/55 text-xs tracking-widest uppercase mt-1">{settings['hero_stat_3_label'] || 'Delivery'}</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-8">
        <button onClick={scrollToProducts}
          className="scroll-bounce flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
          aria-label="Scroll to products">
          <span className="text-[10px] tracking-[0.3em] uppercase font-sans">Scroll</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <rect x="0.75" y="0.75" width="14.5" height="22.5" rx="7.25" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="8" cy="8" r="2" fill="currentColor">
              <animateTransform attributeName="transform" type="translate" values="0,0; 0,6; 0,0" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </button>
      </div>
    </section>
  );
}