'use client';

import { useEffect, useState, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#&';

function useScramble(finalText: string, delay = 0, duration = 1200) {
  const [display, setDisplay] = useState('');
  const started = useRef(false);

  useEffect(() => {
    if (!finalText || started.current) return;
    const timer = setTimeout(() => {
      started.current = true;
      const totalFrames = Math.round(duration / 40);
      let frame = 0;

      const tick = () => {
        frame++;
        const progress = Math.min(frame / totalFrames, 1);
        // Characters are revealed left to right as progress increases
        const revealedCount = Math.floor(progress * finalText.length);
        let result = '';
        for (let i = 0; i < finalText.length; i++) {
          if (i < revealedCount) {
            result += finalText[i];
          } else if (finalText[i] === ' ') {
            result += ' ';
          } else {
            result += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        setDisplay(result);
        if (progress < 1) setTimeout(tick, 40);
      };
      tick();
    }, delay);
    return () => clearTimeout(timer);
  }, [finalText, delay, duration]);

  return display || finalText;
}

export function ScrambleText({
  text,
  delay = 0,
  className = '',
  tag: Tag = 'span',
}: {
  text: string;
  delay?: number;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}) {
  const scrambled = useScramble(text, delay);
  return <Tag className={className}>{scrambled}</Tag>;
}
