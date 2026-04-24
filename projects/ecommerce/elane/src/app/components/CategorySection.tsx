'use client';

import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import { supabase, Category } from '@/lib/supabase';
import Link from 'next/link';

export default function CategorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('categories').select('*').eq('is_active', true).order('sort_order')
      .then(({ data }) => {
        setCategories((data as Category[]) || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!sectionRef.current || loading) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.cat-card').forEach((card, i) =>
            setTimeout(() => card.classList.add('visible'), i * 80));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [categories, loading]);

  // Clicking a category: go to /collection?category=T-Shirts
  // This keeps the navigation clean and bookmarkable
  const handleCategoryClick = (catName: string) => {
    // First try to scroll to products on same page and filter
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
      // Dispatch a custom event for the ProductShowcase to listen to
      window.dispatchEvent(new CustomEvent('elane:filter-category', { detail: catName }));
    }
  };

  return (
    <section id="categories" className="bg-secondary py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-muted-foreground text-xs tracking-[0.4em] uppercase font-sans mb-3">Shop by Category</p>
          <h2 className="font-serif text-foreground" style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 300 }}>
            Find Your Fit
          </h2>
        </div>

        {/* Categories grid */}
        <div ref={sectionRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {loading ? (
            [1,2,3,4].map(i => (
              <div key={i} className="bg-background animate-pulse">
                <div className="aspect-[3/4] bg-secondary/50" />
                <div className="p-4">
                  <div className="h-4 bg-secondary rounded mb-2 w-2/3" />
                  <div className="h-3 bg-secondary rounded w-1/2" />
                </div>
              </div>
            ))
          ) : (
            categories.map((cat, index) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className="cat-card reveal-up category-card group relative overflow-hidden bg-background text-left"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <AppImage
                    src={cat.image}
                    alt={cat.alt || cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-500" />
                  {/* "Browse" label on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white text-foreground text-[10px] tracking-[0.25em] uppercase px-4 py-2 font-sans font-medium">
                      Browse →
                    </span>
                  </div>
                </div>

                {/* Label */}
                <div className="p-4 pb-5">
                  <h3 className="text-foreground font-sans font-medium text-sm tracking-wide mb-1">{cat.name}</h3>
                  <p className="text-muted-foreground text-xs tracking-widest uppercase font-sans">{cat.count}</p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* View all link */}
        <div className="text-center mt-12">
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 text-foreground text-xs tracking-[0.25em] uppercase font-sans font-medium border-b border-foreground pb-0.5 hover:opacity-60 transition-opacity"
          >
            Browse Full Collection
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}