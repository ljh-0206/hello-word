<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { CANVAS_W, CANVAS_H } from '../game/constants.js'
import { createGame } from '../game/engine.js'
import { render } from '../game/renderer.js'
import { audio } from '../game/audio.js'
import { leaderboard } from '../game/leaderboard.js'

const emit = defineEmits(['exit'])
const canvasRef = ref(null)
let game = null
let animId = null
let bgmStarted = false

const isTouchDevice = ref(false)
const modalState = ref('start')
const subView = ref(null)
const leaderboardData = ref([])
const playerName = ref(localStorage.getItem('tank_player_name') || '')

function handleWin(state) {
  state.gameOver = true
  state.win = true
  audio.stopBgm()
  audio.stageClear()
  modalState.value = 'gameover'
}

function handleLose(state) {
  state.gameOver = true
  state.win = false
  audio.stopBgm()
  audio.gameOver()
  modalState.value = 'gameover'
}

function openLeaderboard() {
  leaderboardData.value = leaderboard.getRankings()
  subView.value = 'leaderboard'
}

function closeSubView() {
  subView.value = null
}

function startGame() {
  if (!game) return
  game.start()
  modalState.value = null
  bgmStarted = true
  audio.startBgm()
}

function pauseGame() {
  if (!game || game.state.gameOver || game.state.paused) return
  game.state.paused = true
  audio.stopBgm()
  bgmStarted = false
  modalState.value = 'pause'
}

function resumeGame() {
  if (!game) return
  game.state.paused = false
  modalState.value = null
  bgmStarted = true
  audio.startBgm()
}

function nextWave() {
  if (!game) return
  bgmStarted = false
  game.nextWave()
  modalState.value = null
  audio.startBgm()
}

function restartGame() {
  if (!game) return
  bgmStarted = false
  game.reset()
  modalState.value = null
  audio.startBgm()
}

function exitGame() {
  audio.stopBgm()
  emit('exit')
}

function gameLoop() {
  if (!game) return
  game.update()
  const ctx = canvasRef.value?.getContext('2d')
  if (ctx) render(ctx, game.state)
  if (!bgmStarted && !game.state.gameOver && !game.state.paused && modalState.value === null) {
    bgmStarted = true
    audio.startBgm()
  }
  if (game.state.gameOver && bgmStarted) {
    bgmStarted = false
  }
  animId = requestAnimationFrame(gameLoop)
}

function onKeyDown(e) {
  if (!game) return
  if (subView.value) {
    if (e.key === 'Escape') { closeSubView(); e.preventDefault() }
    return
  }
  if (modalState.value === 'start') {
    if (e.key === 'Enter') { startGame(); e.preventDefault() }
    if (e.key === 'Escape') { exitGame(); e.preventDefault() }
    return
  }
  if (modalState.value === 'pause') {
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
      resumeGame(); e.preventDefault()
    }
    if (e.key === 'Enter') { resumeGame(); e.preventDefault() }
    return
  }
  if (modalState.value === 'gameover') {
    if (e.key === 'Enter') {
      if (game.state.win) nextWave()
      else restartGame()
      e.preventDefault()
    }
    if (e.key === 'Escape') { exitGame(); e.preventDefault() }
    return
  }
  if (e.key === 'p' || e.key === 'P') {
    pauseGame(); e.preventDefault(); return
  }
  if (e.key === 'Escape') {
    pauseGame(); e.preventDefault(); return
  }
  game.state.keys[e.key] = true
  e.preventDefault()
}

function onKeyUp(e) {
  if (!game) return
  game.state.keys[e.key] = false
  e.preventDefault()
}

const TOUCH_MAP = {
  'dpad-up': 'ArrowUp',
  'dpad-down': 'ArrowDown',
  'dpad-left': 'ArrowLeft',
  'dpad-right': 'ArrowRight',
  'fire-btn': ' '
}

function touchStart(e) {
  if (!game || modalState.value) return
  audio.resume()
  for (const t of e.changedTouches) {
    const el = document.elementFromPoint(t.clientX, t.clientY)
    if (!el) continue
    const action = el.getAttribute('data-action')
    if (action && TOUCH_MAP[action]) {
      game.state.keys[TOUCH_MAP[action]] = true
      e.preventDefault()
    }
  }
}

function touchEnd(e) {
  if (!game || modalState.value) return
  for (const t of e.changedTouches) {
    const el = document.elementFromPoint(t.clientX, t.clientY)
    if (!el) continue
    const action = el.getAttribute('data-action')
    if (action && TOUCH_MAP[action]) {
      game.state.keys[TOUCH_MAP[action]] = false
      e.preventDefault()
    }
  }
}

onMounted(() => {
  isTouchDevice.value = 'ontouchstart' in window
  game = createGame(handleWin, handleLose)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  if (isTouchDevice.value) {
    window.addEventListener('touchstart', touchStart, { passive: false })
    window.addEventListener('touchend', touchEnd, { passive: false })
    window.addEventListener('touchcancel', touchEnd, { passive: false })
  }
  gameLoop()
})

onUnmounted(() => {
  audio.stopBgm()
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  if (isTouchDevice.value) {
    window.removeEventListener('touchstart', touchStart)
    window.removeEventListener('touchend', touchEnd)
    window.removeEventListener('touchcancel', touchEnd)
  }
  if (animId) cancelAnimationFrame(animId)
  game = null
})
</script>

<template>
  <div class="game-screen">
    <div class="canvas-wrap">
      <canvas
        ref="canvasRef"
        :width="CANVAS_W"
        :height="CANVAS_H"
        class="game-canvas"
      />
    </div>

    <button v-if="modalState === null" class="pause-btn" @click="pauseGame">⏸</button>

    <div v-if="isTouchDevice && modalState === null" class="touch-controls">
      <div class="dpad">
        <button class="dpad-btn dpad-up" data-action="dpad-up">▲</button>
        <button class="dpad-btn dpad-left" data-action="dpad-left">◀</button>
        <button class="dpad-btn dpad-right" data-action="dpad-right">▶</button>
        <button class="dpad-btn dpad-down" data-action="dpad-down">▼</button>
      </div>
      <div class="touch-actions">
        <button class="touch-btn fire-btn" data-action="fire-btn">⚡</button>
      </div>
    </div>

    <div v-if="modalState" class="modal-overlay" @click.self="subView ? closeSubView() : null">
      <div class="modal">
        <template v-if="subView === 'leaderboard'">
          <h3 class="modal-title">排行榜</h3>
          <div class="lb-table-wrap">
            <table class="lb-table" v-if="leaderboardData.length">
              <thead>
                <tr>
                  <th>#</th>
                  <th>玩家</th>
                  <th>最高关卡</th>
                  <th>杀敌数</th>
                  <th class="col-survival">最短生存</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(s, i) in leaderboardData.slice(0, 20)" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>{{ s.name }}</td>
                  <td>{{ s.wave }}</td>
                  <td>{{ s.kills }}</td>
                  <td class="col-survival">{{ s.survivalTime }}s</td>
                </tr>
              </tbody>
            </table>
            <p v-else class="lb-empty">暂无记录</p>
          </div>
          <div class="modal-actions">
            <button class="btn-primary" @click="closeSubView">返回</button>
          </div>
        </template>

        <template v-else-if="modalState === 'start'">
          <div class="section">
            <h3 class="section-title">操作方式</h3>
            <div class="controls-grid">
              <template v-if="!isTouchDevice">
                <div class="ctrl-item"><span class="key">↑ ↓ ← →</span><span class="val">移动</span></div>
                <div class="ctrl-item"><span class="key">空格</span><span class="val">射击</span></div>
                <div class="ctrl-item"><span class="key">P / ESC</span><span class="val">暂停</span></div>
                <div class="ctrl-item"><span class="key">Enter</span><span class="val">确认</span></div>
              </template>
              <template v-else>
                <div class="ctrl-item"><span class="key">左侧摇杆</span><span class="val">移动</span></div>
                <div class="ctrl-item"><span class="key">右侧⚡</span><span class="val">射击</span></div>
                <div class="ctrl-item"><span class="key">⏸ 按钮</span><span class="val">暂停</span></div>
                <div class="ctrl-item"><span class="key">Enter</span><span class="val">确认</span></div>
              </template>
            </div>
          </div>

          <div class="modal-actions col">
            <button class="btn-primary btn-lg" @click="startGame">开始游戏</button>
            <button class="btn-outline" @click="openLeaderboard">排行榜</button>
            <button class="btn-outline" @click="exitGame">退出游戏</button>
          </div>
        </template>

        <template v-else-if="modalState === 'pause'">
          <h2 class="modal-title">暂停</h2>

          <div class="stats-line">
            <span>得分 <em>{{ game?.state.player.score || 0 }}</em></span>
            <span>关卡 <em>{{ game?.state.wave || 1 }}</em></span>
            <span>击杀 <em>{{ game?.state.killCount || 0 }}</em></span>
            <span>命数 <em>{{ game?.state.player.lives || 0 }}</em></span>
          </div>

          <div class="modal-actions col">
            <button class="btn-primary btn-lg" @click="resumeGame">继续游戏</button>
            <button class="btn-outline" @click="openLeaderboard">排行榜</button>
            <button class="btn-outline" @click="exitGame">退出游戏</button>
          </div>
        </template>

        <template v-else-if="modalState === 'gameover'">
          <h2 class="modal-title">{{ game?.state.win ? '过关！' : '游戏结束' }}</h2>

          <div class="stats-line">
            <span>得分 <em>{{ game?.state.player.score || 0 }}</em></span>
            <span>关卡 <em>{{ game?.state.wave || 1 }}</em></span>
            <span>击杀 <em>{{ game?.state.killCount || 0 }}</em></span>
            <span>命数 <em>{{ game?.state.player.lives || 0 }}</em></span>
          </div>

          <div class="modal-actions col">
            <button v-if="game?.state.win" class="btn-primary btn-lg" @click="nextWave">下一关</button>
            <button v-else class="btn-primary btn-lg" @click="restartGame">重新开始</button>
            <button class="btn-outline" @click="openLeaderboard">排行榜</button>
            <button class="btn-outline" @click="exitGame">退出游戏</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-screen {
  position: fixed;
  inset: 0;
  background: #000;
  overflow: hidden;
}
.canvas-wrap {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}
.game-canvas {
  display: block;
  max-width: 100vw;
  max-height: 100vh;
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
}

.pause-btn {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 50;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
  transition: background 0.15s;
}
.pause-btn:hover, .pause-btn:active {
  background: rgba(255,255,255,0.25);
}

.touch-controls {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 20;
  touch-action: none;
}
.touch-controls button {
  pointer-events: auto;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}
.dpad {
  position: fixed;
  bottom: 24px;
  left: 16px;
  width: 120px;
  height: 120px;
}
.dpad-btn {
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255,255,255,0.13);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}
.dpad-btn:active {
  background: rgba(255,255,255,0.3);
}
.dpad-up { top: 0; left: 50%; transform: translateX(-50%) }
.dpad-down { bottom: 0; left: 50%; transform: translateX(-50%) }
.dpad-left { left: 0; top: 50%; transform: translateY(-50%) }
.dpad-right { right: 0; top: 50%; transform: translateY(-50%) }

.touch-actions {
  position: fixed;
  bottom: 32px;
  right: 20px;
}
.fire-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 60, 60, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.45);
  color: #fff;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}
.fire-btn:active {
  background: rgba(255, 60, 60, 0.55);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal {
  background: #1a1a2e;
  border: 1px solid #333;
  border-radius: 14px;
  padding: 28px 32px;
  width: 90vw;
  max-width: 420px;
  max-height: 85vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.modal-header {
  text-align: center;
  margin-bottom: 8px;
}
.modal-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 4px;
}
.modal-sub {
  font-size: 13px;
  color: #888;
  margin: 0;
}
.section {
  width: 100%;
  margin: 12px 0;
}
.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #ccc;
  margin: 0 0 8px;
}
.controls-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.ctrl-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 6px;
  background: rgba(255,255,255,0.04);
  border-radius: 4px;
}
.key {
  font-size: 10px;
  font-weight: 600;
  color: #66ccff;
  background: #0d0d1a;
  padding: 1px 5px;
  border-radius: 3px;
  border: 1px solid #444;
  white-space: nowrap;
}
.val {
  font-size: 12px;
  color: #aaa;
}
.stats-line {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px 10px;
  margin: 6px 0;
  font-size: 12px;
  color: #999;
}
.stats-line em {
  font-style: normal;
  font-weight: 600;
  color: #fff;
  margin-left: 2px;
}
.modal-actions {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  width: 100%;
}
.modal-actions.col {
  flex-direction: column;
  align-items: stretch;
}
.modal-actions.col button {
  width: 100%;
}
.btn-primary {
  padding: 8px 20px;
  border-radius: 6px;
  border: none;
  background: #5686fe;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-primary:hover {
  background: #679efe;
}
.btn-lg {
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 600;
}
.btn-outline {
  background: transparent;
  border: 1px solid #444;
  border-radius: 6px;
  padding: 8px 20px;
  color: #bbb;
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.btn-outline:hover {
  border-color: #666;
  color: #fff;
}

.lb-table-wrap {
  max-height: 40vh;
  overflow-y: auto;
  width: 100%;
  margin: 8px 0;
}
.lb-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  color: #ccc;
}
.lb-table th {
  text-align: center;
  padding: 5px 6px;
  border-bottom: 1px solid #333;
  color: #fff;
  font-weight: 600;
}
.lb-table td {
  text-align: center;
  padding: 4px 6px;
  border-bottom: 1px solid #222;
}
.lb-empty {
  color: #666;
  text-align: center;
  font-size: 13px;
  padding: 20px 0;
}

@media (max-width: 480px) {
  .modal { padding: 10px 10px; max-height: 75vh }
  .modal-title { font-size: 15px; margin-bottom: 0 }
  .modal-header { margin-bottom: 2px }
  .section { margin: 4px 0 }
  .section-title { font-size: 10px; margin-bottom: 2px; font-weight: 500 }
  .controls-grid { gap: 3px }
  .ctrl-item { padding: 2px 4px; gap: 3px }
  .key { font-size: 8px; padding: 0 4px }
  .val { font-size: 10px }
  .stats-line { font-size: 11px; gap: 3px 8px; margin: 4px 0 }
  .stats-line em { font-size: 11px }
  .modal-actions { margin-top: 6px; gap: 4px }
  .modal-actions.col button { padding: 6px 12px; font-size: 13px }
  .btn-lg { padding: 6px 12px; font-size: 13px }
  .btn-outline { padding: 4px 10px; font-size: 11px }
  .lb-table { font-size: 10px }
  .lb-table th, .lb-table td { padding: 3px 4px }
  .lb-empty { padding: 8px 0; font-size: 11px }
  .dpad { width: 90px; height: 90px; bottom: 12px; left: 10px }
  .dpad-btn { width: 28px; height: 28px; font-size: 10px }
  .fire-btn { width: 44px; height: 44px; font-size: 16px }
  .touch-actions { bottom: 24px; right: 14px }
  .col-survival { display: none }
}
</style>
