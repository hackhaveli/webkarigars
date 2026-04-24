'use client';

import React, { useEffect, useRef } from 'react';

export default function CursorSparkle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: {
      x: number; y: number; vx: number; vy: number;
      life: number; maxLife: number; size: number; hue: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let mx = -999, my = -999;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 0.5;
        particles.push({
          x: mx + (Math.random() - 0.5) * 6,
          y: my + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.8,
          life: 1,
          maxLife: Math.random() * 40 + 25,
          size: Math.random() * 3 + 1,
          hue: Math.random() > 0.5 ? 35 : 0, // gold or dark
        });
      }
    };
    window.addEventListener('mousemove', onMove);

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.life > 0);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // gravity
        p.vx *= 0.97;
        p.life -= 1 / p.maxLife;

        const alpha = Math.max(0, p.life);
        const radius = Math.max(0, p.size * p.life);

        ctx.save();
        ctx.globalAlpha = alpha * 0.85;
        // Gold sparkles on light bg, use dark accent
        if (p.hue === 35) {
          ctx.fillStyle = `hsl(35, 60%, 55%)`; // warm gold
        } else {
          ctx.fillStyle = `hsl(0, 0%, 15%)`; // near-black
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9998 }}
    />
  );
}
