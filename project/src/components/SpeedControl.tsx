import React from 'react';
import { Gauge, RotateCcw } from 'lucide-react';

interface SpeedControlProps {
  playbackRate: number;
  onSpeedChange: (rate: number) => void;
  onResetSpeed: () => void;
  isVisible: boolean;
}

export const SpeedControl: React.FC<SpeedControlProps> = ({
  playbackRate,
  onSpeedChange,
  onResetSpeed,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-dark-700 p-6 rounded-xl border border-dark-600 shadow-lg">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <Gauge className="text-fire-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-100">Control de Velocidad</h3>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <input
            type="range"
            min="0.80"
            max="1.20"
            step="0.05"
            value={playbackRate}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-full h-3 bg-dark-600 rounded-lg appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r 
                       [&::-webkit-slider-thumb]:from-fire-500 [&::-webkit-slider-thumb]:to-fire-600
                       [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg
                       [&::-webkit-slider-thumb]:shadow-fire-500/50
                       [&::-webkit-slider-thumb]:hover:from-fire-400 [&::-webkit-slider-thumb]:hover:to-fire-500 
                       [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:border-2 
                       [&::-webkit-slider-thumb]:border-dark-800"
          />
          {/* Marcas del slider */}
          <div className="absolute top-0 left-0 w-full h-3 pointer-events-none">
            {[0.80, 0.85, 0.90, 0.95, 1.00, 1.05, 1.10, 1.15, 1.20].map((value) => {
              const percentage = ((value - 0.80) / (1.20 - 0.80)) * 100;
              return (
                <div
                  key={value}
                  className={`absolute w-0.5 h-3 rounded-full ${
                    value === 1.00 ? 'bg-fire-400 w-1' : 'bg-fire-600/60'
                  }`}
                  style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
                />
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-2xl font-bold text-fire-400">{playbackRate.toFixed(2)}x</div>
          </div>
          
          <button
            onClick={onResetSpeed}
            className="flex items-center space-x-2 px-4 py-2 bg-dark-600 text-gray-300 
                       rounded-lg font-medium hover:bg-dark-500 hover:text-gray-100
                       transition-all duration-200 border border-dark-500"
          >
            <RotateCcw size={16} />
            <span>Velocidad Normal</span>
          </button>
        </div>
      </div>
    </div>
  );
};