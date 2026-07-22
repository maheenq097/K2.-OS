// Web Audio API Ambient Alpine Sound Synthesizer
let audioCtx = null;
let noiseNode = null;
let filterNode = null;
let gainNode = null;
let isPlaying = false;

export function toggleAmbientAudio(onStateChange) {
  if (isPlaying) {
    stopAmbientAudio();
    if (onStateChange) onStateChange(false);
    return false;
  } else {
    startAmbientAudio();
    if (onStateChange) onStateChange(true);
    return true;
  }
}

export function startAmbientAudio() {
  if (isPlaying) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // Create pink/brown noise for soft mountain wind / focus sound
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain boost
    }

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    // Lowpass filter for deep wind sound
    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(280, audioCtx.currentTime);

    // LFO to slowly modulate wind frequency
    const lfo = audioCtx.createOscillator();
    lfo.frequency.value = 0.15; // slow breath
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 120;
    lfo.connect(filterNode.frequency);
    lfo.start();

    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 2); // Soft fade in

    noiseNode.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    noiseNode.start();
    isPlaying = true;
  } catch (err) {
    console.warn("Audio Context error or user interaction needed:", err);
  }
}

export function stopAmbientAudio() {
  if (!isPlaying || !audioCtx) return;
  try {
    if (gainNode) {
      gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
      setTimeout(() => {
        if (noiseNode) noiseNode.stop();
        if (audioCtx) audioCtx.close();
        isPlaying = false;
      }, 1000);
    }
  } catch (err) {
    isPlaying = false;
  }
}

export function playSuccessChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.2); // G5

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {}
}
