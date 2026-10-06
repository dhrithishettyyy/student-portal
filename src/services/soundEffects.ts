// Web Audio API Sound Generator for Study Timers & Alerts
// Pure synthesizer - No external audio assets or network requests needed

export const playBellChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Dual harmonic sine bell chime (fundamental 880Hz [A5] + crystal overtone 1760Hz [A6])
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1760, now);

    // Soft attack, smooth exponential decay for an ambient temple / zen bell chime
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.4);
    osc2.stop(now + 1.4);
  } catch (err) {
    console.warn('Audio chime playback not allowed or muted:', err);
  }
};
