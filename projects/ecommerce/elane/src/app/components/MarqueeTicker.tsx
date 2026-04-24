'use client';

import React from 'react';

const ITEMS = [
  'Premium Cotton',
  '★',
  'Free Delivery',
  '★',
  'Minimal Design',
  '★',
  'Made With Love',
  '★',
  'Streetwear Redefined',
  '★',
  'Every Colour, Every Mood',
  '★',
  'Premium Cotton',
  '★',
  'Free Delivery',
  '★',
  'Minimal Design',
  '★',
  'Made With Love',
  '★',
  'Streetwear Redefined',
  '★',
  'Every Colour, Every Mood',
  '★',
];

export default function MarqueeTicker() {
  return (
    <div className="w-full overflow-hidden bg-foreground py-3.5 select-none">
      <div className="marquee-track">
        {ITEMS.map((item, i) => (
          <span
            key={i}
            className="text-primary-foreground font-sans text-[11px] tracking-[0.3em] uppercase mx-6 whitespace-nowrap"
            style={{ opacity: item === '★' ? 0.5 : 0.85 }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
