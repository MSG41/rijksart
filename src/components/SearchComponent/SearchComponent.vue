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
import { ref, watch } from 'vue'
import { useRijksmuseumStore } from '@/stores/rijksmuseumStore'
import { debounce } from 'lodash'

export default {
  setup() {
    const store = useRijksmuseumStore()
    const searchQuery = ref('')

    const debouncedSearch = debounce(() => {
      store.searchArtworks(searchQuery.value)
    }, 500) // delay of 500ms

    watch(searchQuery, debouncedSearch)

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
