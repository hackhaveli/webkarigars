'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Stats {
  products: number;
  categories: number;
  testimonials: number;
  orders: number;
  newOrders: number;
}

const STAT_CARDS = [
  { label: 'Total Products', key: 'products', icon: '👕', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/20', href: '/admin/products' },
  { label: 'Categories', key: 'categories', icon: '🗂️', color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/20', href: '/admin/categories' },
  { label: 'Testimonials', key: 'testimonials', icon: '⭐', color: 'from-yellow-500/20 to-yellow-600/10', border: 'border-yellow-500/20', href: '/admin/testimonials' },
  { label: 'New Orders', key: 'newOrders', icon: '📦', color: 'from-green-500/20 to-green-600/10', border: 'border-green-500/20', href: '/admin/orders' },
];

const QUICK_ACTIONS = [
  { label: 'Add Product', href: '/admin/products/new', icon: '➕', desc: 'Add new clothing item with variants' },
  { label: 'Add Category', href: '/admin/categories', icon: '🗂️', desc: 'Create a new shop category' },
  { label: 'Site Settings', href: '/admin/settings', icon: '⚙️', desc: 'Update hero, WhatsApp, social links' },
  { label: 'View Orders', href: '/admin/orders', icon: '📦', desc: 'Manage customer inquiries' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, categories: 0, testimonials: 0, orders: 0, newOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [
        { count: products },
        { count: categories },
        { count: testimonials },
        { count: orders },
        { count: newOrders },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('categories').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      ]);
      setStats({
        products: products || 0,
        categories: categories || 0,
        testimonials: testimonials || 0,
        orders: orders || 0,
        newOrders: newOrders || 0,
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-white text-2xl font-bold mb-1">Welcome back 👋</h1>
        <p className="text-white/40 text-sm">Here's what's happening with your ÉLANE store today.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(card => (
          <Link key={card.key} href={card.href}
            className={`bg-gradient-to-br ${card.color} border ${card.border} rounded-2xl p-5 hover:scale-[1.02] transition-transform`}
          >
            <div className="text-2xl mb-3">{card.icon}</div>
            <div className="text-white text-2xl font-bold mb-1">
              {loading ? <span className="animate-pulse">—</span> : stats[card.key as keyof Stats]}
            </div>
            <div className="text-white/50 text-xs font-medium">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map(action => (
            <Link
              key={action.label}
              href={action.href}
              className="bg-[#111] border border-white/8 rounded-2xl p-5 hover:bg-white/5 hover:border-white/15 transition-all group"
            >
              <div className="text-2xl mb-3 group-hover:scale-110 transition-transform inline-block">{action.icon}</div>
              <div className="text-white font-semibold text-sm mb-1">{action.label}</div>
              <div className="text-white/30 text-xs leading-relaxed">{action.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Live Site Banner */}
      <div className="bg-gradient-to-r from-white/5 to-white/2 border border-white/10 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white font-semibold text-sm">Site is Live</span>
          </div>
          <p className="text-white/30 text-xs">Changes you make here will reflect on your store immediately.</p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 bg-white text-[#0a0a0a] px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-white/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View Store
        </Link>
      </div>
    </div>
  );
}
