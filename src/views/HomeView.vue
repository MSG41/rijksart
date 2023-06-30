<template>
  <div>
    <div class="search-wrapper">
      <SearchComponent />
    </div>
    <div v-if="store.loading" class="loading">Loading...</div>
    <div v-else class="artwork-grid">
      <ArtworkCardComponent
        v-for="artwork in Object.values(store.artworks)"
        :key="artwork.objectNumber"
        :artwork="artwork"
      />
      <!-- When this element is visible in the viewport, fetch more artworks -->
      <div v-intersect="loadMoreArtworks" v-if="!store.reachedEnd" class="fetch-more"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRijksmuseumStore } from '@/stores/rijksmuseumStore'
import SearchComponent from '@/components/SearchComponent/SearchComponent.vue'
import ArtworkCardComponent from '@/components/ArtworkCardComponent/ArtworkCardComponent.vue'
import { onMounted } from 'vue'

export default {
  components: {
    SearchComponent,
    ArtworkCardComponent
  },
  directives: {
    intersect: {
      // When the element is visible in the viewport, call the provided method
      beforeMount: (el, binding) => {
        const observer = new IntersectionObserver(
          ([entry]) => entry.isIntersecting && binding.value(),
          { threshold: 1.0 }
        )
        observer.observe(el)
      },
      unmounted: (el, binding) => {
        const observer = new IntersectionObserver(
          ([entry]) => entry.isIntersecting && binding.value(),
          { threshold: 1.0 }
        )
        observer.unobserve(el)
      }
    }
  },
  setup() {
    const store = useRijksmuseumStore()

    function loadMoreArtworks() {
      if (!store.loading) {
        store.searchArtworks(store.searchQuery)
      }
    }

    onMounted(() => {
      store.initializeStore()
    })

    return { store, loadMoreArtworks }
  }
}
</script>

<style scoped>
.artwork-grid {
  display: grid;
  margin-top: 100px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
}

.search-wrapper {
  position: sticky;
  top: 100px;
  left: 20px;
  z-index: 3;

  width: 100%;
  max-width: 600px;
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
    margin-top: 10px;
    padding: 0;
    box-sizing: border-box;
  }
  .artwork-grid {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
