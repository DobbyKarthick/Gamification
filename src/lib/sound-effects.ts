// Sound Effects Utility for Gamification Games
// Uses Web Audio API for cross-browser compatibility

class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private isEnabled: boolean = false;
  private isInitialized: boolean = false;
  private activeSounds: Map<string, AudioBufferSourceNode> = new Map();
  private intervalTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    // Don't initialize audio context immediately - wait for user interaction
    if (typeof window !== 'undefined') {
      this.setupUserInteractionHandler();
    }
  }

  private setupUserInteractionHandler() {
    // Listen for first user interaction to initialize audio context
    const initAudio = () => {
      if (!this.isInitialized) {
        this.initAudioContext();
        this.isInitialized = true;
        // Remove listeners after initialization
        document.removeEventListener('click', initAudio);
        document.removeEventListener('touchstart', initAudio);
        document.removeEventListener('keydown', initAudio);
      }
    };

    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('Audio context initialized successfully');
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      this.initAudioContext();
    }
    
    // Resume audio context if suspended (required by browsers)
    if (this.audioContext?.state === 'suspended') {
      try {
        await this.audioContext.resume();
        console.log('Audio context resumed');
      } catch (error) {
        console.warn('Failed to resume audio context:', error);
      }
    }
  }

  // Generate simple sound effects using Web Audio API
  private generateSound(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer | null {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 3); // Simple decay envelope
      output[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
    }

    return buffer;
  }

  // Generate continuous/looping sound for wheel spinning
  private generateContinuousSound(frequency: number, volume: number = 0.15, type: OscillatorType = 'sawtooth'): AudioBuffer | null {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.5; // 500ms loop
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      let value = 0;

      switch (type) {
        case 'sine':
          value = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'sawtooth':
          value = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
          break;
        case 'square':
          value = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
          break;
        case 'triangle':
          value = 2 * Math.abs(2 * (t * frequency - Math.floor(t * frequency + 0.5))) - 1;
          break;
      }

      // Apply gentle envelope for continuous sound
      const envelope = 0.5 + 0.5 * Math.sin(2 * Math.PI * 2 * t); // Subtle modulation
      output[i] = value * volume * envelope;
    }

    return buffer;
  }

  // Generate realistic wheel spin sound with dynamics
  private generateRealisticWheelSpin(duration: number = 4.0): AudioBuffer | null {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const output = buffer.getChannelData(0);

    // Wheel spin parameters
    const startFreq = 400; // Start with higher frequency
    const endFreq = 150;   // End with lower frequency
    const startVolume = 0.25;
    const endVolume = 0.05;

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const progress = t / duration;
      
      // Ease-out curve for frequency and volume
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
      
      // Interpolate frequency and volume
      const currentFreq = startFreq + (endFreq - startFreq) * easedProgress;
      const currentVolume = startVolume + (endVolume - startVolume) * easedProgress;
      
      // Generate base sound with multiple harmonics for realism
      let value = 0;
      
      // Primary frequency (main tone)
      value += 0.6 * Math.sin(2 * Math.PI * currentFreq * t);
      
      // Second harmonic (adds richness)
      value += 0.3 * Math.sin(2 * Math.PI * currentFreq * 2 * t);
      
      // Third harmonic (adds metallic quality)
      value += 0.1 * Math.sin(2 * Math.PI * currentFreq * 3 * t);
      
      // Add subtle noise for mechanical feel
      const noise = (Math.random() - 0.5) * 0.05;
      value += noise;
      
      // Apply envelope with bounce effect at the end
      let envelope = 1.0;
      
      // Main envelope - starts strong, fades out
      envelope *= 0.3 + 0.7 * Math.exp(-progress * 2);
      
      // Add bounce effect in the last 20% of the sound
      if (progress > 0.8) {
        const bounceProgress = (progress - 0.8) / 0.2;
        const bounce = Math.sin(bounceProgress * Math.PI * 8) * Math.exp(-bounceProgress * 3);
        envelope += bounce * 0.3;
      }
      
      // Apply volume and envelope
      output[i] = value * currentVolume * envelope;
    }

    return buffer;
  }

  // Generate wheel tick sound (for segment passing)
  private generateWheelTick(): AudioBuffer | null {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.08; // 80ms tick
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const output = buffer.getChannelData(0);

    const frequency = 1200; // High frequency tick
    const volume = 0.15;

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      
      // Generate tick sound with quick attack and decay
      const envelope = Math.exp(-t * 20); // Quick decay
      const value = Math.sin(2 * Math.PI * frequency * t) * envelope;
      
      output[i] = value * volume;
    }

    return buffer;
  }

  // Generate wheel stop sound with bounce
  private generateWheelStop(): AudioBuffer | null {
    if (!this.audioContext) return null;

    const sampleRate = this.audioContext.sampleRate;
    const duration = 0.6; // 600ms stop sound
    const buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const output = buffer.getChannelData(0);

    const baseFreq = 300;
    const volume = 0.2;

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const progress = t / duration;
      
      // Create bounce effect with multiple oscillations
      const bounce1 = Math.sin(progress * Math.PI * 4) * Math.exp(-progress * 4);
      const bounce2 = Math.sin(progress * Math.PI * 6) * Math.exp(-progress * 6) * 0.5;
      const bounce3 = Math.sin(progress * Math.PI * 8) * Math.exp(-progress * 8) * 0.25;
      
      const envelope = bounce1 + bounce2 + bounce3;
      
      // Generate tone with slight frequency modulation
      const freqMod = 1 + 0.1 * Math.sin(progress * Math.PI * 2);
      const value = Math.sin(2 * Math.PI * baseFreq * freqMod * t);
      
      output[i] = value * envelope * volume;
    }

    return buffer;
  }

  // Play a sound effect
  async playSound(soundName: string, options: { volume?: number; pitch?: number } = {}) {
    if (!this.isEnabled) return;

    await this.ensureAudioContext();
    
    if (!this.audioContext) {
      console.warn('Audio context not available');
      return;
    }

    let buffer: AudioBuffer | null = null;

    // Generate different sound effects
    switch (soundName) {
      case 'click':
        buffer = this.generateSound(800, 0.1, 'sine');
        break;
      case 'success':
        buffer = this.generateSound(523, 0.2, 'sine'); // C5
        break;
      case 'prize':
        buffer = this.generateSound(659, 0.3, 'sine'); // E5
        break;
      case 'win':
        // Play a chord
        this.playChord([523, 659, 784], 0.5); // C5, E5, G5
        return;
      case 'error':
        buffer = this.generateSound(200, 0.3, 'sawtooth');
        break;
      case 'pop':
        buffer = this.generateSound(1000, 0.05, 'square');
        break;
      case 'ding':
        buffer = this.generateSound(440, 0.2, 'triangle');
        break;
      case 'crack':
        buffer = this.generateSound(150, 0.4, 'sawtooth');
        break;
      case 'sparkle':
        buffer = this.generateSound(1200, 0.1, 'sine');
        break;
      case 'confetti':
        this.playRandomNotes([523, 659, 784, 1047], 0.8);
        return;
      case 'wheel-spin':
        buffer = this.generateRealisticWheelSpin(4.0); // 4-second realistic spin
        break;
      case 'wheel-tick':
        buffer = this.generateWheelTick(); // Realistic tick sound
        break;
      case 'wheel-stop':
        buffer = this.generateWheelStop(); // Realistic stop with bounce
        break;
      case 'lever-pull':
        buffer = this.generateSound(150, 0.2, 'sawtooth');
        break;
      case 'slot-spin':
        buffer = this.generateSound(400, 0.1, 'square');
        break;
      default:
        buffer = this.generateSound(440, 0.1, 'sine');
    }

    if (buffer) {
      this.playBuffer(buffer, options);
    }
  }

  // Play a chord (multiple frequencies)
  private playChord(frequencies: number[], duration: number) {
    if (!this.audioContext) return;

    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        const buffer = this.generateSound(freq, duration);
        if (buffer) {
          this.playBuffer(buffer, { volume: 0.2 });
        }
      }, index * 50);
    });
  }

  // Play random notes for confetti effect
  private playRandomNotes(frequencies: number[], duration: number) {
    if (!this.audioContext) return;

    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const randomFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
        const buffer = this.generateSound(randomFreq, duration * 0.5);
        if (buffer) {
          this.playBuffer(buffer, { volume: 0.15 });
        }
      }, i * 100);
    }
  }

  // Play an audio buffer
  private playBuffer(buffer: AudioBuffer, options: { volume?: number; pitch?: number } = {}) {
    if (!this.audioContext) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Apply volume
    gainNode.gain.value = options.volume || 0.3;

    // Apply pitch if specified
    if (options.pitch) {
      source.playbackRate.value = options.pitch;
    }

    source.start();
  }

  // Play continuous/looping sound
  async playContinuousSound(soundName: string, soundId: string, options: { volume?: number; pitch?: number } = {}) {
    if (!this.isEnabled) return;

    await this.ensureAudioContext();
    
    if (!this.audioContext) {
      console.warn('Audio context not available');
      return;
    }

    // Stop existing sound with same ID
    this.stopSound(soundId);

    let buffer: AudioBuffer | null = null;

    // Generate continuous sound
    switch (soundName) {
      case 'wheel-spin':
        buffer = this.generateContinuousSound(300, options.volume || 0.15, 'sawtooth');
        break;
      case 'slot-spinning-sound':
        buffer = this.generateContinuousSound(200, options.volume || 0.2, 'square');
        break;
      default:
        console.warn('Unknown continuous sound:', soundName);
        return;
    }

    if (buffer) {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      source.loop = true; // Enable looping
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Apply volume
      gainNode.gain.value = options.volume || 0.15;

      // Apply pitch if specified
      if (options.pitch) {
        source.playbackRate.value = options.pitch;
      }

      // Store active sound
      this.activeSounds.set(soundId, source);

      source.start();
    }
  }

  // Play interval sound (for wheel ticks)
  async playIntervalSound(soundName: string, soundId: string, interval: number, options: { volume?: number; pitch?: number } = {}) {
    if (!this.isEnabled) return;

    await this.ensureAudioContext();
    
    if (!this.audioContext) {
      console.warn('Audio context not available');
      return;
    }

    // Stop existing interval with same ID
    this.stopInterval(soundId);

    const playTick = async () => {
      await this.playSound(soundName, options);
    };

    // Start interval
    const timer = setInterval(playTick, interval);
    this.intervalTimers.set(soundId, timer);

    // Play first tick immediately
    await playTick();
  }

  // Stop a specific sound
  stopSound(soundId: string) {
    const source = this.activeSounds.get(soundId);
    if (source) {
      try {
        source.stop();
      } catch (error) {
        // Sound might already be stopped
      }
      this.activeSounds.delete(soundId);
    }
  }

  // Stop a specific interval
  stopInterval(soundId: string) {
    const timer = this.intervalTimers.get(soundId);
    if (timer) {
      clearInterval(timer);
      this.intervalTimers.delete(soundId);
    }
  }

  // Stop all sounds and intervals
  stopAllSounds() {
    // Stop all active sounds
    this.activeSounds.forEach((source, soundId) => {
      try {
        source.stop();
      } catch (error) {
        // Sound might already be stopped
      }
    });
    this.activeSounds.clear();

    // Clear all intervals
    this.intervalTimers.forEach((timer) => {
      clearInterval(timer);
    });
    this.intervalTimers.clear();
  }

  // Enable/disable sound effects
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // Get current enabled state
  isSoundEnabled(): boolean {
    return this.isEnabled;
  }

  // Game-specific sound effects
  async playGameSound(game: string, action: string) {
    switch (game) {
      case 'memory':
        if (action === 'flip') await this.playSound('click');
        else if (action === 'match') await this.playSound('success');
        else if (action === 'complete') await this.playSound('win');
        break;
      case 'mystery':
        if (action === 'crack') await this.playSound('crack');
        else if (action === 'reveal') await this.playSound('prize');
        else if (action === 'rare') await this.playSound('confetti');
        else if (action === 'legendary') await this.playSound('win');
        break;
      case 'wheel':
        if (action === 'spin') await this.playSound('pop');
        else if (action === 'stop') await this.playSound('ding');
        break;
      case 'scratch':
        if (action === 'scratch') await this.playSound('pop');
        else if (action === 'reveal') await this.playSound('prize');
        break;
      case 'gift':
        if (action === 'select') await this.playSound('click');
        else if (action === 'reveal') await this.playSound('prize');
        break;
      case 'plinko':
        if (action === 'drop') await this.playSound('pop');
        else if (action === 'land') await this.playSound('ding');
        break;
      case 'quiz':
        if (action === 'correct') await this.playSound('success');
        else if (action === 'incorrect') await this.playSound('error');
        break;
      case 'slot':
        if (action === 'lever-pull') await this.playSound('lever-pull');
        else if (action === 'win') await this.playSound('win');
        break;
      default:
        await this.playSound('click');
    }
  }
}

// Create a singleton instance
export const soundManager = new SoundManager();

// Export convenience functions
export const playSound = async (soundName: string, options?: { volume?: number; pitch?: number }) => {
  await soundManager.playSound(soundName, options);
};

export const playGameSound = async (game: string, action: string) => {
  await soundManager.playGameSound(game, action);
};

// New continuous and interval sound functions
export const playContinuousSound = async (soundName: string, soundId: string, options?: { volume?: number; pitch?: number }) => {
  await soundManager.playContinuousSound(soundName, soundId, options);
};

export const playIntervalSound = async (soundName: string, soundId: string, interval: number, options?: { volume?: number; pitch?: number }) => {
  await soundManager.playIntervalSound(soundName, soundId, interval, options);
};

export const stopSound = (soundId: string) => {
  soundManager.stopSound(soundId);
};

export const stopInterval = (soundId: string) => {
  soundManager.stopInterval(soundId);
};

export const stopAllSounds = () => {
  soundManager.stopAllSounds();
};

export const setSoundEnabled = (enabled: boolean) => {
  soundManager.setEnabled(enabled);
};

export const isSoundEnabled = () => {
  return soundManager.isSoundEnabled();
}; 