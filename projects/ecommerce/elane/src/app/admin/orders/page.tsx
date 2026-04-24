'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase, Order } from '@/lib/supabase';

const STATUS_COLORS: Record<Order['status'], string> = {
  new:       'bg-blue-500/20 text-blue-300 border-blue-500/30',
  contacted: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  confirmed: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  shipped:   'bg-orange-500/20 text-orange-300 border-orange-500/30',
  completed: 'bg-green-500/20 text-green-300 border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const STATUS_EMOJI: Record<Order['status'], string> = {
  new: '🔔', contacted: '💬', confirmed: '✅', shipped: '🚚', completed: '🎉', cancelled: '❌',
};

const ALL_STATUSES: Order['status'][] = ['new', 'contacted', 'confirmed', 'shipped', 'completed', 'cancelled'];

const EMPTY_MANUAL = { product_name: '', color_name: '', customer_name: '', customer_phone: '', notes: '', status: 'new' as Order['status'] };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Order['status'] | 'all'>('all');
  const [notesModal, setNotesModal] = useState<Order | null>(null);
  const [notes, setNotes] = useState('');
  const [manualModal, setManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({ ...EMPTY_MANUAL });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = useCallback(async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders((data as Order[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: Order['status']) => {
    await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    showToast(`Moved to "${status}"`);
  };

  const saveNotes = async () => {
    if (!notesModal) return;
    await supabase.from('orders').update({ notes, updated_at: new Date().toISOString() }).eq('id', notesModal.id);
    setOrders(prev => prev.map(o => o.id === notesModal.id ? { ...o, notes } : o));
    setNotesModal(null);
    showToast('Notes saved');
  };

  const deleteOrder = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return;
    await supabase.from('orders').delete().eq('id', id);
    setOrders(prev => prev.filter(o => o.id !== id));
    showToast('Inquiry deleted');
  };

  const addManual = async () => {
    if (!manualForm.product_name) return;
    setSaving(true);
    const { data } = await supabase.from('orders').insert({
      product_name: manualForm.product_name,
      color_name: manualForm.color_name || null,
      customer_name: manualForm.customer_name || null,
      customer_phone: manualForm.customer_phone || null,
      notes: manualForm.notes || null,
      status: manualForm.status,
    }).select().single();
    if (data) setOrders(prev => [data as Order, ...prev]);
    setManualForm({ ...EMPTY_MANUAL });
    setManualModal(false);
    setSaving(false);
    showToast('Order added manually');
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const newCount = orders.filter(o => o.status === 'new').length;

  // Pipeline counts
  const pipeline = ALL_STATUSES.map(s => ({ status: s, count: orders.filter(o => o.status === s).length }));

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#1a1a1a] border border-white/15 text-white text-sm px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <span className="text-green-400">✓</span> {toast}
        </div>
      )}

      {/* Notes Modal */}
      {notesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-white font-bold mb-1">Add Notes</h2>
            <p className="text-white/40 text-sm mb-4">{notesModal.product_name}{notesModal.color_name ? ` · ${notesModal.color_name}` : ''}</p>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors resize-none"
              placeholder="Customer size, address, special instructions..." />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setNotesModal(null)} className="flex-1 py-2.5 border border-white/10 text-white/60 rounded-xl text-sm hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={saveNotes} className="flex-1 py-2.5 bg-white text-[#0a0a0a] rounded-xl text-sm font-bold hover:bg-white/90 transition-colors">Save Notes</button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Modal */}
      {manualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-white font-bold mb-1">Add Manual Order</h2>
            <p className="text-white/40 text-sm mb-5">For phone calls, DMs, or walk-in customers</p>
            <div className="space-y-4">
              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5 tracking-wider uppercase">Product Name *</label>
                <input type="text" value={manualForm.product_name} onChange={e => setManualForm(f => ({ ...f, product_name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                  placeholder="e.g. Oversized Essential Tee" />
              </div>
              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5 tracking-wider uppercase">Color</label>
                <input type="text" value={manualForm.color_name} onChange={e => setManualForm(f => ({ ...f, color_name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                  placeholder="e.g. White, Black" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5 tracking-wider uppercase">Customer Name</label>
                  <input type="text" value={manualForm.customer_name} onChange={e => setManualForm(f => ({ ...f, customer_name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                    placeholder="Rahul S." />
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5 tracking-wider uppercase">Phone (WhatsApp)</label>
                  <input type="text" value={manualForm.customer_phone} onChange={e => setManualForm(f => ({ ...f, customer_phone: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                    placeholder="919999888877" />
                </div>
              </div>
              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5 tracking-wider uppercase">Status</label>
                <select value={manualForm.status} onChange={e => setManualForm(f => ({ ...f, status: e.target.value as Order['status'] }))}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors capitalize">
                  {ALL_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-white/50 text-xs font-medium mb-1.5 tracking-wider uppercase">Notes</label>
                <textarea value={manualForm.notes} onChange={e => setManualForm(f => ({ ...f, notes: e.target.value }))} rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors resize-none"
                  placeholder="Size, address, special requests..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setManualModal(false); setManualForm({ ...EMPTY_MANUAL }); }}
                className="flex-1 py-2.5 border border-white/10 text-white/60 rounded-xl text-sm hover:bg-white/5 transition-colors">Cancel</button>
              <button onClick={addManual} disabled={saving || !manualForm.product_name}
                className="flex-1 py-2.5 bg-white text-[#0a0a0a] rounded-xl text-sm font-bold hover:bg-white/90 disabled:opacity-40 transition-colors">
                {saving ? 'Adding...' : 'Add Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold flex items-center gap-3">
            Orders & Inquiries
            {newCount > 0 && (
              <span className="text-sm bg-blue-500 text-white px-2.5 py-0.5 rounded-full font-medium animate-pulse">{newCount} new</span>
            )}
          </h1>
          <p className="text-white/40 text-sm mt-1">{orders.length} total inquiries · auto-captured from WhatsApp taps on site</p>
        </div>
        <button onClick={() => setManualModal(true)}
          className="flex items-center gap-2 bg-white text-[#0a0a0a] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/90 transition-colors">
          + Add Manual Order
        </button>
      </div>

      {/* How it works banner */}
      <div className="bg-blue-500/8 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-blue-400 text-lg mt-0.5">💡</span>
        <div>
          <p className="text-blue-300 text-sm font-medium mb-1">How orders get here automatically</p>
          <p className="text-blue-300/60 text-xs leading-relaxed">
            Every time a customer clicks <strong className="text-blue-300/80">"Order via WhatsApp"</strong> on your site, the product and colour are instantly logged here as a <span className="text-blue-400 font-medium">New</span> inquiry. Then you contact them on WhatsApp and update the status as the order progresses → Contacted → Confirmed → Shipped → Completed.
          </p>
        </div>
      </div>

      {/* Pipeline overview */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {pipeline.map(({ status, count }) => (
          <button key={status} onClick={() => setFilter(status)}
            className={`bg-[#111] border rounded-xl p-3 text-center transition-all hover:border-white/20 ${filter === status ? 'border-white/30 bg-white/5' : 'border-white/8'}`}>
            <div className="text-lg mb-1">{STATUS_EMOJI[status]}</div>
            <div className="text-white font-bold text-lg">{count}</div>
            <div className="text-white/30 text-[10px] capitalize tracking-wider">{status}</div>
          </button>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${filter === 'all' ? 'bg-white text-[#0a0a0a]' : 'text-white/50 hover:text-white border border-white/10 hover:border-white/20'}`}>
          All ({orders.length})
        </button>
        {ALL_STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${filter === s ? 'bg-white text-[#0a0a0a]' : 'text-white/50 hover:text-white border border-white/10 hover:border-white/20'}`}>
            {STATUS_EMOJI[s]} {s} ({orders.filter(o => o.status === s).length})
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="bg-[#111] border border-white/8 rounded-2xl p-5 animate-pulse h-20" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111] border border-white/8 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-4">📬</div>
          <div className="text-white font-semibold text-sm mb-2">
            {filter === 'all' ? 'No inquiries yet' : `No ${filter} orders`}
          </div>
          <p className="text-white/30 text-xs max-w-xs mx-auto">
            {filter === 'all'
              ? 'When customers tap "Order via WhatsApp" on your site, their inquiries appear here automatically.'
              : `No orders with status "${filter}" right now.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-[#111] border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border uppercase tracking-wider flex-shrink-0 ${STATUS_COLORS[order.status]}`}>
                      {STATUS_EMOJI[order.status]} {order.status}
                    </span>
                    <span className="text-white font-semibold text-sm truncate">{order.product_name || 'Unknown Product'}</span>
                    {order.color_name && <span className="text-white/40 text-xs flex-shrink-0">· {order.color_name}</span>}
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    {order.customer_name && (
                      <div className="text-white/50 text-xs flex items-center gap-1">
                        <span>👤</span> {order.customer_name}
                      </div>
                    )}
                    {order.customer_phone && (
                      <a href={`https://wa.me/${order.customer_phone}`} target="_blank"
                        className="text-green-400/70 hover:text-green-400 text-xs transition-colors flex items-center gap-1">
                        <span>💬</span> WhatsApp {order.customer_phone}
                      </a>
                    )}
                  </div>

                  {order.notes && (
                    <p className="text-white/30 text-xs mt-1.5 bg-white/3 rounded-lg px-3 py-2 italic border border-white/5">
                      📝 {order.notes}
                    </p>
                  )}
                  <div className="text-white/20 text-xs mt-2">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <select value={order.status} onChange={e => updateStatus(order.id, e.target.value as Order['status'])}
                    className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-1.5 text-white/70 text-xs focus:outline-none focus:border-white/25 transition-colors capitalize">
                    {ALL_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                  <button onClick={() => { setNotesModal(order); setNotes(order.notes || ''); }}
                    title="Add notes"
                    className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => deleteOrder(order.id)}
                    title="Delete"
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
