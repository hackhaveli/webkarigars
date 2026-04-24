'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { supabase } from '@/lib/supabase';
import { useBrand } from '@/lib/brand-context';


export default function Header() {
  const brandName = useBrand();
  const navLinks = [
    { label: 'Collection', href: '#products' },
    { label: 'Categories', href: '#categories' },
    { label: `Why ${brandName}`, href: '#why' },
    { label: 'Reviews', href: '#testimonials' },
  ];
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [phone, setPhone] = useState('1234567890');
  const [announcement, setAnnouncement] = useState('');
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  // Load WhatsApp number + announcement bar from Supabase
  useEffect(() => {
    supabase.from('site_settings').select('key, value')
      .in('key', ['whatsapp_number', 'announcement_bar', 'announcement_bar_enabled'])
      .then(({ data }) => {
        const map: Record<string, string> = {};
        (data || []).forEach((s: any) => { map[s.key] = s.value || ''; });
        setPhone(map['whatsapp_number'] || '1234567890');
        setAnnouncement(map['announcement_bar'] || '');
        setShowAnnouncement(map['announcement_bar_enabled'] === 'true');
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const close = () => setMenuOpen(false);
      window.addEventListener('scroll', close, { passive: true });
      return () => window.removeEventListener('scroll', close);
    }
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`Hi, I'm interested in shopping from ${brandName}`)}`, '_blank');
    setMenuOpen(false);
  };

  return (
    <>
      {/* Announcement bar */}
      {showAnnouncement && announcement && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-foreground text-primary-foreground text-center text-xs py-2 px-4 font-sans tracking-widest uppercase">
          {announcement}
        </div>
      )}

      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${showAnnouncement && announcement ? 'top-8' : 'top-0'} ${scrolled ? 'nav-scrolled' : 'bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <AppLogo size={32} className="transition-opacity group-hover:opacity-70" />
            <span className={`font-sans font-medium tracking-[0.3em] uppercase text-sm transition-colors ${scrolled ? 'text-foreground' : 'text-white'}`}>
              {brandName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button key={link.label} onClick={() => handleNavClick(link.href)}
                className={`nav-link-underline text-xs tracking-[0.2em] uppercase font-sans font-medium transition-colors hover:opacity-60 ${scrolled ? 'text-foreground' : 'text-white/85'}`}>
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={openWhatsApp}
              className={`text-xs tracking-[0.2em] uppercase font-sans font-medium transition-all px-6 py-2.5 border ${
                scrolled
                  ? 'border-foreground text-foreground hover:bg-foreground hover:text-primary-foreground'
                  : 'border-white/60 text-white hover:bg-white hover:text-foreground'
              }`}>
              Order Now
            </button>
          </div>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden flex flex-col gap-1.5 p-2 transition-colors ${scrolled ? 'text-foreground' : 'text-white'}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-4 h-px bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-background/98 backdrop-blur-md flex flex-col transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex-1 flex flex-col justify-center px-8 gap-8 pt-20">
          {navLinks.map((link) => (
            <button key={link.label} onClick={() => handleNavClick(link.href)}
              className="text-left text-foreground font-serif font-light border-b border-border pb-6 transition-opacity hover:opacity-60"
              style={{ fontSize: 'clamp(28px, 8vw, 40px)' }}>
              {link.label}
            </button>
          ))}
          <button onClick={openWhatsApp}
            className="mt-4 bg-[#25D366] text-white text-sm tracking-[0.2em] uppercase font-sans font-medium py-4 flex items-center justify-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}