<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import BattleCityGame from '../components/BattleCityGame.vue'

const router = useRouter()
const isPortrait = ref(false)

let mq = null

function checkOrientation(e) {
  isPortrait.value = e.matches
}

onMounted(() => {
  mq = window.matchMedia('(orientation: portrait)')
  isPortrait.value = mq.matches
  mq.addEventListener('change', checkOrientation)
})

onUnmounted(() => {
  if (mq) mq.removeEventListener('change', checkOrientation)
})

function onExit() {
  router.push('/')
}
</script>

<template>
  <BattleCityGame @exit="onExit" />
  <div v-if="isPortrait" class="rotate-hint">
    <div class="rotate-icon">↻</div>
    <p>请横屏游玩</p>
  </div>
</template>

<style scoped>
.rotate-hint {
  position: fixed;
  inset: 0;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 999;
  color: #fff;
}
.rotate-icon {
  font-size: 64px;
  animation: rotateHint 2s ease-in-out infinite;
  margin-bottom: 16px;
}
@keyframes rotateHint {
  0%, 100% { transform: rotate(0deg) }
  50% { transform: rotate(90deg) }
}
.rotate-hint p {
  font-size: 18px;
  color: #aaa;
}
</style>
