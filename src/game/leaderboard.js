const STORAGE_KEY = 'tank_leaderboard'
const MAX_ENTRIES = 50

function getDeviceId() {
  let id = localStorage.getItem('tank_device_id')
  if (!id) {
    id = 'DEV-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6)
    localStorage.setItem('tank_device_id', id)
  }
  return id
}

export const leaderboard = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  },
  save(scores) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores.slice(0, MAX_ENTRIES)))
    } catch {}
  },
  addScore(name, wave, kills, survivalFrames) {
    const scores = this.load()
    const survivalTime = Math.round(survivalFrames / 60)
    scores.push({
      name: name || '玩家',
      wave,
      kills,
      survivalTime,
      deviceId: getDeviceId(),
      timestamp: Date.now()
    })
    scores.sort((a, b) => {
      if (b.wave !== a.wave) return b.wave - a.wave
      if (b.kills !== a.kills) return b.kills - a.kills
      return a.survivalTime - b.survivalTime
    })
    this.save(scores)
    return scores
  },
  getRankings() {
    return this.load()
  },
  getDeviceId
}
