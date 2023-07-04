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
        :scroll-position="store.retrieveScrollPosition(artwork.objectNumber)"
        @update-scroll-position="store.storeScrollPosition(artwork.objectNumber, $event)"
      />
      <div class="fetch-more" ref="loadMoreElement" v-if="!store.reachedEnd"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
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
    const loadMoreElement = ref<HTMLElement | null>(null)
    const artworkGrid = ref<HTMLElement | null>(null)

    const showDescriptionText = computed(() => {
      return store.artworks.length === 0 && !store.loading
    })

    onMounted(() => {
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('touchmove', handleScroll, { passive: true })
      loadMoreElement.value = document.querySelector('.fetch-more')
      artworkGrid.value = document.querySelector('.artwork-grid')
      store.initialize()
      store.searchArtworks()
    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchmove', handleScroll)
    })

    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.offsetHeight &&
        !store.loading &&
        !store.reachedEnd
      ) {
        store.loadMoreArtworks()
      }
    }

    const resetFilters = () => {
      store.resetFilters()
    }

    return {
      store,
      loadMoreElement,
      resetFilters,
      showDescriptionText
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
