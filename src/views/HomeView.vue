<template>
  <div>
    <SearchComponent />
    <div v-if="store.loading">Loading...</div>
    <div v-else class="artwork-grid">
      <ArtworkCardComponent
        v-for="artwork in store.artworks"
        :key="artwork.id"
        :artwork="artwork"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { useRijksmuseumStore } from '@/stores/rijksmuseumStore'
import SearchComponent from '@/components/SearchComponent/SearchComponent.vue'
import ArtworkCardComponent from '@/components/ArtworkCardComponent/ArtworkCardComponent.vue'

export default {
  components: {
    SearchComponent,
    ArtworkCardComponent
  },
  setup() {
    const store = useRijksmuseumStore()
    return { store }
  }
}
</script>

<style scoped>
.artwork-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
}

</style>
