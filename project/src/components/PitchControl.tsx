import React from 'react';
import { Music4, RotateCcw } from 'lucide-react';

interface PitchControlProps {
  pitchSemitones: number;
  onPitchChange: (semitones: number) => void;
  onResetPitch: () => void;
  isVisible: boolean;
  selectedPalo?: string;
}

export const PitchControl: React.FC<PitchControlProps> = ({
  pitchSemitones,
  onPitchChange,
  onResetPitch,
  isVisible,
  selectedPalo = ''
}) => {
  if (!isVisible) return null;

  const getPitchLabel = (semitones: number, palo: string): string => {
    if (palo === 'tangos') {
      // Para tangos, usar terminología flamenca "por medio"
      const baseNumber = 5; // 5 por medio es el tono original
      const currentNumber = baseNumber + semitones;
      return `Al ${currentNumber} por medio`;
    } else {
      // Para otros palos, usar la terminología tradicional
      if (semitones === 0) return 'Tono Original';
      if (semitones > 0) return `+${semitones} semitonos`;
      return `${semitones} semitonos`;
    }
  };

  const getPitchDescription = (semitones: number): string => {
    if (semitones === 0) return 'Sin cambio de tono';
    if (semitones === 4) return 'Máximo agudo';
    if (semitones === -4) return 'Máximo grave';
    if (semitones > 0) return 'Más agudo';
    return 'Más grave';
  };

  return (
    <div className="bg-dark-700 p-6 rounded-xl border border-dark-600 shadow-lg">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <Music4 className="text-gold-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-100">Control de Tono</h3>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <input
            type="range"
            min="-4"
            max="4"
            step="1"
            value={pitchSemitones}
            onChange={(e) => onPitchChange(parseInt(e.target.value))}
            className="w-full h-3 bg-dark-600 rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r 
                       [&::-webkit-slider-thumb]:from-gold-500 [&::-webkit-slider-thumb]:to-gold-600
                       [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                       [&::-webkit-slider-thumb]:shadow-gold-500/50
                       [&::-webkit-slider-thumb]:hover:from-gold-400 [&::-webkit-slider-thumb]:hover:to-gold-500 
                       [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:border-2 
                       [&::-webkit-slider-thumb]:border-dark-800"
          />
          {/* Marcas del slider */}
          <div className="absolute top-0 left-0 w-full h-3 pointer-events-none">
            {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((value) => {
              const percentage = ((value - (-4)) / (4 - (-4))) * 100;
              return (
                <div
                  key={value}
                  className={`absolute w-0.5 h-3 rounded-full ${
                    value === 0 ? 'bg-gold-400 w-1' : 'bg-gold-600/60'
                  }`}
                  style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
                />
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-2xl font-bold text-gold-400">{getPitchLabel(pitchSemitones, selectedPalo)}</div>
          </div>
          
          <button
            onClick={onResetPitch}
            className="flex items-center space-x-2 px-4 py-2 bg-dark-600 text-gray-300 
                       rounded-lg font-medium hover:bg-dark-500 hover:text-gray-100
                       transition-all duration-200 border border-dark-500"
          >
            <RotateCcw size={16} />
            <span>Tono Original</span>
          </button>
        </div>
      </div>
    </div>
  );
};