import React from 'react';
import { Info, Music2, Activity } from 'lucide-react';
import { MusicWaveAnimation } from './MusicWaveAnimation';

interface StatusDisplayProps {
  status: string;
  compasInfo: string;
  isPlaying: boolean;
  playbackRate: number;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({
  status,
  compasInfo,
  isPlaying,
  playbackRate
}) => {
  const isLoading = status.includes('Cargando');
  const isError = status.includes('Error');

  return (
    <div className="space-y-4">
      <div className="bg-dark-700 p-4 rounded-lg border-l-4 border-fire-500 shadow-lg">
        <div className="flex items-center space-x-2">
          {isPlaying ? (
            <Activity className="text-fire-500 animate-pulse" size={20} />
          ) : isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-fire-500"></div>
          ) : isError ? (
            <Info className="text-fire-500" size={20} />
          ) : (
            <Music2 className="text-flame-500" size={20} />
          )}
          <div className={`font-medium flex-1 ${isError ? 'text-fire-400' : isLoading ? 'text-fire-400' : 'text-gray-100'}`}>
            {status}
          </div>
          {isPlaying && (
            <MusicWaveAnimation isPlaying={isPlaying} playbackRate={playbackRate} />
          )}
        </div>
      </div>

      {compasInfo && !isPlaying && (
        <div className="bg-dark-600 p-3 rounded-lg border border-dark-500">
          <div className="text-sm font-medium text-gold-400 text-center">
            {compasInfo}
          </div>
        </div>
      )}
    </div>
  );
};