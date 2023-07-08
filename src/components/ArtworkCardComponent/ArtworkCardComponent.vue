<template>
  <router-link :to="`/artwork/${artwork.objectNumber}`" class="artwork-card">
    <div class="card-content" v-if="!loading">
      <h2>{{ artwork.title }}</h2>
      <div v-if="artwork.hasImage && artwork.webImage.url" class="image-container">
        <img class="artwork-image" :src="artwork.webImage.url" :alt="artwork.title" />
      </div>
      <p>{{ artwork.longTitle }}</p>
    </div>
    <div class="card-content loading" v-else>
      <div class="spinner"></div>
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

.card-content.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 5rem;
  height: 5rem;
  animation: spin 1s linear infinite;
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
