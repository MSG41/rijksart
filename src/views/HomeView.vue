<template>
  <div>
    <div class="search-wrapper">
      <SearchComponent />
    </div>
    <div v-if="store.loading" class="loading">Loading...</div>
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
  margin-top: 100px;
  grid-template-columns: repeat(
    auto-fit,
    minmax(300px, 1fr)
  ); /* Change 'auto-fill' to 'auto-fit' */
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
}

.search-wrapper {
  position: sticky; /* Change 'fixed' to 'sticky' */
  top: 100px;
  left: 20px;
  z-index: 3;
  /* margin: auto; */
  width: 100%; /* Set width to 100% */
  max-width: 600px; /* Add a maximum width for better mobile experience */
  padding: 0 10px;
  box-sizing: border-box;
}

.loading {
  margin-top: 50px;
  text-align: center;
}

.search-placeholder {
  width: fit-content;
  height: 40px;
}

@media (max-width: 660px) {
  .search-wrapper {
    position: relative;
    top: initial;
    width: 100%;
    margin-top: 10px; /* Adjust the margin to your preference */
    padding: 0; /* Remove padding */
    box-sizing: border-box;
  }
  .artwork-grid {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
