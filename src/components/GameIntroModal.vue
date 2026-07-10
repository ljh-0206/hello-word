<script setup>
import { ref, onMounted } from 'vue'

defineEmits(['start', 'close'])
const isMobile = ref(false)

onMounted(() => {
  isMobile.value = matchMedia('(hover: none) and (pointer: coarse)').matches
})
</script>

<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <button class="close-btn" @click="$emit('close')">✕</button>

      <div class="preview">
        <div class="preview-grid">
          <div class="preview-tank preview-tank-player"></div>
          <div class="preview-bullet"></div>
          <div class="preview-tank preview-tank-enemy"></div>
        </div>
        <div class="preview-label">坦克大战 · 游戏预览</div>
      </div>

      <h2 class="modal-title">坦克大战</h2>
      <p class="modal-desc">
        基于 DeepSeek 能力辅助开发的经典红白机游戏复刻版本。
        玩家操控坦克保卫基地，面对多种敌人与复杂地形，
        体验原汁原味的 Battle City 玩法。
      </p>

      <div class="section">
        <h3 class="section-title">🎮 操作方式</h3>
        <div class="info-grid">
          <template v-if="!isMobile">
            <div class="info-item">
              <span class="key">↑ ↓ ← →</span>
              <span class="val">移动</span>
            </div>
            <div class="info-item">
              <span class="key">空格 / J</span>
              <span class="val">射击</span>
            </div>
            <div class="info-item">
              <span class="key">P / ESC</span>
              <span class="val">暂停</span>
            </div>
            <div class="info-item">
              <span class="key">Enter</span>
              <span class="val">重新开始 / 下一关</span>
            </div>
          </template>
          <template v-else>
            <div class="info-item">
              <span class="key">左侧摇杆</span>
              <span class="val">移动</span>
            </div>
            <div class="info-item">
              <span class="key">右侧⚡按钮</span>
              <span class="val">射击</span>
            </div>
            <div class="info-item">
              <span class="key">⏸ 按钮</span>
              <span class="val">暂停</span>
            </div>
            <div class="info-item">
              <span class="key">Enter</span>
              <span class="val">重新开始 / 下一关</span>
            </div>
          </template>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">✨ 游戏特色</h3>
        <ul class="feature-list">
          <li v-for="feat in [
            '多关卡地图，难度逐步递增',
            '4 种敌人类型（普通 / 快速 / 重型 / 装甲）',
            '多种道具（星 / 护盾 / 炸弹等）',
            '4 种地形（砖墙 / 钢墙 / 水域 / 森林）',
            '排行榜系统 · 记录你的最佳战绩',
            isMobile ? '支持触屏操作' : '键盘操作 + 触屏适配'
          ]" :key="feat">{{ feat }}</li>
        </ul>
      </div>

      <div class="actions">
        <button class="btn btn-primary" @click="$emit('start')">开始游戏</button>
        <button class="btn btn-outline" @click="$emit('close')">返回</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 24px;
}
.modal {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px;
  max-width: 520px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--label-dim);
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.close-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.preview {
  background: #1a1a2e;
  border-radius: 10px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  gap: 12px;
  position: relative;
  overflow: hidden;
}
.preview-grid {
  display: flex;
  align-items: center;
  gap: 8px;
}
.preview-tank {
  width: 32px;
  height: 32px;
  border-radius: 4px;
}
.preview-tank-player {
  background: #ffcc00;
  clip-path: polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%);
}
.preview-tank-enemy {
  background: #e74c3c;
  clip-path: polygon(0% 0%, 100% 0%, 75% 100%, 25% 100%);
}
.preview-bullet {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
  animation: pulse 0.6s infinite alternate;
}
@keyframes pulse {
  from { opacity: 0.4; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1.2); }
}
.preview-label {
  font-size: 12px;
  color: #888;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-h);
  margin: 0 0 8px;
}
.modal-desc {
  font-size: 14px;
  color: var(--text);
  line-height: 1.7;
  margin: 0 0 24px;
}

.section {
  margin-bottom: 20px;
}
.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-h);
  margin: 0 0 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: var(--section-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
}
.key {
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  background: var(--bg);
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid var(--border);
  white-space: nowrap;
}
.val {
  font-size: 13px;
  color: var(--text);
}

.feature-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.feature-list li {
  font-size: 13px;
  color: var(--text);
  padding: 6px 10px;
  background: var(--section-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
}
.feature-list li::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  margin-right: 8px;
  vertical-align: middle;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}
.btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.btn-primary {
  background: var(--accent);
  color: #fff;
}
.btn-primary:hover {
  background: var(--accent-hover);
}
.btn-outline {
  background: transparent;
  color: var(--text-h);
  border: 1px solid var(--border);
}
.btn-outline:hover {
  border-color: var(--accent);
  color: var(--accent);
}

@media (max-width: 480px) {
  .modal { padding: 20px 16px }
  .info-grid { grid-template-columns: 1fr 1fr; gap: 6px }
  .feature-list { grid-template-columns: 1fr; gap: 5px }
  .modal-title { font-size: 20px }
}
</style>
