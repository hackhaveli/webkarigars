'use client';

import { useEffect } from 'react';

// Adds 3D tilt effect to all product cards globally
export default function Tilt3DInit() {
  useEffect(() => {
    const MAX_TILT = 8; // degrees
    const cards: HTMLElement[] = [];

    const apply = () => {
      document.querySelectorAll<HTMLElement>('.product-card, .testi-card, .cat-card').forEach(card => {
        if (!cards.includes(card)) {
          cards.push(card);

          const handleMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotateX = ((y - cy) / cy) * -MAX_TILT;
            const rotateY = ((x - cx) / cx) * MAX_TILT;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            card.style.transition = 'transform 0.1s ease';
          };

          const handleLeave = () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
            card.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
          };

          card.addEventListener('mousemove', handleMove);
          card.addEventListener('mouseleave', handleLeave);
        }
      });
    };

    // Apply immediately and after a delay (for dynamically loaded cards)
    apply();
    const t1 = setTimeout(apply, 800);
    const t2 = setTimeout(apply, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return null;
}
