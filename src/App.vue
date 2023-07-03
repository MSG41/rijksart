<template>
  <div class="navbar">
    <header>
      <RouterLink to="/" class="nav-link">Home</RouterLink>
      <RouterLink to="/about" class="nav-link">About</RouterLink>
    </header>
  </div>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useRijksmuseumStore } from '@/stores/rijksmuseumStore'
import { onMounted, onUnmounted } from 'vue'

const store = useRijksmuseumStore()

const scrollHandler = () => {
  store.scrollHandler()
}

onMounted(() => {
  window.addEventListener('scroll', scrollHandler)
  store.initialize()
  window.scrollTo(0, store.retrieveScrollPosition('home'))
})

onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandler)
  store.storeScrollPosition('home', window.scrollY)
  store.saveStateToLocalStorage()
})
</script>

<style>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 4;
  background-color: #f0f0f092;
}

header {
  display: flex;
  align-items: center;
  max-width: 960px;
  margin: 0 10px;
  padding: 1rem;
}

.nav-link {
  font-size: 12px;
  padding: 0.5rem;
  text-decoration: none;
  color: #000;
}
</style>
