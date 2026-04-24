'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface VariantImageForm {
  id?: string;
  url: string;
  alt: string;
  sort_order: number;
}

interface VariantForm {
  id?: string;
  name: string;
  hex: string;
  sort_order: number;
  images: VariantImageForm[];
}

interface ProductForm {
  name: string;
  price: string;
  category: string;
  tag: string;
  sort_order: number;
  is_active: boolean;
}

const CATEGORIES = ['T-Shirts', 'Hoodies', 'Bottoms', 'Essentials', 'Accessories', 'Outerwear'];

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';
  const productId = isNew ? null : params.id as string;

  const [form, setForm] = useState<ProductForm>({
    name: '', price: '', category: 'T-Shirts', tag: '', sort_order: 0, is_active: true,
  });
  const [variants, setVariants] = useState<VariantForm[]>([
    { name: 'White', hex: '#E8E2D8', sort_order: 1, images: [{ url: '', alt: '', sort_order: 1 }] }
  ]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [activeVariant, setActiveVariant] = useState(0);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const loadProduct = useCallback(async () => {
    if (!productId) return;
    const { data } = await supabase
      .from('products')
      .select(`*, product_variants(*, variant_images(*))`)
      .eq('id', productId)
      .single();

    if (data) {
      setForm({
        name: data.name, price: data.price, category: data.category,
        tag: data.tag || '', sort_order: data.sort_order, is_active: data.is_active,
      });
      const v = (data.product_variants || []).sort((a: any, b: any) => a.sort_order - b.sort_order);
      setVariants(v.map((variant: any) => ({
        id: variant.id,
        name: variant.name,
        hex: variant.hex,
        sort_order: variant.sort_order,
        images: (variant.variant_images || []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((img: any) => ({
          id: img.id, url: img.url, alt: img.alt || '', sort_order: img.sort_order,
        })),
      })));
    }
    setLoading(false);
  }, [productId]);

  useEffect(() => { loadProduct(); }, [loadProduct]);

  const save = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);

    try {
      let pid = productId;

      if (isNew) {
        const { data } = await supabase.from('products').insert({
          name: form.name, price: form.price, category: form.category,
          tag: form.tag || null, sort_order: form.sort_order, is_active: form.is_active,
        }).select().single();
        pid = data?.id;
      } else {
        await supabase.from('products').update({
          name: form.name, price: form.price, category: form.category,
          tag: form.tag || null, sort_order: form.sort_order, is_active: form.is_active,
          updated_at: new Date().toISOString(),
        }).eq('id', pid);
      }

      // Handle variants
      for (let vi = 0; vi < variants.length; vi++) {
        const variant = variants[vi];
        let variantId = variant.id;

        if (!variantId) {
          const { data } = await supabase.from('product_variants').insert({
            product_id: pid, name: variant.name, hex: variant.hex, sort_order: variant.sort_order,
          }).select().single();
          variantId = data?.id;
        } else {
          await supabase.from('product_variants').update({
            name: variant.name, hex: variant.hex, sort_order: variant.sort_order,
          }).eq('id', variantId);
        }

        // Handle images
        for (let ii = 0; ii < variant.images.length; ii++) {
          const img = variant.images[ii];
          if (!img.url) continue;
          if (!img.id) {
            await supabase.from('variant_images').insert({
              variant_id: variantId, url: img.url, alt: img.alt, sort_order: img.sort_order,
            });
          } else {
            await supabase.from('variant_images').update({
              url: img.url, alt: img.alt, sort_order: img.sort_order,
            }).eq('id', img.id);
          }
        }
      }

      showToast(isNew ? 'Product created!' : 'Product saved!');
      if (isNew) router.replace('/admin/products');
    } catch (err) {
      showToast('Error saving product');
    }
    setSaving(false);
  };

  const addVariant = () => {
    setVariants(prev => [...prev, {
      name: 'New Color', hex: '#888888', sort_order: prev.length + 1,
      images: [{ url: '', alt: '', sort_order: 1 }]
    }]);
    setActiveVariant(variants.length);
  };

  const removeVariant = async (vi: number) => {
    const variant = variants[vi];
    if (variant.id) {
      await supabase.from('product_variants').delete().eq('id', variant.id);
    }
    setVariants(prev => prev.filter((_, i) => i !== vi));
    setActiveVariant(Math.max(0, vi - 1));
  };

  const updateVariant = (vi: number, field: keyof VariantForm, value: any) => {
    setVariants(prev => prev.map((v, i) => i === vi ? { ...v, [field]: value } : v));
  };

  const addImage = (vi: number) => {
    setVariants(prev => prev.map((v, i) => i === vi ? {
      ...v, images: [...v.images, { url: '', alt: '', sort_order: v.images.length + 1 }]
    } : v));
  };

  const removeImage = async (vi: number, ii: number) => {
    const img = variants[vi].images[ii];
    if (img.id) await supabase.from('variant_images').delete().eq('id', img.id);
    setVariants(prev => prev.map((v, i) => i === vi ? {
      ...v, images: v.images.filter((_, j) => j !== ii)
    } : v));
  };

  const updateImage = (vi: number, ii: number, field: keyof VariantImageForm, value: string) => {
    setVariants(prev => prev.map((v, i) => i === vi ? {
      ...v, images: v.images.map((img, j) => j === ii ? { ...img, [field]: value } : img)
    } : v));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <svg className="animate-spin w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#1a1a1a] border border-white/15 text-white text-sm px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <span className="text-green-400">✓</span> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => router.back()} className="text-white/40 hover:text-white text-sm flex items-center gap-2 mb-3 transition-colors">
            ← Back
          </button>
          <h1 className="text-white text-2xl font-bold">{isNew ? 'New Product' : 'Edit Product'}</h1>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-white text-[#0a0a0a] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-white/90 disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Saving...</>
          ) : '💾 Save Product'}
        </button>
      </div>

      {/* Basic Info */}
      <div className="bg-[#111] border border-white/8 rounded-2xl p-6 space-y-5">
        <h2 className="text-white font-semibold text-sm tracking-wider uppercase">Product Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/50 text-xs font-medium mb-2 tracking-wider uppercase">Name *</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
              placeholder="e.g. Oversized Essential Tee" />
          </div>
          <div>
            <label className="block text-white/50 text-xs font-medium mb-2 tracking-wider uppercase">Price *</label>
            <input type="text" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
              placeholder="e.g. $58" />
          </div>
          <div>
            <label className="block text-white/50 text-xs font-medium mb-2 tracking-wider uppercase">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-white/50 text-xs font-medium mb-2 tracking-wider uppercase">Tag (optional)</label>
            <input type="text" value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
              placeholder="e.g. Bestseller, New, Limited" />
          </div>
          <div>
            <label className="block text-white/50 text-xs font-medium mb-2 tracking-wider uppercase">Sort Order</label>
            <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors" />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <button
              onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${form.is_active ? 'bg-green-500' : 'bg-white/15'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
            <span className="text-white/60 text-sm">{form.is_active ? 'Visible on site' : 'Hidden from site'}</span>
          </div>
        </div>
      </div>

      {/* Color Variants */}
      <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-sm tracking-wider uppercase">Color Variants</h2>
          <button onClick={addVariant}
            className="flex items-center gap-2 text-white/60 hover:text-white border border-white/15 hover:border-white/25 px-4 py-2 rounded-xl text-sm transition-all">
            + Add Color
          </button>
        </div>

        {/* Variant tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {variants.map((v, vi) => (
            <button
              key={vi}
              onClick={() => setActiveVariant(vi)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeVariant === vi ? 'bg-white text-[#0a0a0a]' : 'text-white/50 hover:text-white hover:bg-white/8'}`}
            >
              <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: v.hex }} />
              {v.name}
            </button>
          ))}
        </div>

        {/* Active variant editor */}
        {variants[activeVariant] && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/50 text-xs font-medium mb-2 tracking-wider uppercase">Color Name</label>
                <input type="text" value={variants[activeVariant].name}
                  onChange={e => updateVariant(activeVariant, 'name', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors" />
              </div>
              <div>
                <label className="block text-white/50 text-xs font-medium mb-2 tracking-wider uppercase">Hex Color</label>
                <div className="flex gap-2">
                  <input type="color" value={variants[activeVariant].hex}
                    onChange={e => updateVariant(activeVariant, 'hex', e.target.value)}
                    className="w-12 h-11 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                  <input type="text" value={variants[activeVariant].hex}
                    onChange={e => updateVariant(activeVariant, 'hex', e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors" />
                </div>
              </div>
              <div className="flex items-end">
                {variants.length > 1 && (
                  <button onClick={() => removeVariant(activeVariant)}
                    className="w-full py-3 text-sm text-red-400/70 hover:text-red-400 border border-red-400/20 hover:border-red-400/40 rounded-xl transition-colors">
                    Remove Color
                  </button>
                )}
              </div>
            </div>

            {/* Images for this variant */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-white/50 text-xs font-medium tracking-wider uppercase">Images</label>
                <button onClick={() => addImage(activeVariant)}
                  className="text-white/40 hover:text-white text-xs transition-colors">
                  + Add Image
                </button>
              </div>
              <div className="space-y-3">
                {variants[activeVariant].images.map((img, ii) => (
                  <div key={ii} className="bg-white/3 border border-white/8 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      {/* Preview */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                        {img.url ? (
                          <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">IMG</div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input type="text" value={img.url}
                          onChange={e => updateImage(activeVariant, ii, 'url', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-white/25 transition-colors"
                          placeholder="Image URL (https://...)" />
                        <input type="text" value={img.alt}
                          onChange={e => updateImage(activeVariant, ii, 'alt', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-white/25 transition-colors"
                          placeholder="Alt text (for SEO & accessibility)" />
                      </div>
                      {variants[activeVariant].images.length > 1 && (
                        <button onClick={() => removeImage(activeVariant, ii)}
                          className="text-red-400/40 hover:text-red-400 transition-colors flex-shrink-0 mt-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
