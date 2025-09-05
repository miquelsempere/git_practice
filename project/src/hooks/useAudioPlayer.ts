import { useState, useRef, useCallback, useEffect } from 'react';
import { AudioState } from '../types/audio';
import { palos } from '../config/palos';

export const useAudioPlayer = () => {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentAudioIndex: 0,
    currentCycle: 1,
    audioQueue: [],
    playbackRate: 1.0,
    pitchSemitones: 0,
    status: 'Preparado...',
    compasInfo: '',
    currentPaloKey: ''
  });

  // Variables globales como en el HTML original
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundTouchNodeRef = useRef<AudioWorkletNode | null>(null);
  const audioBuffersRef = useRef<AudioBuffer[]>([]);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const audioQueueRef = useRef<number[]>([]);
  const currentCycleRef = useRef<number>(1);
  const currentPaloKeyRef = useRef<string>('');

  // Función para mezclar array (exacta del original)
  const shuffleArray = useCallback((array: number[]): number[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  // Función para cargar audio (exacta del original)
  const loadAudio = useCallback(async (audioFile: string): Promise<AudioBuffer> => {
    const response = await fetch(audioFile);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }, []);

  // Función para reproducir audio (exacta del original)
  const playAudio = useCallback((audioBuffer: AudioBuffer, audioIndex: number) => {
    if (!isPlayingRef.current) return;

    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch (error) {
        // Ignore error if source wasn't started
      }
      currentSourceRef.current.disconnect();
    }

    currentSourceRef.current = audioContextRef.current!.createBufferSource();
    currentSourceRef.current.buffer = audioBuffer;
    currentSourceRef.current.connect(soundTouchNodeRef.current!);

    const audioName = palos[currentPaloKeyRef.current].audioFiles[audioIndex].split('/').pop();
    
    setAudioState(prev => ({
      ...prev,
      currentAudioIndex: audioIndex,
      status: `Reproduciendo: ${audioName}`
    }));

    currentSourceRef.current.onended = () => {
      if (isPlayingRef.current) {
        playNextAudio();
      }
    };

    currentSourceRef.current.start(0);
  }, []);

  // Función para reproducir siguiente audio (exacta del original)
  const playNextAudio = useCallback(() => {
    if (!isPlayingRef.current) return;

    if (audioQueueRef.current.length === 0) {
      audioQueueRef.current = shuffleArray([...Array(audioBuffersRef.current.length).keys()]);
      currentCycleRef.current++;
    }

    const nextIndex = audioQueueRef.current.pop()!;
    const audioBuffer = audioBuffersRef.current[nextIndex];
    
    setAudioState(prev => ({
      ...prev,
      currentCycle: currentCycleRef.current,
      audioQueue: [...audioQueueRef.current],
      compasInfo: `Ciclo ${currentCycleRef.current} - ${audioQueueRef.current.length} audios restantes`
    }));

    playAudio(audioBuffer, nextIndex);
  }, [shuffleArray, playAudio]);

  // Función para iniciar reproducción (exacta del original)
  const startPlayback = useCallback(async (paloKey: string) => {
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch (error) {
        // Ignore error if source wasn't started
      }
      currentSourceRef.current.disconnect();
      currentSourceRef.current = null;
    }

    isPlayingRef.current = true;
    currentPaloKeyRef.current = paloKey;
    
    setAudioState(prev => ({ 
      ...prev, 
      isPlaying: true,
      status: 'Cargando audios...',
      currentPaloKey: paloKey
    }));

    try {
      // Inicializar AudioContext
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      // Limpiar y recrear SoundTouch AudioWorklet
      if (soundTouchNodeRef.current) {
        soundTouchNodeRef.current.disconnect();
        soundTouchNodeRef.current = null;
      }
      
      try {
        await audioContextRef.current.audioWorklet.addModule('/soundtouch-worklet.js');
      } catch (error) {
        // Module might already be loaded, continue
      }
      
      soundTouchNodeRef.current = new AudioWorkletNode(audioContextRef.current, 'soundtouch-processor');
      soundTouchNodeRef.current.connect(audioContextRef.current.destination);
      
      // Configurar parámetros iniciales
      const tempoParam = soundTouchNodeRef.current.parameters.get('tempo');
      const pitchParam = soundTouchNodeRef.current.parameters.get('pitchSemitones');
      
      if (tempoParam) {
        tempoParam.setValueAtTime(audioState.playbackRate, audioContextRef.current.currentTime);
      }
      if (pitchParam) {
        pitchParam.setValueAtTime(audioState.pitchSemitones, audioContextRef.current.currentTime);
      }

      // Cargar audios
      const audioFiles = palos[paloKey].audioFiles;
      audioBuffersRef.current = [];
      
      for (const audioFile of audioFiles) {
        const buffer = await loadAudio(audioFile);
        audioBuffersRef.current.push(buffer);
      }

      // Crear cola inicial
      audioQueueRef.current = shuffleArray([...Array(audioBuffersRef.current.length).keys()]);
      currentCycleRef.current = 1;
      
      setAudioState(prev => ({
        ...prev,
        audioQueue: [...audioQueueRef.current],
        currentCycle: 1,
        status: `Cargados ${audioBuffersRef.current.length} audios`,
        compasInfo: `Ciclo 1 - ${audioQueueRef.current.length} audios`
      }));

      // Comenzar reproducción
      playNextAudio();
      
    } catch (error) {
      console.error('Error al cargar audios:', error);
      isPlayingRef.current = false;
      setAudioState(prev => ({ 
        ...prev, 
        isPlaying: false,
        status: 'Error al cargar audios' 
      }));
    }
  }, [loadAudio, shuffleArray, playNextAudio]);

  // Función para detener reproducción (exacta del original)
  const stopPlayback = useCallback(() => {
    isPlayingRef.current = false;
    
    if (currentSourceRef.current) {
      currentSourceRef.current.stop();
      currentSourceRef.current.disconnect();
      currentSourceRef.current = null;
    }
    
    if (soundTouchNodeRef.current) {
      soundTouchNodeRef.current.disconnect();
      soundTouchNodeRef.current = null;
    }
    
    // Resetear velocidad y tono a valores originales
    setAudioState(prev => ({ 
      ...prev, 
      isPlaying: false,
      status: 'Reproducción detenida',
      compasInfo: '',
      playbackRate: 1.0,
      pitchSemitones: 0
    }));
  }, []);

  // Función para actualizar velocidad de reproducción
  const updatePlaybackRate = useCallback((rate: number) => {
    setAudioState(prev => ({ ...prev, playbackRate: rate }));
    
    if (soundTouchNodeRef.current && audioContextRef.current && isPlayingRef.current) {
      const tempoParam = soundTouchNodeRef.current.parameters.get('tempo');
      if (tempoParam) {
        // Usar linearRampToValueAtTime para transiciones más suaves
        const currentTime = audioContextRef.current.currentTime;
        tempoParam.cancelScheduledValues(currentTime);
        tempoParam.setValueAtTime(tempoParam.value, currentTime);
        tempoParam.linearRampToValueAtTime(rate, currentTime + 0.1);
      }
    }
  }, []);

  // Función para resetear velocidad
  const resetPlaybackRate = useCallback(() => {
    updatePlaybackRate(1.0);
  }, [updatePlaybackRate]);

  // Función para actualizar tono
  const updatePitch = useCallback((semitones: number) => {
    setAudioState(prev => ({ ...prev, pitchSemitones: semitones }));
    
    if (soundTouchNodeRef.current && audioContextRef.current && isPlayingRef.current) {
      const pitchParam = soundTouchNodeRef.current.parameters.get('pitchSemitones');
      if (pitchParam) {
        // Usar linearRampToValueAtTime para transiciones más suaves
        const currentTime = audioContextRef.current.currentTime;
        pitchParam.cancelScheduledValues(currentTime);
        pitchParam.setValueAtTime(pitchParam.value, currentTime);
        pitchParam.linearRampToValueAtTime(semitones, currentTime + 0.1);
      }
    }
  }, []);

  // Función para resetear tono
  const resetPitch = useCallback(() => {
    updatePitch(0);
  }, [updatePitch]);

  // Limpieza al desmontar el componente
  useEffect(() => {
    return () => {
      if (currentSourceRef.current) {
        currentSourceRef.current.stop();
        currentSourceRef.current.disconnect();
      }
      if (soundTouchNodeRef.current) {
        soundTouchNodeRef.current.disconnect();
      }
    };
  }, []);

  return {
    audioState,
    startPlayback,
    stopPlayback,
    updatePlaybackRate,
    resetPlaybackRate,
    updatePitch,
    resetPitch
  };
};