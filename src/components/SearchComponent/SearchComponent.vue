<template>
  <div>
    <div class="search-container">
      <input
        class="search-input"
        type="text"
        v-model="searchQuery"
        placeholder="Search for art..."
      />
    </div>
    <div class="search-placeholder" v-if="!searchQuery"></div>
  </div>
</template>

<script lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRijksmuseumStore } from '@/stores/rijksmuseumStore'
import { useRoute, useRouter } from 'vue-router'
import { debounce } from 'lodash'

export default {
  setup() {
    const store = useRijksmuseumStore()
    const route = useRoute()
    const router = useRouter()
    const searchQuery = ref(store.searchQuery) // Use a ref instead of a reactive object

    // Debounce the search function
    const debouncedSearch = debounce(() => {
      const query = searchQuery.value.trim()

      if (query !== store.searchQuery) {
        store.updateSearchQuery(query) // Update the search query in the store
        store.resetPagination() // Reset pagination before performing the search
        store.searchArtworks() // Trigger the search in the store

        // Push the new searchQuery to the URL
        router.replace({ name: 'home', query: { q: query } })
      }
    }, 500) // Delay of 500ms

    // Watch for changes to the search query
    watch(searchQuery, debouncedSearch)

    // Watch for changes in the route's query string
    watch(
      () => route.query.q,
      (newValue) => {
        const query = newValue as string

        if (searchQuery.value !== query) {
          searchQuery.value = query
        }
      }
    )

    // Perform initial search based on URL query
    onMounted(() => {
      const query = route.query.q as string

      if (query && searchQuery.value !== query) {
        searchQuery.value = query
        store.searchQuery = query
      }
    })

    // Reset pagination and searchQuery when navigating back from detail page
    router.afterEach((to, from) => {
      if (to.name === 'home' && from.name === 'detail') {
        store.resetPagination()
        searchQuery.value = store.searchQuery
      }
    })

    return { searchQuery }
  }
}
</script>

<style scoped>
.search-container {
  position: fixed;
  top: 80px;
  z-index: 3;
  margin: auto;
  height: 40px;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.search-placeholder {
  height: 40px;
}
</style>

<style scoped>
.search-container {
  position: fixed;
  top: 80px;
  z-index: 3;
  margin: auto;
  height: 40px;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.search-placeholder {
  height: 40px;
}
</style>
