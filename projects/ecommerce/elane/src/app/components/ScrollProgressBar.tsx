'use client';

import React, { useEffect, useState } from 'react';

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Trigger once on mount just in case
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-[2.5px] pointer-events-none transition-all duration-100"
      style={{
        width: `${progress}%`,
        background: 'linear-gradient(90deg, var(--accent) 0%, var(--foreground) 100%)',
        boxShadow: '0 0 8px rgba(200,168,130,0.6)',
      }}
    />
  );
}
