<template>
  <div>
    <div class="search-container">
      <div class="filter-wrapper">
        <button class="filter-toggle" @click="toggleDropdowns">Filter</button>
      </div>
      <input
        class="search-input"
        type="text"
        v-model="store.searchQuery"
        placeholder="Search for art..."
      />
      <div class="dropdowns-container" :class="{ open: showDropdowns }">
        <v-select
          class="dd1 select-input"
          :options="store.types"
          v-model="store.selectedType"
          placeholder="Types"
          label="label"
        />
        <v-select
          class="dd1"
          :options="store.materials"
          v-model="store.selectedMaterial"
          placeholder="Materials"
          label="label"
        />
        <v-select
          class="dd1"
          :options="store.techniques"
          v-model="store.selectedTechnique"
          placeholder="Techniques"
          label="label"
        />
      </div>
    </div>
    <div class="search-placeholder" v-if="!store.searchQuery"></div>
  </div>
</template>

<script lang="ts">
import { ref, watch, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useRijksmuseumStore } from '@/stores/rijksmuseumStore'
import 'vue-select/dist/vue-select.css'
import vSelect from 'vue-select'
import { debounce } from 'lodash'

export default {
  components: { vSelect, FontAwesomeIcon },
  setup() {
    const store = useRijksmuseumStore()

    const showDropdowns = ref(false)
    const searchArtworks = computed(() => {
      if (
        store.searchQuery.trim() === '' &&
        !store.selectedMaterial &&
        !store.selectedTechnique &&
        !store.selectedType
      ) {
        return []
      }

      // Perform the search with the provided filters
      return store.searchArtworks()
    })

    const toggleDropdowns = () => {
      showDropdowns.value = !showDropdowns.value
    }

    const debouncedSearchArtworks = debounce(() => {
      searchArtworks.value
    }, 500)

    // Watch the searchQuery in the store and trigger the debounced search
    watch(
      () => store.searchQuery,
      () => {
        debouncedSearchArtworks()
      }
    )

    // Watch the selected filters in the store and trigger the debounced search
    watch(
      [() => store.selectedMaterial, () => store.selectedTechnique, () => store.selectedType],
      () => {
        debouncedSearchArtworks()
      }
    )

    return {
      store,
      showDropdowns,
      toggleDropdowns,
      searchArtworks
    }
  }
}
</script>

<style scoped>
.search-container {
  display: flex;
  flex-direction: row;
  align-content: center;
  position: fixed;
  top: 80px;
  z-index: 3;
  width: 200px;
  margin: auto;
  gap: 10px;
  touch-action: manipulation;
}

.filter-wrapper {
  display: flex;
  flex-direction: row;
}

.filter-toggle {
  margin-right: 10px;
  background-color: #fff;
  border: 2px solid #333;
  color: #333;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.filter-toggle:hover {
  background-color: #333;
  color: #fff;
}

.dropdowns-container {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.dropdowns-container.open {
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px;
}

.dd1 {
  width: 15rem;
  margin-bottom: 10px;
}

:deep(.vs__dropdown-toggle) {
  cursor: pointer;
}

.search-input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  height: 2rem;
}

.search-placeholder {
  height: 40px;
}

@media screen and (max-width: 954px) {
  .search-input {
    margin-bottom: 10px;
    width: 150px;
  }
}
</style>
