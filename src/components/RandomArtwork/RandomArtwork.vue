<template>
  <div v-if="loading" class="loading">Loading...</div>
  <div v-else-if="artwork" class="artwork-container">
    <h1 class="title">{{ artwork.title }}</h1>
    <h2 class="artist">{{ artwork.principalOrFirstMaker }}</h2>
    <p>Period: {{ artwork.description }}</p>
    <p>Technique: {{ artwork.technique }}</p>
    <p v-if="artwork.productionPlace">Production Place: {{ artwork.productionPlace }}</p>
    <p v-if="artwork.material">Material: {{ artwork.technique }}</p>
    <img
      :src="artwork.webImage.url"
      alt="Artwork image"
      v-if="artwork.hasImage && artwork.webImage"
      class="artwork-image"
    />
    <p v-if="artwork.description" class="description">{{ artwork.description }}</p>
  </div>
  <div v-else>No Artwork Data</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { type Artwork } from '@/types/types'

export default defineComponent({
  name: 'Artwork',
  data() {
    return {
      loading: true,
      artwork: null as Artwork | null
    }
  },
 
})
</script>

<style scoped>
.loading {
  font-size: 2em;
  color: #888;
  text-align: center;
}

.artwork-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}

.title {
  font-size: 1.5em;
  color: #333;
}

.artist {
  font-size: 1.2em;
  color: #666;
}

.artwork-image {
  max-width: 100%;
  height: auto;
}

.description {
  color: #666;
  font-size: 0.9em;
}
</style>
