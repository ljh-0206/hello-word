<script setup>
import HeaderBar from './components/HeaderBar.vue'
import HeroSection from './components/HeroSection.vue'
import FeatureGrid from './components/FeatureGrid.vue'
import UsageCards from './components/UsageCards.vue'
import Advantages from './components/Advantages.vue'
import FooterBar from './components/FooterBar.vue'
</script>

<template>
  <HeaderBar />
  <main>
    <HeroSection />
    <FeatureGrid />
    <UsageCards />
    <Advantages />
  </main>
  <FooterBar />
</template>
