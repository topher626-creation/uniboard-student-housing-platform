'use client';

import React, { memo } from 'react';
import AppIcon from './AppIcon';
import AppImage from './AppImage';

interface AppLogoProps {
  src?: string;
  iconName?: string;
  size?: number;
  className?: string;
  onClick?: () => void;
  showBackground?: boolean;
}

const AppLogo = memo(function AppLogo({
  src = '/images/updated uniboard logo.jpeg',
  iconName = 'SparklesIcon',
  size = 70,
  className = '',
  onClick,
  showBackground = false,
}: AppLogoProps) {
  const containerClassName = [
    'flex items-center',
    onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const imageWrapperClass = showBackground
    ? 'flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm p-1'
    : 'flex items-center justify-center';

  return (
    <div className={containerClassName} onClick={onClick} role={onClick ? 'button' : undefined}>
      {src ? (
        <div className={imageWrapperClass}>
          <AppImage
            src={src}
            alt="UniBoard — student accommodation platform"
            width={size}
            height={size}
            className="flex-shrink-0 rounded-lg object-contain"
            style={{ maxHeight: size, maxWidth: size }}
            priority
            unoptimized
          />
        </div>
      ) : (
        <AppIcon name={iconName} size={size} className="flex-shrink-0" />
      )}
    </div>
  );
});

export default AppLogo;
