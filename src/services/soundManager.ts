import type { SoundId } from '../engine/types';

/**
 * 全部音效由 Web Audio API 现场合成，不依赖外部音频文件。
 * 默认静音，用户第一次点击后才创建 AudioContext（遵守自动播放限制）。
 */
class SoundManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambienceGain: GainNode | null = null;
  private ambienceSource: AudioBufferSourceNode | null = null;
  private muted = true;

  init(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    try {
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.5;
      this.master.connect(this.ctx.destination);
    } catch {
      this.ctx = null;
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.5, this.ctx.currentTime, 0.05);
    }
    if (muted) this.stopAmbience();
  }

  private noiseBuffer(seconds = 1): AudioBuffer | null {
    if (!this.ctx) return null;
    const length = Math.max(1, Math.floor(this.ctx.sampleRate * seconds));
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    return buffer;
  }

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType,
    gainValue: number,
    slideTo?: number,
    delay = 0,
  ): void {
    if (!this.ctx || !this.master) return;
    const start = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(this.master);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  private noise(
    duration: number,
    gainValue: number,
    filterFrom: number,
    filterTo: number,
    delay = 0,
  ): void {
    if (!this.ctx || !this.master) return;
    const buffer = this.noiseBuffer(duration + 0.1);
    if (!buffer) return;
    const start = this.ctx.currentTime + delay;
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFrom, start);
    filter.frequency.exponentialRampToValueAtTime(Math.max(60, filterTo), start + duration);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter).connect(gain).connect(this.master);
    source.start(start);
    source.stop(start + duration + 0.05);
  }

  play(id: SoundId): void {
    if (this.muted) return;
    this.init();
    if (!this.ctx || !this.master) return;
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    switch (id) {
      case 'tvOn':
        this.noise(0.5, 0.32, 5200, 400);
        this.tone(58, 0.35, 'sine', 0.28, 40);
        this.tone(1200, 0.12, 'square', 0.04, 320, 0.05);
        break;
      case 'chapter':
        this.tone(392, 0.16, 'triangle', 0.16);
        this.tone(523, 0.22, 'triangle', 0.14, undefined, 0.14);
        break;
      case 'batteryDown':
        this.tone(520, 0.36, 'sawtooth', 0.1, 150);
        this.tone(120, 0.3, 'sine', 0.12, 70, 0.04);
        break;
      case 'batteryUp':
        this.tone(330, 0.12, 'triangle', 0.13);
        this.tone(494, 0.12, 'triangle', 0.13, undefined, 0.1);
        this.tone(659, 0.2, 'triangle', 0.12, undefined, 0.2);
        break;
      case 'click':
        this.tone(760, 0.05, 'square', 0.06, 520);
        break;
      case 'reveal':
        this.tone(262, 0.5, 'sine', 0.14);
        this.tone(330, 0.5, 'sine', 0.12, undefined, 0.06);
        this.tone(392, 0.7, 'sine', 0.12, undefined, 0.12);
        this.tone(523, 0.9, 'triangle', 0.08, undefined, 0.2);
        break;
      case 'glitch':
        this.noise(0.18, 0.18, 4200, 800);
        this.tone(90, 0.16, 'square', 0.08, 60);
        break;
      case 'crowd':
        this.noise(1.1, 0.1, 900, 2200);
        break;
      default:
        break;
    }
  }

  startAmbience(): void {
    if (this.muted) return;
    this.init();
    if (!this.ctx || !this.master || this.ambienceSource) return;
    const buffer = this.noiseBuffer(4);
    if (!buffer) return;
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 480;
    const gain = this.ctx.createGain();
    gain.gain.value = 0.035;
    source.connect(filter).connect(gain).connect(this.master);
    source.start();
    this.ambienceSource = source;
    this.ambienceGain = gain;
  }

  stopAmbience(): void {
    if (this.ambienceSource) {
      try {
        this.ambienceSource.stop();
      } catch {
        /* 已停止 */
      }
      this.ambienceSource.disconnect();
      this.ambienceSource = null;
    }
    if (this.ambienceGain) {
      this.ambienceGain.disconnect();
      this.ambienceGain = null;
    }
  }
}

export const sound = new SoundManager();
