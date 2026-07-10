let ctx = null
let bgmInterval = null
let bgmNoteIndex = 0
const BGM_NOTES = [262, 294, 330, 349, 392, 349, 330, 294]

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function playTone(freq, duration, type, volume) {
  const ac = getCtx()
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type || 'square'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(volume || 0.12, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration)
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.start(ac.currentTime)
  osc.stop(ac.currentTime + duration)
}

function playNoise(duration, volume) {
  const ac = getCtx()
  const bufferSize = ac.sampleRate * duration
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
  const source = ac.createBufferSource()
  source.buffer = buffer
  const gain = ac.createGain()
  gain.gain.setValueAtTime(volume || 0.1, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration)
  const filter = ac.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 1000
  source.connect(filter)
  filter.connect(gain)
  gain.connect(ac.destination)
  source.start(ac.currentTime)
}

export const audio = {
  shoot() {
    playTone(880, 0.08, 'square', 0.08)
    playNoise(0.05, 0.04)
  },
  hit() {
    playNoise(0.15, 0.12)
    playTone(120, 0.12, 'sawtooth', 0.1)
  },
  explosion() {
    playNoise(0.3, 0.15)
    playTone(60, 0.25, 'sawtooth', 0.12)
  },
  powerUp() {
    const ac = getCtx()
    const t = ac.currentTime
    ;[523, 659, 784].forEach((f, i) => {
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.type = 'square'
      osc.frequency.value = f
      gain.gain.setValueAtTime(0.1, t + i * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.15)
      osc.connect(gain)
      gain.connect(ac.destination)
      osc.start(t + i * 0.08)
      osc.stop(t + i * 0.08 + 0.15)
    })
  },
  gameOver() {
    const ac = getCtx()
    const t = ac.currentTime
    ;[440, 370, 330, 262].forEach((f, i) => {
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.type = 'square'
      osc.frequency.value = f
      gain.gain.setValueAtTime(0.1, t + i * 0.2)
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.2 + 0.3)
      osc.connect(gain)
      gain.connect(ac.destination)
      osc.start(t + i * 0.2)
      osc.stop(t + i * 0.2 + 0.3)
    })
  },
  stageClear() {
    const ac = getCtx()
    const t = ac.currentTime
    ;[523, 659, 784, 1047].forEach((f, i) => {
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.type = 'square'
      osc.frequency.value = f
      gain.gain.setValueAtTime(0.1, t + i * 0.15)
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.15 + 0.25)
      osc.connect(gain)
      gain.connect(ac.destination)
      osc.start(t + i * 0.15)
      osc.stop(t + i * 0.15 + 0.25)
    })
  },
  startBgm() {
    this.stopBgm()
    const ac = getCtx()
    bgmNoteIndex = 0
    bgmInterval = setInterval(() => {
      playTone(BGM_NOTES[bgmNoteIndex % BGM_NOTES.length], 0.18, 'square', 0.04)
      bgmNoteIndex++
    }, 200)
  },
  stopBgm() {
    if (bgmInterval) {
      clearInterval(bgmInterval)
      bgmInterval = null
    }
  },
  resume() {
    const ac = getCtx()
    if (ac.state === 'suspended') ac.resume()
  }
}
