/**
 * Web Audio API based sound synthesizer for NumberSprint
 * Works universally without external sound asset dependencies.
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private audioFeedbackEnabled: boolean = true;
  private isSpeaking: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public playCorrect(combo: number = 1) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pitch scales slightly with combo for dopamine boost!
      const baseFreq = Math.min(520 + (combo * 28), 980);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.33, now + 0.12);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Audio fallback
    }
  }

  public playWrong() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Audio fallback
    }
  }

  public playTick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio fallback
    }
  }

  public playCountdown(final: boolean = false) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(final ? 880 : 440, now);
      if (final) {
        osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.25);
      }

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (final ? 0.35 : 0.15));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + (final ? 0.35 : 0.15));
    } catch {
      // Audio fallback
    }
  }

  public playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // Audio fallback
    }
  }

  public playStreakSound(streak: number = 1) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      const pitch = Math.min(440 + (streak * 40), 1200);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, now + 0.1);
      
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Audio fallback
    }
  }

  public playFanfare() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const start = (this.ctx?.currentTime || 0) + (index * 0.08);
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(start);
        osc.stop(start + 0.3);
      });
    } catch {
      // Audio fallback
    }
  }

  public triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'error' | 'success' = 'light') {
    // Try Native Android Capacitor Haptics first
    try {
      import('./nativeMobileService').then(({ NativeMobileService }) => {
        if (NativeMobileService.isNativePlatform()) {
          NativeMobileService.triggerHaptic(type);
        }
      });
    } catch {}

    // Web Navigator Vibrate fallback
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        switch (type) {
          case 'light':
            navigator.vibrate(10);
            break;
          case 'medium':
            navigator.vibrate(25);
            break;
          case 'heavy':
            navigator.vibrate(50);
            break;
          case 'error':
            navigator.vibrate([30, 40, 30]);
            break;
          case 'success':
            navigator.vibrate([15, 30, 40]);
            break;
        }
      } catch {
        // Haptic not allowed in iframe
      }
    }
  }

  // ==========================================
  // Synthetic Voice Feedback (SpeechSynthesis)
  // ==========================================

  public setAudioFeedbackEnabled(enabled: boolean) {
    this.audioFeedbackEnabled = enabled;
    if (!enabled) {
      this.stopSpeaking();
    }
  }

  public getAudioFeedbackEnabled(): boolean {
    return this.audioFeedbackEnabled;
  }

  public isVoiceSpeaking(): boolean {
    return this.isSpeaking;
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        this.isSpeaking = false;
      } catch {
        // Speech API fallback
      }
    }
  }

  /**
   * Universal announcer speaker with high-energy, athletic cadence
   */
  public speak(
    text: string, 
    options?: { 
      rate?: number; 
      pitch?: number; 
      volume?: number; 
      priority?: boolean;
      onEnd?: () => void;
    }
  ) {
    if (!this.audioFeedbackEnabled || this.isMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      if (options?.priority) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options?.rate ?? 1.15; // Energetic, snappy pace
      utterance.pitch = options?.pitch ?? 1.05; // Friendly, upbeat
      utterance.volume = options?.volume ?? 0.95;

      // Select natural English voice if available in browser
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const preferredVoice = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Samantha') ||
              v.name.includes('Karen') ||
              v.name.includes('David') ||
              v.name.includes('Daniel') ||
              v.name.includes('Victoria'))
        ) || voices.find((v) => v.lang.startsWith('en'));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        options?.onEnd?.();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.isSpeaking = false;
    }
  }

  /**
   * Announces score milestones during gameplay (e.g. 500, 1000, 1500, 2000, 2500, 3000+)
   */
  public speakScoreMilestone(milestoneScore: number) {
    let message = `Score milestone! ${milestoneScore} points!`;
    if (milestoneScore >= 3000) {
      message = `Incredible! ${milestoneScore.toLocaleString()} points reached! You are on fire!`;
    } else if (milestoneScore >= 2000) {
      message = `Grandmaster milestone! ${milestoneScore.toLocaleString()} points!`;
    } else if (milestoneScore >= 1500) {
      message = `Amazing! ${milestoneScore.toLocaleString()} points reached!`;
    } else if (milestoneScore >= 1000) {
      message = `Score milestone! 1,000 points reached! Keep it up!`;
    } else if (milestoneScore >= 500) {
      message = `Milestone unlocked! 500 points!`;
    }
    this.speak(message, { priority: true, rate: 1.18 });
  }

  /**
   * Announces combo streak milestones during gameplay (e.g. 5, 10, 15, 20 combo)
   */
  public speakComboMilestone(combo: number) {
    let message = `${combo} combo streak!`;
    if (combo >= 25) {
      message = `Godlike calculation! ${combo} combo streak!`;
    } else if (combo >= 20) {
      message = `Unstoppable! ${combo} streak!`;
    } else if (combo >= 15) {
      message = `Super combo! ${combo} in a row!`;
    } else if (combo >= 10) {
      message = `10 combo streak! Flawless rhythm!`;
    } else if (combo >= 5) {
      message = `5 streak! On fire!`;
    }
    this.speak(message, { priority: true, rate: 1.2 });
  }

  /**
   * Announces daily streak achievements during gameplay / login / sprint completion
   */
  public speakDailyStreakAchievement(streakDays: number, isNewStreak: boolean = true) {
    let message = `Daily streak achievement! ${streakDays} days in a row!`;
    if (streakDays >= 30) {
      message = `Legendary streak! ${streakDays} days of daily math discipline! Outstanding!`;
    } else if (streakDays >= 14) {
      message = `Epic achievement! Two week streak of ${streakDays} days!`;
    } else if (streakDays >= 7) {
      message = `Daily streak unlocked! 1 full week streak of ${streakDays} days! Keep up the fire!`;
    } else if (streakDays >= 3) {
      message = `Daily streak milestone! ${streakDays} days in a row! Momentum is building!`;
    } else if (streakDays === 1 && isNewStreak) {
      message = `Daily streak started! Day 1 complete! Come back tomorrow!`;
    }
    this.speak(message, { priority: true, rate: 1.12 });
  }

  /**
   * Demo test voice announcement to preview voice in profile settings
   */
  public testVoiceAnnouncement(onDone?: () => void) {
    this.speak(
      "Audio feedback enabled! Daily streak achievement: 5 days strong! Score milestone: 1000 points reached!",
      {
        priority: true,
        rate: 1.15,
        onEnd: onDone,
      }
    );
  }
}

export const soundService = new SoundService();
