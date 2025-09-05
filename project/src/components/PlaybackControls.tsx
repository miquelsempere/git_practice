import React, { useState, useEffect } from 'react';
import { Play, Square } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  onPlay,
  onStop,
  disabled = false
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleToggle = () => {
    if (isPlaying) {
      onStop();
    } else {
      onPlay();
    }
  };

  const handleMouseDown = () => {
    if (!disabled) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  // Manejar tecla espacio
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !disabled) {
        event.preventDefault(); // Evitar scroll de página
        setIsPressed(true);
        handleToggle();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        setIsPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [disabled, isPlaying, onPlay, onStop]);

  return (
    <div className="flex justify-center">
      <button
        onClick={handleToggle}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        disabled={disabled}
        className={`flex items-center space-x-2 px-8 py-4 rounded-lg font-medium shadow-md
                   transform transition-all duration-150
                   disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none
                   ${isPressed && !disabled 
                     ? 'scale-95 shadow-sm' 
                     : 'hover:scale-105 hover:shadow-lg'
                   }
                   ${isPlaying 
                     ? `${isPressed && !disabled 
                         ? 'bg-gradient-to-br from-fire-700 via-fire-800 to-fire-900' 
                         : 'bg-gradient-to-br from-fire-600 via-fire-700 to-fire-800 hover:from-fire-700 hover:via-fire-800 hover:to-fire-900'
                       } text-white shadow-lg shadow-fire-500/25 bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-300` 
                     : `${isPressed && !disabled 
                         ? 'bg-gradient-to-br from-flame-700 via-flame-800 to-flame-900' 
                         : 'bg-gradient-to-br from-flame-600 via-flame-700 to-flame-800 hover:from-flame-700 hover:via-flame-800 hover:to-flame-900'
                       } text-white shadow-lg shadow-flame-500/25 bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-300`
                   }`}
      >
        {isPlaying ? <Square size={24} /> : <Play size={24} />}
        <span className="text-lg">{isPlaying ? 'Detener' : 'Comenzar'}</span>
      </button>
    </div>
  );
};