'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import AppImage from '@/components/ui/AppImage';
import { supabase, Product } from '@/lib/supabase';
import Link from 'next/link';
import { useBrand } from '@/lib/brand-context';

// ─── WhatsApp Logger ─────────────────────────────────────────────────────────
async function openWhatsApp(productName: string, colorName: string, phoneNumber: string, brandName: string) {
  supabase.from('orders').insert({
    product_name: productName,
    color_name: colorName,
    status: 'new',
  }).then(() => {});
  const msg = encodeURIComponent(`Hi, I'm interested in ${productName} (${colorName}) from ${brandName}`);
  window.open(`https://wa.me/${phoneNumber}?text=${msg}`, '_blank');
}


// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, index, whatsappNumber, brandName }: { product: Product; index: number; whatsappNumber: string; brandName: string }) {
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevImage, setPrevImage] = useState<string | null>(null);

  const activeVariant = product.product_variants[activeVariantIdx];

  const goToImage = useCallback((imgIdx: number) => {
    if (imgIdx === activeImageIdx || isTransitioning) return;
    setIsTransitioning(true);
    setPrevImage(activeVariant.variant_images[activeImageIdx]?.url);
    setActiveImageIdx(imgIdx);
    setTimeout(() => { setPrevImage(null); setIsTransitioning(false); }, 420);
  }, [activeImageIdx, activeVariant, isTransitioning]);

  const handleVariantChange = useCallback((variantIdx: number) => {
    if (variantIdx === activeVariantIdx) return;
    setIsTransitioning(true);
    setPrevImage(activeVariant.variant_images[activeImageIdx]?.url);
    setActiveVariantIdx(variantIdx);
    setActiveImageIdx(0);
    setTimeout(() => { setPrevImage(null); setIsTransitioning(false); }, 420);
  }, [activeVariantIdx, activeVariant, activeImageIdx]);

  const nextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    goToImage((activeImageIdx + 1) % activeVariant.variant_images.length);
  }, [activeImageIdx, activeVariant, goToImage]);

  const prevImage2 = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    goToImage((activeImageIdx - 1 + activeVariant.variant_images.length) % activeVariant.variant_images.length);
  }, [activeImageIdx, activeVariant, goToImage]);

  if (!activeVariant || !activeVariant.variant_images?.length) return null;

  const currentImageUrl = activeVariant.variant_images[activeImageIdx]?.url;
  const currentImageAlt = activeVariant.variant_images[activeImageIdx]?.alt || product.name;

  return (
    <article className="product-card reveal-up group cursor-pointer" style={{ transitionDelay: `${index * 60}ms` }}>
      <div className="product-img-wrap relative bg-secondary aspect-[4/5] mb-4 overflow-hidden">
        {prevImage && (
          <div className="absolute inset-0 z-10 carousel-fade-out">
            <AppImage src={prevImage} alt="" fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
          </div>
        )}
        <div className={`absolute inset-0 z-20 ${isTransitioning ? 'carousel-fade-in' : ''}`}>
          <AppImage src={currentImageUrl} alt={currentImageAlt} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        </div>

        {product.tag && (
          <span className="absolute top-4 left-4 z-30 bg-foreground text-primary-foreground text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 font-sans font-medium">
            {product.tag}
          </span>
        )}

        {activeVariant.variant_images.length > 1 && (
          <>
            <button onClick={prevImage2} className="carousel-arrow absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white" aria-label="Previous image">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button onClick={nextImage} className="carousel-arrow absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white" aria-label="Next image">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </>
        )}

        {activeVariant.variant_images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
            {activeVariant.variant_images.map((_, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); goToImage(i); }}
                className={`carousel-dot transition-all duration-300 rounded-full ${i === activeImageIdx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'}`}
                aria-label={`Image ${i + 1}`} />
            ))}
          </div>
        )}

        <div className="absolute inset-0 z-25 bg-foreground/0 group-hover:bg-foreground/8 transition-colors duration-500" />
        <div className="absolute bottom-0 inset-x-0 z-30 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-foreground/90 px-5 py-4">
          <button onClick={() => openWhatsApp(product.name, activeVariant.name, whatsappNumber, brandName)}
            className="w-full text-primary-foreground text-xs tracking-[0.2em] uppercase font-sans font-medium flex items-center justify-center gap-2 py-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            Order via WhatsApp
          </button>
        </div>
      </div>

      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase font-sans mb-1">{product.category}</p>
          <h3 className="text-foreground font-sans font-medium text-sm tracking-wide">{product.name}</h3>
        </div>
        <div className="text-foreground font-serif text-base font-light">{product.price}</div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        {product.product_variants.map((variant, vi) => (
          <button key={variant.id} onClick={() => handleVariantChange(vi)} title={variant.name}
            className={`swatch-btn relative w-5 h-5 rounded-full transition-all duration-300 ${vi === activeVariantIdx ? 'ring-2 ring-offset-2 ring-foreground scale-110' : 'hover:scale-110 ring-1 ring-border'}`}
            style={{ backgroundColor: variant.hex }} aria-label={`Select ${variant.name}`} />
        ))}
        <span className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase font-sans ml-1">{activeVariant.name}</span>
      </div>

      <button onClick={() => openWhatsApp(product.name, activeVariant.name, whatsappNumber, brandName)}
        className="mt-1 w-full border border-border text-foreground text-xs tracking-[0.2em] uppercase py-3 font-sans font-medium hover:bg-foreground hover:text-primary-foreground transition-colors duration-300 sm:hidden">
        Get on WhatsApp
      </button>
    </article>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function ProductShowcase({ categoryFilter }: { categoryFilter?: string }) {
  const brandName = useBrand();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>(categoryFilter || 'All');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      const [{ data: pData }, { data: sData }] = await Promise.all([
        supabase.from('products')
          .select(`*, product_variants(*, variant_images(*))`)
          .eq('is_active', true)
          .order('sort_order'),
        supabase.from('site_settings').select('key, value')
          .in('key', ['whatsapp_number', 'collection_year', 'collection_title', 'collection_subtitle']),
      ]);

      const prods = (pData as Product[]) || [];
      setProducts(prods);

      // Build unique category list from actual products
      const cats = ['All', ...Array.from(new Set(prods.map(p => p.category)))];
      setCategories(cats);

      const map: Record<string, string> = {};
      (sData || []).forEach((s: any) => { map[s.key] = s.value || ''; });
      setSettings(map);
      setLoading(false);
    }
    loadData();
  }, []);

  // If a categoryFilter prop is passed (from category section click), use it
  useEffect(() => {
    if (categoryFilter) setActiveCategory(categoryFilter);
  }, [categoryFilter]);

  // Listen for category filter events dispatched by CategorySection
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setActiveCategory(e.detail);
    };
    window.addEventListener('elane:filter-category', handler as EventListener);
    return () => window.removeEventListener('elane:filter-category', handler as EventListener);
  }, []);

  useEffect(() => {
    if (loading || !sectionRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.product-card').forEach((card, i) =>
            setTimeout(() => card.classList.add('visible'), i * 100));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [loading, activeCategory]);

  const whatsappNumber = settings['whatsapp_number'] || '1234567890';
  const filtered = activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory);

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="products" className="bg-background py-24 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="text-muted-foreground text-xs tracking-[0.4em] uppercase font-sans mb-3">
              {settings['collection_year'] || 'Collection 2026'}
            </p>
            <h2 className="font-serif text-foreground leading-tight" style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 300 }}>
              {settings['collection_title'] || 'The Essentials'}
            </h2>
          </div>
          <p className="text-muted-foreground text-sm font-sans max-w-xs leading-relaxed">
            {settings['collection_subtitle'] || 'Each piece designed for comfort, identity, and lasting quality.'}
          </p>
        </div>

        {/* Category filter tabs */}
        {!loading && categories.length > 1 && (
          <div className="flex gap-2 flex-wrap mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  scrollToProducts();
                }}
                className={`px-5 py-2 text-xs tracking-[0.15em] uppercase font-sans font-medium transition-all duration-300 border ${
                  activeCategory === cat
                    ? 'bg-foreground text-primary-foreground border-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-secondary mb-4" />
                <div className="h-3 bg-secondary rounded mb-2 w-2/3" />
                <div className="h-4 bg-secondary rounded w-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-muted-foreground text-sm font-sans">No products in this category yet.</p>
          </div>
        ) : (
          <div ref={sectionRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filtered.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} whatsappNumber={whatsappNumber} brandName={brandName} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-16 pt-12 border-t border-border">
          <p className="text-muted-foreground text-sm font-sans mb-6">Want to see everything? Browse the full collection.</p>
          <Link
            href="/collection"
            className="inline-block btn-primary bg-foreground text-primary-foreground px-12 py-4 text-xs tracking-[0.2em] uppercase font-sans font-medium hover:opacity-80 transition-opacity"
          >
            View Full Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
