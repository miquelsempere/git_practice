import React from 'react';

interface BastoIconProps {
  size?: number;
  className?: string;
}

export const BastoIcon: React.FC<BastoIconProps> = ({ 
  size = 24, 
  className = "" 
}) => {
  return (
    <img
      src="/images/Generated Image September 04, 2025 - 1_45PM (1).png"
      alt="Basto español"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        filter: 'drop-shadow(0 0 0 transparent)',
        background: 'transparent',
        mixBlendMode: 'multiply'
      }}
    />
  );
};