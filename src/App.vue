<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="navbar">
    <header>
      <RouterLink to="/" class="nav-link">Home</RouterLink>
      <RouterLink to="/about" class="nav-link">About</RouterLink>
    </header>
  </div>

  <RouterView />
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: #f0f0f092;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 960px;
  margin: 0 auto;
  padding: 1rem;
}

.nav-link {
  font-size: 12px;
  padding: 0.5rem;
  text-decoration: none;
  color: #000;
}

@media (min-width: 768px) {
  header {
    padding: 1rem 2rem;
  }

  .nav-link {
    font-size: 14px;
    padding: 0.75rem;
  }
}
</style>
