'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isText, setIsText] = useState(false);
  const [label, setLabel] = useState('');
  const [hidden, setHidden] = useState(true);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    let rx = window.innerWidth / 2, ry = window.innerHeight / 2; // ring position
    let dx = rx, dy = ry; // dot position (snappy)
    let raf: number;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      dx = e.clientX;
      dy = e.clientY;
      setHidden(false);
    };

    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    // Detect hoverable elements
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const isClickable = el.closest('a, button, [role="button"], input, select, textarea, label');
      const isImg = el.closest('.product-img-wrap, .category-card, .lookbook-card');
      const dataLabel = (isClickable as HTMLElement)?.getAttribute?.('data-cursor') || '';

      setIsHovering(!!isClickable);
      setIsText(!!isImg);
      setLabel(dataLabel);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    window.addEventListener('mouseover', onOver);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      // Ring follows with lag
      rx = lerp(rx, dx, 0.12);
      ry = lerp(ry, dy, 0.12);

      if (dot) {
        dot.style.transform = `translate(${dx - 4}px, ${dy - 4}px)`;
      }
      if (ring) {
        const size = isHovering ? 56 : isText ? 80 : 36;
        const offset = size / 2;
        ring.style.transform = `translate(${rx - offset}px, ${ry - offset}px)`;
        ring.style.width = `${size}px`;
        ring.style.height = `${size}px`;
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, [isHovering, isText, isClient]);

  if (!isClient) return null;

  return (
    <>
      {/* Inner dot — snappy, always at exact mouse position */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: isHovering ? 'var(--accent)' : '#fff',
          zIndex: 9999,
          transition: 'background-color 0.3s ease, transform 0.05s ease',
          opacity: hidden ? 0 : 1,
          mixBlendMode: 'difference',
        }}
      />

      {/* Outer ring — lagged, morphs on hover */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none flex items-center justify-center"
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: `1.5px solid ${isHovering ? 'var(--accent)' : '#fff'}`,
          zIndex: 9997,
          transition: 'width 0.45s cubic-bezier(0.34,1.56,0.64,1), height 0.45s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s ease, opacity 0.3s ease, background-color 0.3s ease',
          opacity: hidden ? 0 : isHovering ? 1 : 0.6,
          backgroundColor: isHovering ? 'transparent' : 'transparent',
          mixBlendMode: 'difference',
        }}
      >
        {label && (
          <span style={{
            fontSize: 9,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#fff',
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 500,
            userSelect: 'none',
          }}>
            {label}
          </span>
        )}
      </div>
    </>
  );
}
