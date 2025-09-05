import React from 'react';

interface MusicWaveAnimationProps {
  isPlaying: boolean;
  playbackRate: number;
}

export const MusicWaveAnimation: React.FC<MusicWaveAnimationProps> = ({
  isPlaying,
  playbackRate
}) => {
  if (!isPlaying) return null;

  // Ajustar la velocidad de animación basada en el playback rate
  const animationDuration = 1.5 / playbackRate;

  return (
    <div className="flex items-center space-x-1">
      {[...Array(7)].map((_, index) => (
        <div
          key={index}
          className="bg-gradient-to-t from-fire-600 to-fire-400 rounded-full shadow-sm"
          style={{
            width: '3px',
            height: '16px',
            animation: `wave ${animationDuration}s ease-in-out infinite`,
            animationDelay: `${index * 0.1}s`,
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes wave {
          0%, 100% {
            transform: scaleY(0.3);
            opacity: 0.6;
          }
          50% {
            transform: scaleY(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};