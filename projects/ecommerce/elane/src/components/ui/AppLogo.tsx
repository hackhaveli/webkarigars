'use client';

import React, { memo, useMemo } from 'react';
import AppIcon from './AppIcon';
import Image from 'next/image';

interface AppLogoProps {
  src?: string;
  iconName?: string;
  size?: number;
  className?: string;
  onClick?: () => void;
}

const AppLogo = memo(function AppLogo({
  src = '/assets/images/app_logo.png',
  iconName = 'SparklesIcon',
  size = 64,
  className = '',
  onClick,
}: AppLogoProps) {
  const containerClassName = useMemo(() => {
    const classes = ['flex items-center flex-shrink-0'];
    if (onClick) classes.push('cursor-pointer hover:opacity-80 transition-opacity');
    if (className) classes.push(className);
    return classes.join(' ');
  }, [onClick, className]);

  return (
    <div className={containerClassName} onClick={onClick} style={{ width: size, height: size }}>
      {src ? (
        <Image
          src={src}
          alt="Logo"
          width={size}
          height={size}
          priority
          // Ensure both dimensions scale together — suppresses the Next.js aspect ratio warning
          style={{ width: size, height: size, objectFit: 'contain' }}
          unoptimized={src.endsWith('.svg')}
        />
      ) : (
        <AppIcon name={iconName} size={size} className="flex-shrink-0" />
      )}
    </div>
  );
});

export default AppLogo;
