<script setup>
import { ref } from 'vue'
import HeaderBar from './components/HeaderBar.vue'
import HeroSection from './components/HeroSection.vue'
import ProjectGrid from './components/ProjectGrid.vue'
import GameIntroModal from './components/GameIntroModal.vue'
import FooterBar from './components/FooterBar.vue'
import BattleCityGame from './components/BattleCityGame.vue'

const showGame = ref(false)
const showIntro = ref(false)

function onSelectProject(id) {
  if (id === 'battle-city') {
    showIntro.value = true
  }
}
function onStartGame() {
  showIntro.value = false
  showGame.value = true
}
function onExitGame() {
  showGame.value = false
}
</script>

<template>
  <HeaderBar v-if="!showGame" />
  <main v-if="!showGame">
    <HeroSection />
    <ProjectGrid @select="onSelectProject" />
  </main>
  <FooterBar v-if="!showGame" />
  <GameIntroModal v-if="showIntro" @start="onStartGame" @close="showIntro = false" />
  <BattleCityGame v-if="showGame" @exit="onExitGame" />
</template>
