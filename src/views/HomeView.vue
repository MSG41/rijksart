<template>
  <div>
    <div class="search-wrapper">
      <SearchComponent />
    </div>

    <div class="artwork-grid">
      <ArtworkCardComponent
        v-for="artwork in filteredArtworks"
        :key="artwork.objectNumber"
        :artwork="artwork"
        :loading="loading"
        :scroll-position="retrieveScrollPosition(artwork.objectNumber)"
        @update-scroll-position="storeScrollPosition(artwork.objectNumber, $event)"
      />
      <div class="fetch-more" ref="loadMoreElement"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRijksmuseumStore } from '@/stores/rijksmuseumStore'
import SearchComponent from '@/components/SearchComponent/SearchComponent.vue'
import ArtworkCardComponent from '@/components/ArtworkCardComponent/ArtworkCardComponent.vue'
import { debounce } from 'lodash'

export default {
  components: {
    SearchComponent,
    ArtworkCardComponent
  },
  setup() {
    const store = useRijksmuseumStore()

    const reachedEnd = ref(false)
    const loadMoreElement = ref(null)

    const loadMoreArtworks = debounce(() => {
      if (!reachedEnd.value && !store.loading) {
        const page = Math.ceil(store.artworks.length / 10) + 1
        const pageSize = 10
        store.searchArtworks(page, pageSize)
      }
    }, 500)

    const handleScroll = debounce(() => {
      if (window.innerHeight + window.scrollY >= document.documentElement.offsetHeight) {
        loadMoreArtworks()
      }
    }, 200)

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll)
      store.storeScrollPosition('home', window.scrollY)
    })

    const filteredArtworks = computed(() => store.artworks)
    const loading = computed(() => store.loading)

    return {
      filteredArtworks,
      loading,
      loadMoreElement,
      reachedEnd,
      retrieveScrollPosition: store.retrieveScrollPosition,
      storeScrollPosition: store.storeScrollPosition
    }
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
  display: flex;
  z-index: 3;
  width: fit-content;
  max-width: fit-content;
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

.fetch-more {
  height: 100px; /* Change the height as needed */
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
    margin-top: 220px;
  }
}
</style>
