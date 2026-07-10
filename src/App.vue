<script setup>
import { ref } from 'vue'
import HeaderBar from './components/HeaderBar.vue'
import HeroSection from './components/HeroSection.vue'
import FeatureGrid from './components/FeatureGrid.vue'
import UsageCards from './components/UsageCards.vue'
import Advantages from './components/Advantages.vue'
import FooterBar from './components/FooterBar.vue'
import BattleCityGame from './components/BattleCityGame.vue'

const showGame = ref(false)
</script>

<template>
  <HeaderBar v-if="!showGame" />
  <main v-if="!showGame">
    <HeroSection />
    <FeatureGrid />
    <UsageCards />
    <Advantages />
    <section class="game-cta">
      <h2 class="cta-title">经典游戏</h2>
      <p class="cta-desc">重温红白机经典 — 坦克大战</p>
      <button class="cta-btn" @click="showGame = true">开始游戏</button>
    </section>
  </main>
  <FooterBar v-if="!showGame" />
  <BattleCityGame v-if="showGame" @exit="showGame = false" />
</template>

<style scoped>
.game-cta {
  text-align: center;
  padding: 60px 24px;
}
.cta-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-h);
  margin: 0 0 8px;
  letter-spacing: -0.3px;
}
.cta-desc {
  font-size: 15px;
  color: var(--text);
  margin: 0 0 24px;
}
.cta-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  background: var(--accent);
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}
.cta-btn:hover {
  background: var(--accent-hover);
}
</style>
