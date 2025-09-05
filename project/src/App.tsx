import React, { useState } from 'react';
import { Mic2 } from 'lucide-react';
import { PaloSelector } from './components/PaloSelector';
import { PlaybackControls } from './components/PlaybackControls';
import { SpeedControl } from './components/SpeedControl';
import { PitchControl } from './components/PitchControl';
import { StatusDisplay } from './components/StatusDisplay';
import { useAudioPlayer } from './hooks/useAudioPlayer';

function App() {
  const [selectedPalo, setSelectedPalo] = useState('tangos');
  const {
    audioState,
    startPlayback,
    stopPlayback,
    updatePlaybackRate,
    resetPlaybackRate,
    updatePitch,
    resetPitch
  } = useAudioPlayer();

  const handlePlay = () => {
    startPlayback(selectedPalo);
  };

  const handleStop = () => {
    stopPlayback();
  };

  const handleSpeedChange = (rate: number) => {
    updatePlaybackRate(rate);
  };

  const handlePitchChange = (semitones: number) => {
    updatePitch(semitones);
  };

  const showControls = audioState.status.includes('Cargados') || audioState.isPlaying || audioState.status === 'Preparado...' || audioState.status === 'Reproducción detenida';

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-fire-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Mic2 className="text-fire-500" size={32} />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-fire-500 to-flame-500 bg-clip-text text-transparent">
                Cantaor App
              </h1>
            </div>
            <p className="text-gray-300 text-lg font-medium">
              Practica el acompañamiento al cante con tus artistas favoritos
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-dark-800 rounded-2xl shadow-2xl border border-dark-700 overflow-hidden backdrop-blur-sm">
            <div className="p-8 space-y-8">
              {/* Palo Selector */}
              <PaloSelector
                selectedPalo={selectedPalo}
                onPaloChange={setSelectedPalo}
                disabled={audioState.isPlaying}
              />

              {/* Speed Control */}
              <SpeedControl
                playbackRate={audioState.playbackRate}
                onSpeedChange={handleSpeedChange}
                onResetSpeed={resetPlaybackRate}
                isVisible={showControls}
              />

              {/* Pitch Control */}
              <PitchControl
                pitchSemitones={audioState.pitchSemitones}
                onPitchChange={handlePitchChange}
                onResetPitch={resetPitch}
                isVisible={showControls}
                selectedPalo={selectedPalo}
              />

              {/* Status Display */}
              <StatusDisplay
                status={audioState.status}
                compasInfo={audioState.compasInfo}
                isPlaying={audioState.isPlaying}
                playbackRate={audioState.playbackRate}
              />
            </div>
            
            {/* Playback Controls */}
            <div className="p-8 pt-0">
              <PlaybackControls
                isPlaying={audioState.isPlaying}
                onPlay={handlePlay}
                onStop={handleStop}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-flamenco-700 text-sm font-medium">
            <p className="text-gray-400">Diseñado para guitarristas que buscan perfeccionar el acompañamiento al cante</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;