import { Palo } from '../types/audio';

export const palos: Record<string, Palo> = {
  bulerias: {
    name: 'Bulerías por Soleá',
    audioFiles: [
      'audios/buleria1.mp3',
      'audios/buleria2.mp3',
      'audios/buleria3.mp3',
      'audios/buleria4.mp3'
    ],
    description: 'Compás de 12 tiempos, festivo y alegre'
  },
  solea: {
    name: 'Soleá',
    audioFiles: [
      'audios/solea1.mp3',
      'audios/solea2.mp3'
    ],
    description: 'Compás de 12 tiempos, solemne y profundo'
  },
  tangos: {
    name: 'Tangos',
    audioFiles: [
      'audios/tangos1.mp3',
      'audios/tangos2.mp3',
      'audios/tangos3.mp3'
    ],
    description: 'Compás de 4 tiempos, rítmico y enérgico'
  }
};