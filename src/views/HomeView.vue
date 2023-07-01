<template>
  <div>
    <div class="search-wrapper">
      <SearchComponent @search="handleSearch" />
    </div>
    <div class="artwork-grid">
      <ArtworkCardComponent
        v-for="artwork in Object.values(store.artworks)"
        :key="artwork.objectNumber"
        :artwork="artwork"
        :loading="store.loading"
        :scroll-position="store.retrieveScrollPosition(artwork.objectNumber)"
        @update-scroll-position="store.storeScrollPosition(artwork.objectNumber, $event)"
      />
      <!-- When this element is visible in the viewport, fetch more artworks -->
      <div
        v-intersect="loadMoreArtworks"
        v-if="!store.reachedEnd && !store.loading"
        class="fetch-more"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRijksmuseumStore } from '@/stores/rijksmuseumStore'
import SearchComponent from '@/components/SearchComponent/SearchComponent.vue'
import ArtworkCardComponent from '@/components/ArtworkCardComponent/ArtworkCardComponent.vue'
import { onMounted, onBeforeUnmount } from 'vue'
import { debounce } from 'lodash'
import { useRoute } from 'vue-router'

export default {
  components: {
    SearchComponent,
    ArtworkCardComponent
  },
  directives: {
    intersect: {
      // When the element is visible in the viewport, call the provided method
      beforeMount(el, binding) {
        const observer = new IntersectionObserver(
          ([entry]) => entry.isIntersecting && binding.value(),
          { threshold: 1.0 }
        )
        observer.observe(el)
        el.__vueIntersectionObserver__ = observer // Store the observer instance on the element
      },
      unmounted(el) {
        if (el.__vueIntersectionObserver__) {
          el.__vueIntersectionObserver__.disconnect() // Disconnect the observer when the element is unmounted
        }
      }
    }
  },
  setup() {
    const store = useRijksmuseumStore()
    const route = useRoute()

    const loadMoreArtworks = debounce(() => {
      if (!store.reachedEnd && !store.loading) {
        store.searchArtworks() // Fetch more artworks from the store
      }
    }, 500)

    onMounted(() => {
      const storedScrollPosition = store.retrieveScrollPosition(route.fullPath)
      window.scrollTo(0, storedScrollPosition) // Scroll to the stored position on initial mount
    })

    onBeforeUnmount(() => {
      store.storeScrollPosition(route.fullPath, window.pageYOffset) // Store the scroll position in the store
    })

    const handleSearch = (query: string) => {
      store.resetPagination()
      store.updateSearchQuery(query)
      store.searchArtworks()
    }

    return { store, loadMoreArtworks, handleSearch }
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
