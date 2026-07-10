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

const showLeaderboard = ref(false)
const leaderboardData = ref([])
const playerName = ref(localStorage.getItem('tank_player_name') || '')
const showNameInput = ref(false)
const pendingScore = ref(null)

function handleWin(state) {
  state.gameOver = true
  state.win = true
  audio.stopBgm()
  audio.stageClear()
  trySaveScore(state)
}

function handleLose(state) {
  state.gameOver = true
  state.win = false
  audio.stopBgm()
  audio.gameOver()
  trySaveScore(state)
}

function trySaveScore(state) {
  const name = localStorage.getItem('tank_player_name')
  if (name) {
    leaderboard.addScore(name, state.wave, state.killCount, state.frameCount)
  } else {
    pendingScore.value = { wave: state.wave, kills: state.killCount, frames: state.frameCount }
    showNameInput.value = true
  }
}

function confirmName() {
  const name = (playerName.value || '').trim() || '玩家'
  localStorage.setItem('tank_player_name', name)
  if (pendingScore.value) {
    leaderboard.addScore(name, pendingScore.value.wave, pendingScore.value.kills, pendingScore.value.frames)
    pendingScore.value = null
  }
  showNameInput.value = false
}

function openLeaderboard() {
  leaderboardData.value = leaderboard.getRankings()
  showLeaderboard.value = true
}

function closeLeaderboard() {
  showLeaderboard.value = false
}

function gameLoop() {
  if (!game) return
  game.update()
  const ctx = canvasRef.value?.getContext('2d')
  if (ctx) render(ctx, game.state)
  if (!bgmStarted && !game.state.gameOver) {
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
  if (e.key === 'p' || e.key === 'P') {
    if (!game.state.gameOver) {
      game.togglePause()
    }
  }
  game.state.keys[e.key] = true
  if (e.key === 'Enter' && game.state.gameOver) {
    bgmStarted = false
    if (game.state.win) game.nextWave()
    else game.reset()
    audio.startBgm()
  }
  if (e.key === 'Escape') {
    if (showLeaderboard.value) {
      closeLeaderboard()
    } else if (!game.state.gameOver) {
      game.togglePause()
    } else {
      emit('exit')
    }
  }
  if (e.key === 'Enter' && showNameInput.value) {
    confirmName()
  }
  e.preventDefault()
}

function onKeyUp(e) {
  if (!game) return
  game.state.keys[e.key] = false
  e.preventDefault()
}

onMounted(() => {
  game = createGame(handleWin, handleLose)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  gameLoop()
})

onUnmounted(() => {
  audio.stopBgm()
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  if (animId) cancelAnimationFrame(animId)
  game = null
})
</script>

<template>
  <div class="game-wrapper">
    <div class="game-header">
      <span class="game-title">坦克大战</span>
      <div class="header-actions">
        <button class="header-btn" @click="openLeaderboard">排行榜</button>
        <button class="exit-btn" @click="$emit('exit')">退出游戏</button>
      </div>
    </div>
    <div class="canvas-wrap">
      <canvas ref="canvasRef" :width="CANVAS_W" :height="CANVAS_H" class="game-canvas" />
    </div>
    <div class="controls">
      <span>方向键移动 | 空格射击 | P 暂停 | Enter 重新开始/下一关 | ESC 暂停/退出</span>
    </div>

    <!-- name input -->
    <div v-if="showNameInput" class="modal-overlay" @click.self="confirmName">
      <div class="modal">
        <h3 class="modal-title">输入你的名字</h3>
        <input
          v-model="playerName"
          class="name-input"
          placeholder="输入名字..."
          maxlength="12"
          @keyup.enter="confirmName"
        />
        <div class="modal-actions">
          <button class="btn-primary" @click="confirmName">确认</button>
        </div>
      </div>
    </div>

    <!-- leaderboard -->
    <div v-if="showLeaderboard" class="modal-overlay" @click.self="closeLeaderboard">
      <div class="modal modal-wide">
        <h3 class="modal-title">排行榜</h3>
        <div class="lb-table-wrap">
          <table class="lb-table" v-if="leaderboardData.length">
            <thead>
              <tr>
                <th>#</th>
                <th>玩家</th>
                <th>最高关卡</th>
                <th>杀敌数</th>
                <th>最短生存(秒)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(s, i) in leaderboardData.slice(0, 20)" :key="i">
                <td>{{ i + 1 }}</td>
                <td>{{ s.name }}</td>
                <td>{{ s.wave }}</td>
                <td>{{ s.kills }}</td>
                <td>{{ s.survivalTime }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else class="lb-empty">暂无记录</p>
        </div>
        <div class="modal-actions">
          <button class="btn-primary" @click="closeLeaderboard">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-wrapper {
  padding-top: 60px;
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.game-header {
  width: 640px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}
.game-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-h);
}
.header-actions {
  display: flex;
  gap: 8px;
}
.header-btn, .exit-btn {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 6px 16px;
  font-size: 13px;
  color: var(--text);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.header-btn:hover, .exit-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.canvas-wrap {
  border: 2px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
  line-height: 0;
}
.game-canvas {
  display: block;
  image-rendering: pixelated;
}
.controls {
  padding: 12px 0;
  font-size: 12px;
  color: var(--label-dim);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal {
  background: #1a1a2e;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 28px 32px;
  min-width: 320px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.modal-wide {
  min-width: 480px;
}
.modal-title {
  font-size: 18px;
  color: #fff;
  margin: 0 0 16px;
}
.name-input {
  width: 200px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #555;
  background: #0d0d1a;
  color: #fff;
  font-size: 14px;
  text-align: center;
  outline: none;
}
.name-input:focus {
  border-color: var(--accent, #66ccff);
}
.modal-actions {
  margin-top: 16px;
}
.btn-primary {
  padding: 8px 24px;
  border-radius: 6px;
  border: none;
  background: var(--accent, #66ccff);
  color: #000;
  font-size: 13px;
  cursor: pointer;
}
.btn-primary:hover {
  background: var(--accent-hover, #88ddff);
}
.lb-table-wrap {
  max-height: 50vh;
  overflow-y: auto;
  width: 100%;
}
.lb-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  color: #ccc;
}
.lb-table th {
  text-align: center;
  padding: 6px 8px;
  border-bottom: 1px solid #333;
  color: #fff;
  font-weight: 600;
}
.lb-table td {
  text-align: center;
  padding: 5px 8px;
  border-bottom: 1px solid #222;
}
.lb-table tbody tr:hover {
  background: rgba(255,255,255,0.04);
}
.lb-empty {
  color: #666;
  text-align: center;
  font-size: 14px;
}
</style>
