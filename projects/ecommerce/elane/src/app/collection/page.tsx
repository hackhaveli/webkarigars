'use client';

import React, { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloating from '@/app/components/WhatsAppFloating';
import { supabase, Product } from '@/lib/supabase';
import { useBrand } from '@/lib/brand-context';

// ─── WhatsApp Logger ──────────────────────────────────────────────────────────
async function openWhatsApp(productName: string, colorName: string, phoneNumber: string, brandName: string) {
  supabase.from('orders').insert({ product_name: productName, color_name: colorName, status: 'new' }).then(() => {});
  const msg = encodeURIComponent(`Hi, I'm interested in ${productName} (${colorName}) from ${brandName}`);
  window.open(`https://wa.me/${phoneNumber}?text=${msg}`, '_blank');
}


// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, whatsappNumber, brandName }: { product: Product; whatsappNumber: string; brandName: string }) {
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

  if (!activeVariant || !activeVariant.variant_images?.length) return null;

  return (
    <article className="group cursor-pointer">
      <div className="relative bg-secondary aspect-[4/5] mb-4 overflow-hidden">
        {prevImage && (
          <div className="absolute inset-0 z-10 carousel-fade-out">
            <AppImage src={prevImage} alt="" fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
          </div>
        )}
        <div className={`absolute inset-0 z-20 ${isTransitioning ? 'carousel-fade-in' : ''}`}>
          <AppImage
            src={activeVariant.variant_images[activeImageIdx]?.url}
            alt={activeVariant.variant_images[activeImageIdx]?.alt || product.name}
            fill className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>

        {product.tag && (
          <span className="absolute top-4 left-4 z-30 bg-foreground text-primary-foreground text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 font-sans font-medium">
            {product.tag}
          </span>
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
            className={`w-5 h-5 rounded-full transition-all duration-300 ${vi === activeVariantIdx ? 'ring-2 ring-offset-2 ring-foreground scale-110' : 'hover:scale-110 ring-1 ring-border'}`}
            style={{ backgroundColor: variant.hex }} />
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

// ─── Collection Page Content ──────────────────────────────────────────────────
function CollectionContent() {
  const brandName = useBrand();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState<Product[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState('1234567890');
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  useEffect(() => {
    async function loadData() {
      const [{ data: pData }, { data: sData }] = await Promise.all([
        supabase.from('products').select(`*, product_variants(*, variant_images(*))`)
          .eq('is_active', true).order('sort_order'),
        supabase.from('site_settings').select('value').eq('key', 'whatsapp_number').single(),
      ]);
      const prods = (pData as Product[]) || [];
      setProducts(prods);
      setCategories(['All', ...Array.from(new Set(prods.map(p => p.category)))]);
      if (sData) setWhatsappNumber((sData as any).value || '1234567890');
      setLoading(false);
    }
    loadData();
  }, []);

  const parsePrice = (p: string) => parseFloat(p.replace(/[^0-9.]/g, '')) || 0;

  const filtered = products
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-asc') return parsePrice(a.price) - parsePrice(b.price);
      if (sortBy === 'price-desc') return parsePrice(b.price) - parsePrice(a.price);
      return 0;
    });

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Page hero */}
      <div className="pt-32 pb-12 px-6 lg:px-12 bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-sans mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">Collection</span>
          </div>
          <h1 className="font-serif text-foreground mb-4" style={{ fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 300 }}>
            Full Collection
          </h1>
          <p className="text-muted-foreground font-sans text-sm">
            {loading ? '...' : `${filtered.length} piece${filtered.length !== 1 ? 's' : ''}${activeCategory !== 'All' ? ` in ${activeCategory}` : ''}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border bg-transparent text-foreground text-sm font-sans focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground" />
          </div>

          {/* Sort */}
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
            className="border border-border bg-transparent text-foreground text-xs font-sans px-4 py-2.5 focus:outline-none focus:border-foreground transition-colors uppercase tracking-wider cursor-pointer">
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-10">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-xs tracking-[0.15em] uppercase font-sans font-medium transition-all duration-300 border ${
                activeCategory === cat
                  ? 'bg-foreground text-primary-foreground border-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground'
              }`}>
              {cat}
              {cat !== 'All' && !loading && (
                <span className="ml-1.5 opacity-50">({products.filter(p => p.category === cat).length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-secondary mb-3" />
                <div className="h-3 bg-secondary rounded mb-2 w-2/3" />
                <div className="h-4 bg-secondary rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="font-serif text-foreground text-2xl font-light mb-3">Nothing found</h2>
            <p className="text-muted-foreground text-sm font-sans mb-8">Try a different search or category.</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All'); }}
              className="border border-foreground text-foreground text-xs tracking-widest uppercase px-8 py-3 font-sans hover:bg-foreground hover:text-primary-foreground transition-colors">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} brandName={brandName} />
            ))}
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppFloating />
    </main>
  );
}

export default function CollectionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm font-sans">Loading collection...</div>
      </div>
    }>
      <CollectionContent />
    </Suspense>
  );
}
