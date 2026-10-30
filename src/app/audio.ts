import { getState, subscribe } from './store';

export type Sound = 'tap' | 'correct' | 'wrong' | 'stars' | 'purchase';
let context: AudioContext | undefined;
let musicTimer: ReturnType<typeof setInterval> | undefined;
let unlocked = false;
let noteIndex = 0;
const voices = new Set<{ oscillator: OscillatorNode; gain: GainNode; music: boolean }>();

function tone(frequency: number, delay: number, duration: number, music = false): void {
  if (!context || context.state !== 'running') return;
  const volume = getState().options.volume;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const voice = { oscillator, gain, music };
  voices.add(voice);
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  const at = context.currentTime + delay;
  gain.gain.setValueAtTime(0, at);
  gain.gain.linearRampToValueAtTime(volume * (music ? 0.025 : 0.09), at + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.onended = () => {
    oscillator.disconnect();
    gain.disconnect();
    voices.delete(voice);
  };
  oscillator.start(at);
  oscillator.stop(at + duration + 0.02);
}

export function play(name: Sound): void {
  if (!getState().options.sfx) return;
  try {
    const notes: Record<Sound, number[]> = {
      tap: [440],
      correct: [523, 659],
      wrong: [330, 294],
      stars: [523, 659, 784],
      purchase: [392, 523, 659],
    };
    notes[name].forEach((frequency, index) => tone(frequency, index * 0.1, 0.28));
  } catch {
    /* Áudio opcional. */
  }
}

export function stopMusic(): void {
  if (musicTimer !== undefined) clearInterval(musicTimer);
  musicTimer = undefined;
  for (const voice of voices) {
    if (voice.music) {
      try {
        voice.oscillator.stop();
      } catch {
        /* Já terminou. */
      }
    }
  }
}

export function startMusic(): void {
  if (!unlocked || !context || !getState().options.music || musicTimer !== undefined) return;
  const next = (): void => {
    try {
      tone([261.63, 329.63, 392, 440, 392, 329.63, 293.66, 329.63][noteIndex++ % 8]!, 0, 2, true);
    } catch {
      stopMusic();
    }
  };
  next();
  musicTimer = setInterval(next, 2400);
}

export function syncAudio(): void {
  stopMusic();
  for (const voice of voices) {
    if (!voice.music) {
      try {
        voice.oscillator.stop();
      } catch {
        /* J? terminou. */
      }
    }
  }
  if (getState().options.music) startMusic();
}

function unlock(event: Event): void {
  if (!event.isTrusted) return;
  try {
    context ??= new AudioContext();
    unlocked = true;
    void context
      .resume()
      .then(startMusic)
      .catch(() => {});
  } catch {
    /* O jogo funciona sem WebAudio. */
  }
}
document.addEventListener('pointerdown', unlock, { once: true, capture: true });
document.addEventListener('keydown', unlock, { once: true, capture: true });
let previousOptions = getState().options;
subscribe((state) => {
  if (previousOptions !== state.options) {
    previousOptions = state.options;
    syncAudio();
  }
});
