<script setup>
import { useRouter } from 'vue-router'
import HeaderBar from '../components/HeaderBar.vue'
import HeroSection from '../components/HeroSection.vue'
import ProjectGrid from '../components/ProjectGrid.vue'
import FooterBar from '../components/FooterBar.vue'

const router = useRouter()

function onSelectProject(id) {
  if (id === 'battle-city') {
    router.push('/battle-city')
  }
}
</script>

<template>
  <HeaderBar />
  <main>
    <HeroSection />
    <ProjectGrid @select="onSelectProject" />
  </main>
  <FooterBar />
</template>
