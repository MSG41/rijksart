<template>
  <div class="search-wrapper">
    <SearchComponent @search="handleSearch" />
    <h4 v-if="store.artworks.length === 0">No art found.</h4>
  </div>

  <div class="artwork-grid" ref="artworkGrid">
    <ArtworkCardComponent
      v-for="artwork in store.artworks"
      :key="artwork.objectNumber"
      :artwork="artwork"
      :loading="store.loading"
      :scroll-position="store.retrieveScrollPosition(artwork.objectNumber)"
      @update-scroll-position="store.storeScrollPosition(artwork.objectNumber, $event)"
    />
    <div class="fetch-more" ref="loadMoreElement"></div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
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
    const loadMoreElement = ref<HTMLElement | null>(null)
    const artworkGrid = ref<HTMLElement | null>(null)
    const lastScrollPosition = ref(0) // Store the last scroll position
    let previousScrollPosition = 0 // Track previous scroll position

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
      loadMoreElement.value = document.querySelector('.fetch-more')
      artworkGrid.value = document.querySelector('.artwork-grid')
      store.initialize() // Call the initialize method in the store
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll)
      store.storeScrollPosition('home', lastScrollPosition.value) // Save the last scroll position
    })

    const handleScroll = debounce(() => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.offsetHeight &&
        !store.loading &&
        !store.reachedEnd
      ) {
        loadMoreArtworks()
      }
    }, 200)

    const handleSearch = (query: string) => {
      store.updateSearchQuery(query)
      store.searchArtworks()
    }

    const loadMoreArtworks = () => {
      lastScrollPosition.value = window.scrollY // Store the current scroll position
      previousScrollPosition = window.scrollY // Track previous scroll position
      store.loadMoreArtworks().then(() => {
        // Scroll to previous position after updating artworks
        nextTick(() => {
          window.scrollTo(0, previousScrollPosition)
        })
      })
    }

    watch(
      () => [
        store.searchQuery,
        store.selectedMaterial,
        store.selectedTechnique,
        store.selectedType
      ],
      () => {
        store.searchArtworks()
      }
    )

    return {
      store,
      loadMoreElement,
      handleSearch,
      loadMoreArtworks
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

.fetch-more {
  height: 100px;
}

@media (max-width: 660px) {
  .search-wrapper {
    position: relative;
    top: initial;
    width: 100%;
    margin-top: 180px;
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
