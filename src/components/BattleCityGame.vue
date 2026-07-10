<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { CANVAS_W, CANVAS_H } from '../game/constants.js'
import { createGame } from '../game/engine.js'
import { render } from '../game/renderer.js'

const emit = defineEmits(['exit'])
const canvasRef = ref(null)
let game = null
let animId = null

function handleWin(state) {
  state.gameOver = true
  state.win = true
}

function handleLose(state) {
  state.gameOver = true
  state.win = false
}

function gameLoop() {
  if (!game) return
  game.update()
  const ctx = canvasRef.value?.getContext('2d')
  if (ctx) render(ctx, game.state)
  animId = requestAnimationFrame(gameLoop)
}

function onKeyDown(e) {
  if (!game) return
  game.state.keys[e.key] = true
  if (e.key === 'Enter' && game.state.gameOver) {
    if (game.state.win) game.nextWave()
    else game.reset()
  }
  if (e.key === 'Escape') emit('exit')
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
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  if (animId) cancelAnimationFrame(animId)
  game = null
})
</script>

<template>
  <div class="game-wrapper">
    <div class="game-header">
      <span class="game-title">Battle City</span>
      <button class="exit-btn" @click="$emit('exit')">退出游戏</button>
    </div>
    <div class="canvas-wrap">
      <canvas ref="canvasRef" :width="CANVAS_W" :height="CANVAS_H" class="game-canvas" />
    </div>
    <div class="controls">
      <span>方向键移动 | 空格射击 | Enter 重新开始 / 下一关 | ESC 退出</span>
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
.exit-btn {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 6px 16px;
  font-size: 13px;
  color: var(--text);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.exit-btn:hover {
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
</style>
