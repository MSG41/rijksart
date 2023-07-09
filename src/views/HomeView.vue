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
        @click.native="handleClick(artwork)"
      ></ArtworkCardComponent>

      <div class="fetch-more" ref="loadMoreElement"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, onBeforeUnmount, onActivated, ref, computed, nextTick } from 'vue'
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
    const scrollListenerEnabled = ref(false)

    const showDescriptionText = computed(() => {
      return store.artworks.length === 0 && !store.loading
    })

    onMounted(async () => {
      const y = store.retrieveScrollPosition('home')
      window.scrollTo(0, y)
      enableScrollListener()
    })

    onBeforeUnmount(() => {
      disableScrollListener()
      const y = window.scrollY
      store.storeScrollPosition('home', y)
    })

    const enableScrollListener = () => {
      scrollListenerEnabled.value = true
      window.addEventListener('scroll', handleScroll)
    }

    const disableScrollListener = () => {
      scrollListenerEnabled.value = false
      window.removeEventListener('scroll', handleScroll)
    }

    const handleScroll = () => {
      if (
        scrollListenerEnabled.value &&
        !store.loading &&
        !store.reachedEnd &&
        store.shouldPerformSearch()
      ) {
        const scrollPosition =
          window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
        const windowHeight =
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight ||
          0
        const documentHeight = Math.max(
          document.body.scrollHeight || 0,
          document.documentElement.scrollHeight || 0,
          document.body.offsetHeight || 0,
          document.documentElement.offsetHeight || 0,
          document.body.clientHeight || 0,
          document.documentElement.clientHeight || 0
        )

        if (scrollPosition + windowHeight >= documentHeight - 200) {
          store.loadMoreArtworks()
        }
      }
    }

    const resetFilters = () => {
      store.resetFilters()
    }

    const handleClick = (artwork: ArtworkDetails) => {
      store.storeScrollPosition('home', window.scrollY)
      router.push({ name: 'artworkDetail', params: { objectNumber: artwork.objectNumber } })
    }

    return {
      store,
      loadMoreElement,
      resetFilters,
      showDescriptionText,
      handleClick
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
