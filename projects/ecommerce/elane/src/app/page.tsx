import React from 'react';
import HeroSection from './components/HeroSection';
import ProductShowcase from './components/ProductShowcase';
import CategorySection from './components/CategorySection';
import WhyElane from './components/WhyElane';
import TestimonialsSection from './components/TestimonialsSection';
import LookbookSection from './components/LookbookSection';
import StatsSection from './components/StatsSection';
import MarqueeTicker from './components/MarqueeTicker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloating from './components/WhatsAppFloating';
import ScrollRevealInit from './components/ScrollRevealInit';
import CursorSparkle from './components/CursorSparkle';
import MagneticCursor from './components/MagneticCursor';
import ScrollProgressBar from './components/ScrollProgressBar';
import Tilt3DInit from './components/Tilt3DInit';

export default function HomePage() {
  return (
    <>
      {/* ── Global Effects ───────────────────── */}
      <MagneticCursor />
      <CursorSparkle />
      <ScrollProgressBar />
      <Tilt3DInit />

      <main className="min-h-screen bg-background relative z-0">
        {/* ── Layout ───────────────────────────── */}
        <Header />
        <HeroSection />

      {/* Ticker 1 */}
      <MarqueeTicker />

      <CategorySection />
      <ProductShowcase />

      {/* Stats strip — dark, animated counters */}
      <StatsSection />

      {/* Ticker 2 */}
      <MarqueeTicker />

      <LookbookSection />
      <WhyElane />
      <TestimonialsSection />
        <Footer />
        <WhatsAppFloating />
        <ScrollRevealInit />
      </main>
    </>
  );
}