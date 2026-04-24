'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase, Testimonial } from '@/lib/supabase';

const EMPTY: Omit<Testimonial, 'id'> = {
  name: '', location: '', rating: 5, text: '', avatar_url: '', product_ref: '', is_active: true, sort_order: 0,
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(Testimonial & { isNew?: boolean }) | null>(null);
  const [form, setForm] = useState<typeof EMPTY>({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = useCallback(async () => {
    const { data } = await supabase.from('testimonials').select('*').order('sort_order');
    setTestimonials((data as Testimonial[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditing({ id: 'new', ...EMPTY, isNew: true } as any);
    setForm({ ...EMPTY });
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({ name: t.name, location: t.location || '', rating: t.rating, text: t.text, avatar_url: t.avatar_url || '', product_ref: t.product_ref || '', is_active: t.is_active, sort_order: t.sort_order });
  };

  const save = async () => {
    if (!form.name || !form.text) return;
    setSaving(true);

    const payload = { ...form, location: form.location || null, avatar_url: form.avatar_url || null, product_ref: form.product_ref || null };

    if ((editing as any)?.isNew) {
      const { data } = await supabase.from('testimonials').insert(payload).select().single();
      setTestimonials(prev => [...prev, data as Testimonial].sort((a, b) => a.sort_order - b.sort_order));
    } else {
      await supabase.from('testimonials').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing!.id);
      setTestimonials(prev => prev.map(t => t.id === editing!.id ? { ...t, ...payload } : t));
    }

    setSaving(false);
    setEditing(null);
    showToast((editing as any)?.isNew ? 'Testimonial added!' : 'Testimonial updated!');
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    setTestimonials(prev => prev.filter(t => t.id !== id));
    showToast('Testimonial deleted');
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('testimonials').update({ is_active: !current }).eq('id', id);
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, is_active: !current } : t));
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#1a1a1a] border border-white/15 text-white text-sm px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <span className="text-green-400">✓</span> {toast}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold">Testimonials</h1>
          <p className="text-white/40 text-sm mt-1">{testimonials.length} customer reviews</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-white text-[#0a0a0a] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/90 transition-colors">
          + Add Review
        </button>
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-white font-bold mb-5">{(editing as any).isNew ? 'New Review' : 'Edit Review'}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5 tracking-wider uppercase">Customer Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                    placeholder="Arjun S." />
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5 tracking-wider uppercase">Location</label>
                  <input type="text" value={form.location || ''} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                    placeholder="Mumbai" />
                </div>
              </div>

              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5 tracking-wider uppercase">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} onClick={() => setForm(f => ({ ...f, rating: star }))}
                      className={`text-2xl transition-transform hover:scale-110 ${star <= form.rating ? 'text-yellow-400' : 'text-white/15'}`}>
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5 tracking-wider uppercase">Review Text *</label>
                <textarea value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors resize-none"
                  placeholder="The quality is incredible..." />
              </div>

              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5 tracking-wider uppercase">Product Reference</label>
                <input type="text" value={form.product_ref || ''} onChange={e => setForm(f => ({ ...f, product_ref: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                  placeholder="e.g. Oversized Essential Tee" />
              </div>

              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5 tracking-wider uppercase">Sort Order</label>
                <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors" />
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.is_active ? 'bg-green-500' : 'bg-white/15'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
                <span className="text-white/60 text-sm">Show on site</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)}
                className="flex-1 py-2.5 border border-white/10 text-white/60 rounded-xl text-sm hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button onClick={save} disabled={saving || !form.name || !form.text}
                className="flex-1 py-2.5 bg-white text-[#0a0a0a] rounded-xl text-sm font-bold hover:bg-white/90 disabled:opacity-40 transition-colors">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-[#111] border border-white/8 rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-white/5 rounded w-40 mb-3" />
              <div className="h-3 bg-white/5 rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map(t => (
            <div key={t.id} className={`bg-[#111] border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all ${!t.is_active ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold text-sm">{t.name}</span>
                    {t.location && <span className="text-white/30 text-xs">· {t.location}</span>}
                    {!t.is_active && <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Hidden</span>}
                  </div>
                  <div className="text-yellow-400 text-sm mb-2">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                  <p className="text-white/50 text-sm leading-relaxed">{t.text}</p>
                  {t.product_ref && <p className="text-white/25 text-xs mt-2">Re: {t.product_ref}</p>}
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => toggleActive(t.id, t.is_active)}
                    className={`p-2 rounded-lg transition-colors ${t.is_active ? 'text-green-400/70 hover:bg-green-400/10' : 'text-white/20 hover:bg-white/5'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button onClick={() => openEdit(t)}
                    className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => remove(t.id)}
                    className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
