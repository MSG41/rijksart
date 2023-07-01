<template>
  <router-link :to="`/artwork/${artwork.objectNumber}`" class="artwork-card">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
    </div>
    <div v-else>
      <h2>{{ artwork.title }}</h2>
      <div v-if="artwork.hasImage && artwork.webImage.url" class="image-container">
        <img class="artwork-image" :src="artwork.webImage.url" :alt="artwork.title" />
      </div>
      <p>{{ artwork.longTitle }}</p>
    </div>
  </router-link>
</template>

<script lang="ts">
import { RouterLink } from 'vue-router'

export default {
  components: {
    RouterLink
  },
  props: {
    artwork: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped>
.artwork-card {
  position: relative;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  margin: 10px auto;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;
}

.artwork-card:hover {
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
}

.image-container {
  max-height: 200px;
  overflow: hidden;
}

.artwork-image {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}

.loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
