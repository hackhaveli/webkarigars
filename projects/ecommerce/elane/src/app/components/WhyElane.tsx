'use client';

import React, { useEffect, useRef } from 'react';
import { useBrand } from '@/lib/brand-context';

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'Premium Fabric',
    desc: '380gsm heavyweight cotton. Preshrunk, pill-resistant, built to last years not seasons.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
    title: 'Minimal Design',
    desc: 'No excess. Clean silhouettes, tonal branding, and details that speak quietly.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
    title: 'Perfect Fit',
    desc: 'Engineered sizing with extended lengths and structured shoulders for a contemporary silhouette.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: 'Street Luxury',
    desc: 'The intersection of comfort and identity. Wear it daily, wear it everywhere.',
  },
];

export default function WhyElane() {
  const brandName = useBrand();
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.why-item').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 120);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const headingObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            headingObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    if (headingRef?.current) headingObs?.observe(headingRef?.current);
    return () => { observer?.disconnect(); headingObs?.disconnect(); };
  }, []);

  return (
    <section id="why" className="bg-background py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headingRef} className="reveal-up text-center mb-20">
          <p className="text-muted-foreground text-xs tracking-[0.4em] uppercase font-sans mb-3">
            The {brandName} Standard
          </p>
          <h2
            className="font-serif text-foreground"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 300 }}
          >
            Why {brandName}
          </h2>
        </div>

        {/* Features grid */}
        <div ref={sectionRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {features?.map((feature, index) => (
            <div
              key={feature?.title}
              className="why-item reveal-up flex flex-col gap-5"
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              {/* Icon */}
              <div className="why-icon-wrap w-12 h-12 flex items-center justify-center border border-border text-muted-foreground">
                {feature?.icon}
              </div>
              {/* Divider */}
              <div className="w-8 h-px bg-accent" />
              {/* Text */}
              <div>
                <h3 className="text-foreground font-sans font-medium text-sm tracking-widest uppercase mb-3">
                  {feature?.title}
                </h3>
                <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                  {feature?.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* About strip */}
        <div className="mt-24 pt-16 border-t border-border">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-muted-foreground text-xs tracking-[0.4em] uppercase font-sans mb-6">
              Our Story
            </p>
            <p
              className="font-serif text-foreground leading-snug"
              style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 300 }}
            >
              Built on the belief that comfort and identity aren&apos;t opposites. {brandName} exists for those who move through the world with intention.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}