<template>
  <div>
    <div class="search-wrapper">
      <SearchComponent @search="handleSearch" />
    </div>

    <div class="artwork-grid">
      <button @click="downloadFacetsData('material')" :disabled="downloading">
        Download Materials
      </button>
      <button @click="downloadFacetsData('technique')" :disabled="downloading">
        Download Techniques
      </button>
      <button @click="downloadFacetsData('type')" :disabled="downloading">Download Types</button>

      <ArtworkCardComponent
        v-for="artwork in Object.values(store.artworks)"
        :key="artwork.objectNumber"
        :artwork="artwork"
        :loading="store.loading"
        :scroll-position="store.retrieveScrollPosition(artwork.objectNumber)"
        @update-scroll-position="store.storeScrollPosition(artwork.objectNumber, $event)"
      />

      <div
        v-intersect="loadMoreArtworks"
        v-if="!store.reachedEnd && !store.loading"
        class="fetch-more"
      ></div>
    </div>

    <div v-if="downloadComplete" class="download-message">Download completed!</div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRijksmuseumStore } from '@/stores/rijksmuseumStore'
import SearchComponent from '@/components/SearchComponent/SearchComponent.vue'
import { RijksmuseumService } from '@/services/RijksmuseumService'
import ArtworkCardComponent from '@/components/ArtworkCardComponent/ArtworkCardComponent.vue'
import { debounce } from 'lodash'
import { useRoute } from 'vue-router'

export default {
  components: {
    SearchComponent,
    ArtworkCardComponent
  },
  directives: {
    intersect: {
      beforeMount(el, binding) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              binding.value()
            }
          },
          { threshold: 1.0 }
        )

        observer.observe(el)
        el.__vueIntersectionObserver__ = observer
      },
      unmounted(el) {
        if (el.__vueIntersectionObserver__) {
          el.__vueIntersectionObserver__.disconnect()
        }
      }
    }
  },
  setup() {
    const store = useRijksmuseumStore()
    const route = useRoute()
    const downloading = ref(false)
    const downloadComplete = ref(false)

    const loadMoreArtworks = debounce(() => {
      if (!store.reachedEnd && !store.loading) {
        store.searchArtworks()
      }
    }, 500)

    onMounted(() => {
      const storedScrollPosition = store.retrieveScrollPosition(route.fullPath)
      window.scrollTo(0, storedScrollPosition)
    })

    onBeforeUnmount(() => {
      store.storeScrollPosition(route.fullPath, window.pageYOffset)
    })

    const handleSearch = (query: string) => {
      store.resetPagination()
      store.updateSearchQuery(query)
      store.searchArtworks()
    }

    const downloadFacetsData = async (facetName: string) => {
      downloading.value = true

      try {
        const facets = await RijksmuseumService.getAllFacets(facetName)
        downloadFacetsJson(facetName, facets)
        downloadComplete.value = true
      } catch (error) {
        console.error(`Error downloading ${facetName}:`, error)
      } finally {
        downloading.value = false
      }
    }

    const downloadFacetsJson = (facetName: string, data: any[]) => {
      const jsonData = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${facetName}.json`
      link.click()
      URL.revokeObjectURL(url)
    }

    return {
      store,
      loadMoreArtworks,
      handleSearch,
      downloadFacetsData,
      downloading,
      downloadComplete
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

.download-message {
  margin-top: 20px;
  text-align: center;
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
