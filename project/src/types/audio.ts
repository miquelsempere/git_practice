export interface AudioFile {
  name: string;
  path: string;
}

export interface Palo {
  name: string;
  audioFiles: string[];
  description?: string;
}

export interface AudioState {
  isPlaying: boolean;
  currentAudioIndex: number;
  currentCycle: number;
  audioQueue: number[];
  playbackRate: number;
  pitchSemitones: number;
  status: string;
  compasInfo: string;
  currentPaloKey: string;
}