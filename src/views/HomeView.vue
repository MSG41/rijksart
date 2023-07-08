<template>
  <div class="home-view">
    <div class="search-wrapper">
      <div class="search-bar">
        <SearchComponent />
      </div>

      <div class="filter-wrapper">
        <button class="reset-button" @click="resetFilters">Reset</button>
      </div>
    </div>

    <h4 class="no-art description-text" v-if="showDescriptionText">
      This is a list of artworks present in the Rijksmuseum API. Use the search bar and filters to
      display artworks that match your criteria. Click the "Reset" button to clear all filters and
      start a new search.
    </h4>

    <h4 class="no-art" v-if="store.artworks.length === 0 && !store.loading">No art found.</h4>

    <div class="artwork-grid" ref="artworkGrid">
      <ArtworkCardComponent
        v-for="artwork in store.artworks"
        :key="artwork.objectNumber"
        :artwork="artwork"
        :loading="store.loading"
        :scroll-position="store.scrollPositions[artwork.objectNumber]"
        @update-scroll-position="updateScrollPosition(artwork.objectNumber, $event)"
        @click.native="handleClick(artwork)"
      />

      <div class="fetch-more" ref="loadMoreElement"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, onBeforeUnmount, ref, computed, nextTick } from 'vue'
import { useRijksmuseumStore } from '@/stores/rijksmuseumStore'
import SearchComponent from '@/components/SearchComponent/SearchComponent.vue'
import ArtworkCardComponent from '@/components/ArtworkCardComponent/ArtworkCardComponent.vue'
import router from '@/router'
import { type ArtworkDetails } from '@/types/types'

export default {
  components: {
    SearchComponent,
    ArtworkCardComponent
  },
  setup() {
    const store = useRijksmuseumStore()
    const loadMoreElement = ref<HTMLElement | null>(null)
    const artworkGrid = ref<HTMLElement | null>(null)

    let observer: IntersectionObserver | null = null

    const showDescriptionText = computed(() => {
      return store.artworks.length === 0 && !store.loading
    })

    onMounted(async () => {
      store.initialize()
      const { y = 0, page = 1 } = JSON.parse(localStorage.getItem('scrollPos') || '{}')
      for (let i = 1; i <= page; i++) {
        await store.loadMoreArtworks() // Make sure this doesn't reset the artworks array
      }

      // Wait for the next DOM update so that all artworks are rendered
      await nextTick()
      window.scrollTo(0, y)
      setupIntersectionObserver()
    })

    const setupIntersectionObserver = () => {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }

      observer = new IntersectionObserver(handleIntersection, options)
      if (loadMoreElement.value) observer.observe(loadMoreElement.value)
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0]
      if (entry.isIntersecting && !store.loading && !store.reachedEnd) {
        store.loadMoreArtworks()
      }
    }

    const resetFilters = () => {
      store.resetFilters()
    }

    onBeforeUnmount(() => {
      if (observer) {
        observer.disconnect()
      }
    })

    const handleClick = (artwork: ArtworkDetails) => {
      const y = window.scrollY
      const page = store.page
      localStorage.setItem('scrollPos', JSON.stringify({ y, page }))
      router.push({ name: 'ArtworkDetails', params: { id: artwork.objectNumber } })
    }

    const updateScrollPosition = (objectNumber: string, position: number) => {
      store.storeScrollPosition(objectNumber, position)
    }

    return {
      store,
      loadMoreElement,
      resetFilters,
      showDescriptionText,
      handleClick,
      updateScrollPosition
    }
  }
}
</script>

<style scoped>
.home-view {
  margin-top: 60px;
  padding-top: 20px;
}

.search-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  padding: 0 10px;
  box-sizing: border-box;
}

.search-bar {
  flex-grow: 1;
  margin-right: 10px;
}

.filter-wrapper {
  display: flex;
  align-items: center;
}

.reset-button {
  background-color: #fff;
  border: 2px solid #333;
  color: #333;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.reset-button:hover {
  background-color: #333;
  color: #fff;
}

.no-art {
  text-align: center;
  color: #888;
  padding: 2rem;
  max-width: 800px;
  margin: auto;
}

.description-text {
  margin-top: 20px;
}

.artwork-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
}

@media (max-width: 660px) {
  .search-wrapper {
    flex-wrap: wrap;
  }

  .search-bar {
    margin-bottom: 10px;
  }

  .artwork-grid {
    margin-top: 20px;
  }

  .filter-wrapper {
    margin-bottom: 10px;
  }
}
</style>
