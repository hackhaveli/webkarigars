'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { supabase, SiteSetting } from '@/lib/supabase';

const SETTINGS_GROUPS = [
  {
    title: 'General',
    icon: '🏪',
    keys: [
      { key: 'site_name', label: 'Site Name', type: 'text', placeholder: 'ÉLANE' },
      { key: 'whatsapp_number', label: 'WhatsApp Number', type: 'text', placeholder: '1234567890 (no + prefix)' },
      { key: 'announcement_bar', label: 'Announcement Bar Text', type: 'text', placeholder: 'Free delivery on all orders' },
      { key: 'announcement_bar_enabled', label: 'Show Announcement Bar', type: 'toggle' },
    ],
  },
  {
    title: 'Hero Section',
    icon: '🦸',
    keys: [
      { key: 'hero_headline', label: 'Main Headline', type: 'text', placeholder: 'Redefining Street Elegance' },
      { key: 'hero_subtext', label: 'Sub Text', type: 'text', placeholder: 'Premium cotton. Timeless streetwear.' },
      { key: 'hero_image', label: 'Hero Background Image URL', type: 'text', placeholder: '/assets/images/hero.jpg or https://...' },
      { key: 'hero_stat_1_value', label: 'Stat 1 Value', type: 'text', placeholder: '100%' },
      { key: 'hero_stat_1_label', label: 'Stat 1 Label', type: 'text', placeholder: 'Premium Cotton' },
      { key: 'hero_stat_2_value', label: 'Stat 2 Value', type: 'text', placeholder: '500+' },
      { key: 'hero_stat_2_label', label: 'Stat 2 Label', type: 'text', placeholder: 'Happy Customers' },
      { key: 'hero_stat_3_value', label: 'Stat 3 Value', type: 'text', placeholder: 'Free' },
      { key: 'hero_stat_3_label', label: 'Stat 3 Label', type: 'text', placeholder: 'Delivery' },
    ],
  },
  {
    title: 'Collection Section',
    icon: '👕',
    keys: [
      { key: 'collection_year', label: 'Collection Label', type: 'text', placeholder: 'Collection 2026' },
      { key: 'collection_title', label: 'Section Title', type: 'text', placeholder: 'The Essentials' },
      { key: 'collection_subtitle', label: 'Section Subtitle', type: 'textarea', placeholder: 'Each piece designed for...' },
    ],
  },
  {
    title: 'Social Links',
    icon: '🌐',
    keys: [
      { key: 'instagram_url', label: 'Instagram URL', type: 'text', placeholder: 'https://instagram.com/elane' },
      { key: 'twitter_url', label: 'Twitter / X URL', type: 'text', placeholder: 'https://twitter.com/elane' },
      { key: 'facebook_url', label: 'Facebook URL', type: 'text', placeholder: 'https://facebook.com/elane' },
    ],
  },
  {
    title: 'Footer',
    icon: '👣',
    keys: [
      { key: 'footer_tagline', label: 'Footer Tagline', type: 'text', placeholder: 'Premium streetwear, redefined.' },
    ],
  },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = useCallback(async () => {
    const { data } = await supabase.from('site_settings').select('*');
    const map: Record<string, string> = {};
    (data as SiteSetting[] || []).forEach(s => { map[s.key] = s.value || ''; });
    setSettings(map);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveAll = async () => {
    setSaving(true);
    const updates = Object.entries(settings).map(([key, value]) =>
      supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    );
    await Promise.all(updates);
    setSaving(false);
    showToast('All settings saved! Refresh the site to see changes.');
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
    <div className="max-w-3xl mx-auto space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#1a1a1a] border border-white/15 text-white text-sm px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <span className="text-green-400">✓</span> {toast}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold">Site Settings</h1>
          <p className="text-white/40 text-sm mt-1">Control all text, links and configs on your store</p>
        </div>
        <button onClick={saveAll} disabled={saving}
          className="flex items-center gap-2 bg-white text-[#0a0a0a] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-white/90 disabled:opacity-50 transition-colors">
          {saving ? (
            <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Saving...</>
          ) : '💾 Save All Settings'}
        </button>
      </div>

      {SETTINGS_GROUPS.map(group => (
        <div key={group.title} className="bg-[#111] border border-white/8 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl">{group.icon}</span>
            <h2 className="text-white font-semibold text-sm tracking-wider uppercase">{group.title}</h2>
          </div>
          <div className="space-y-4">
            {group.keys.map(field => (
              <div key={field.key}>
                <label className="block text-white/50 text-xs font-medium mb-1.5 tracking-wider uppercase">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={settings[field.key] || ''}
                    onChange={e => update(field.key, e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors resize-none"
                    placeholder={field.placeholder}
                  />
                ) : field.type === 'toggle' ? (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => update(field.key, settings[field.key] === 'true' ? 'false' : 'true')}
                      className={`relative w-12 h-6 rounded-full transition-colors ${settings[field.key] === 'true' ? 'bg-green-500' : 'bg-white/15'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings[field.key] === 'true' ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                    <span className="text-white/50 text-sm">{settings[field.key] === 'true' ? 'Enabled' : 'Disabled'}</span>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={settings[field.key] || ''}
                    onChange={e => update(field.key, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Save footer */}
      <div className="sticky bottom-0 bg-[#0a0a0a]/80 backdrop-blur border-t border-white/8 rounded-2xl p-4 flex items-center justify-between">
        <p className="text-white/30 text-xs">Changes will reflect on your live site after saving</p>
        <button onClick={saveAll} disabled={saving}
          className="bg-white text-[#0a0a0a] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-white/90 disabled:opacity-50 transition-colors">
          {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>
    </div>
  );
}
