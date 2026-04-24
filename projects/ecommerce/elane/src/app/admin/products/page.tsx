'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase, Product } from '@/lib/supabase';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select(`*, product_variants(*, variant_images(*))`)
      .order('sort_order', { ascending: true });
    setProducts((data as Product[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('products').update({ is_active: !current }).eq('id', id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p));
    showToast(!current ? 'Product enabled' : 'Product hidden from site');
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleting(null);
    showToast('Product deleted');
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#1a1a1a] border border-white/15 text-white text-sm px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in">
          <span className="text-green-400">✓</span> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold">Products</h1>
          <p className="text-white/40 text-sm mt-1">{products.length} items in your collection</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-white text-[#0a0a0a] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#111] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-white/25 text-sm transition-colors"
        />
      </div>

      {/* Products table */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-[#111] border border-white/8 rounded-2xl p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/5 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/5 rounded w-48" />
                  <div className="h-3 bg-white/5 rounded w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111] border border-white/8 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-4">👕</div>
          <div className="text-white/50 text-sm">No products found</div>
          <Link href="/admin/products/new" className="mt-4 inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors">
            + Add your first product
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(product => {
            const firstVariant = product.product_variants?.[0];
            const firstImage = firstVariant?.variant_images?.[0]?.url;
            return (
              <div
                key={product.id}
                className={`bg-[#111] border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all ${!product.is_active ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                    {firstImage ? (
                      <img src={firstImage} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">👕</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold text-sm truncate">{product.name}</span>
                      {product.tag && (
                        <span className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full tracking-wider uppercase">
                          {product.tag}
                        </span>
                      )}
                      {!product.is_active && (
                        <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full tracking-wider uppercase">
                          Hidden
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                      <span>{product.category}</span>
                      <span>·</span>
                      <span className="font-semibold text-white/70">{product.price}</span>
                      <span>·</span>
                      <span>{product.product_variants?.length || 0} colors</span>
                    </div>

                    {/* Color swatches */}
                    <div className="flex items-center gap-1.5 mt-2">
                      {product.product_variants?.slice(0, 8).map(v => (
                        <div
                          key={v.id}
                          className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"
                          style={{ backgroundColor: v.hex }}
                          title={v.name}
                        />
                      ))}
                      {(product.product_variants?.length || 0) > 8 && (
                        <span className="text-white/30 text-xs">+{(product.product_variants?.length || 0) - 8}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleActive(product.id, product.is_active)}
                      title={product.is_active ? 'Hide from site' : 'Show on site'}
                      className={`p-2 rounded-lg transition-colors ${product.is_active ? 'text-green-400 hover:bg-green-400/10' : 'text-white/30 hover:bg-white/5'}`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={product.is_active ? 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' : 'M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'} />
                      </svg>
                    </button>
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => deleteProduct(product.id, product.name)}
                      disabled={deleting === product.id}
                      className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      {deleting === product.id ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
