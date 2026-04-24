'use client';

import React, { useEffect, useRef, useState } from 'react';
import { supabase, Testimonial } from '@/lib/supabase';

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState('1234567890');

  useEffect(() => {
    async function loadData() {
      const [{ data: tData }, { data: sData }] = await Promise.all([
        supabase.from('testimonials').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('site_settings').select('value').eq('key', 'whatsapp_number').single(),
      ]);
      setTestimonials((tData as Testimonial[]) || []);
      if (sData) setWhatsappNumber((sData as any).value || '1234567890');
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.testi-card').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 120);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [testimonials]);

  return (
    <section id="testimonials" className="bg-secondary py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-muted-foreground text-xs tracking-[0.4em] uppercase font-sans mb-3">Real Customers</p>
          <h2 className="font-serif text-foreground" style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 300 }}>
            Worn & Loved
          </h2>
        </div>

        <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, index) => (
            <div key={t.id} className="testi-card reveal-up bg-background p-8 flex flex-col gap-6" style={{ transitionDelay: `${index * 120}ms` }}>
              <StarRating count={t.rating} />
              <p className="text-foreground font-sans text-sm leading-relaxed flex-1">"{t.text}"</p>
              {t.product_ref && (
                <span className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase font-sans border-b border-border pb-4">
                  {t.product_ref}
                </span>
              )}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 overflow-hidden rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                  {t.avatar_url ? (
                    <img src={t.avatar_url} alt={t.name} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-foreground font-bold text-sm">{t.name[0]}</span>
                  )}
                </div>
                <div>
                  <p className="text-foreground font-sans font-medium text-sm">{t.name}</p>
                  {t.location && <p className="text-muted-foreground font-sans text-xs">{t.location}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button
            onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=Hi%2C%20I%27d%20like%20to%20place%20an%20order%20with%20%C3%89LANE`, '_blank')}
            className="btn-primary bg-foreground text-primary-foreground px-12 py-4 text-xs tracking-[0.2em] uppercase font-sans font-medium hover:opacity-80 transition-opacity inline-flex items-center gap-3"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Join 500+ Happy Customers
          </button>
        </div>
      </div>
    </section>
  );
}