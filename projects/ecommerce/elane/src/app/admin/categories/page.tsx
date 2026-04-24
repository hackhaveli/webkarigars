'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase, Category } from '@/lib/supabase';

const EMPTY: Omit<Category, 'id'> = {
  name: '', count: '0 styles', image: '', alt: '', sort_order: 0, is_active: true,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<typeof EMPTY>({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = useCallback(async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    setCategories((data as Category[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditing({ id: 'new', ...EMPTY });
    setForm({ ...EMPTY });
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, count: cat.count, image: cat.image, alt: cat.alt || '', sort_order: cat.sort_order, is_active: cat.is_active });
  };

  const save = async () => {
    if (!form.name || !form.image) return;
    setSaving(true);

    if (editing?.id === 'new') {
      const { data } = await supabase.from('categories').insert(form).select().single();
      setCategories(prev => [...prev, data as Category].sort((a, b) => a.sort_order - b.sort_order));
    } else {
      await supabase.from('categories').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing!.id);
      setCategories(prev => prev.map(c => c.id === editing!.id ? { ...c, ...form } : c));
    }

    setSaving(false);
    setEditing(null);
    showToast(editing?.id === 'new' ? 'Category created!' : 'Category updated!');
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await supabase.from('categories').delete().eq('id', id);
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast('Category deleted');
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('categories').update({ is_active: !current }).eq('id', id);
    setCategories(prev => prev.map(c => c.id === id ? { ...c, is_active: !current } : c));
    showToast(!current ? 'Category enabled' : 'Category hidden');
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
          <h1 className="text-white text-2xl font-bold">Categories</h1>
          <p className="text-white/40 text-sm mt-1">{categories.length} categories configured</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-white text-[#0a0a0a] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/90 transition-colors">
          + Add Category
        </button>
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-white font-bold mb-5">{editing.id === 'new' ? 'New Category' : 'Edit Category'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5 tracking-wider uppercase">Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                  placeholder="e.g. T-Shirts" />
              </div>
              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5 tracking-wider uppercase">Count Label</label>
                <input type="text" value={form.count} onChange={e => setForm(f => ({ ...f, count: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                  placeholder="e.g. 12 styles" />
              </div>
              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5 tracking-wider uppercase">Image URL *</label>
                <input type="text" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                  placeholder="https://..." />
                {form.image && (
                  <img src={form.image} alt="" className="mt-2 w-24 h-24 object-cover rounded-xl border border-white/10" />
                )}
              </div>
              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5 tracking-wider uppercase">Alt Text</label>
                <input type="text" value={form.alt} onChange={e => setForm(f => ({ ...f, alt: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                  placeholder="Descriptive text for accessibility" />
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
                <span className="text-white/60 text-sm">{form.is_active ? 'Visible on site' : 'Hidden'}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)}
                className="flex-1 py-2.5 border border-white/10 text-white/60 rounded-xl text-sm hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button onClick={save} disabled={saving || !form.name || !form.image}
                className="flex-1 py-2.5 bg-white text-[#0a0a0a] rounded-xl text-sm font-bold hover:bg-white/90 disabled:opacity-40 transition-colors">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-[#111] border border-white/8 rounded-2xl p-4 animate-pulse">
              <div className="aspect-[3/4] bg-white/5 rounded-xl mb-3" />
              <div className="h-4 bg-white/5 rounded mb-2" />
              <div className="h-3 bg-white/5 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className={`bg-[#111] border border-white/8 rounded-2xl overflow-hidden hover:border-white/15 transition-all ${!cat.is_active ? 'opacity-50' : ''}`}>
              <div className="relative aspect-[3/4] overflow-hidden">
                <img src={cat.image} alt={cat.alt || cat.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
                {!cat.is_active && (
                  <div className="absolute top-2 right-2 bg-red-500/80 text-white text-[10px] px-2 py-1 rounded-full">Hidden</div>
                )}
              </div>
              <div className="p-4">
                <div className="text-white font-semibold text-sm mb-1">{cat.name}</div>
                <div className="text-white/40 text-xs mb-3">{cat.count}</div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(cat)}
                    className="flex-1 py-2 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors">
                    Edit
                  </button>
                  <button onClick={() => toggleActive(cat.id, cat.is_active)}
                    className={`p-2 rounded-lg transition-colors ${cat.is_active ? 'text-green-400/70 hover:bg-green-400/10' : 'text-white/30 hover:bg-white/5'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button onClick={() => remove(cat.id, cat.name)}
                    className="p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
