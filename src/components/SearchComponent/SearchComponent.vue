<template>
  <div>
    <div class="search-container">
      <input
        class="search-input"
        type="text"
        v-model="store.searchQuery"
        placeholder="Search for art..."
        @input="updateSearchQuery"
      />

      <div class="dropdowns-container">
        <v-select
          class="dd1"
          :options="materialsOptions"
          v-model="store.selectedMaterial"
          placeholder="Select material..."
          label="label"
          @input="updateSelectedMaterial"
          filterable
        />
        <v-select
          class="dd1"
          :options="techniquesOptions"
          v-model="store.selectedTechnique"
          placeholder="Select technique..."
          label="label"
          @input="updateSelectedTechnique"
          filterable
        />
        <v-select
          class="dd1"
          :options="typesOptions"
          v-model="store.selectedType"
          placeholder="Select type..."
          label="label"
          @input="updateSelectedType"
          filterable
        />
      </div>
    </div>
    <div class="search-placeholder" v-if="!store.searchQuery"></div>
  </div>
</template>

<script lang="ts">
import { ref, watch, watchEffect } from 'vue'
import { useRijksmuseumStore } from '@/stores/rijksmuseumStore'
import materials from '@/data/material.json'
import techniques from '@/data/technique.json'
import types from '@/data/type.json'
import 'vue-select/dist/vue-select.css'
import vSelect from 'vue-select'
import debounce from 'lodash/debounce'

export default {
  components: { vSelect },
  setup() {
    const store = useRijksmuseumStore()

    const updateSearchQuery = debounce(function (event: Event) {
      const query = (event.target as HTMLInputElement).value
      store.updateSearchQuery(query.trim())
    }, 300) // Increased debounce time to 300 milliseconds

    const updateSelectedMaterial = debounce(function (value: string | null) {
      store.updateSelectedMaterial(value)
    }, 200)

    const updateSelectedTechnique = debounce(function (value: string | null) {
      store.updateSelectedTechnique(value)
    }, 200)

    const updateSelectedType = debounce(function (value: string | null) {
      store.updateSelectedType(value)
    }, 200)

    const materialsOptions = ref([...materials.map((material) => material.value)])

    const techniquesOptions = ref([...techniques.map((technique) => technique.value)])

    const typesOptions = ref([...types.map((type) => type.value)])

    // ...

    return {
      store,
      materialsOptions,
      techniquesOptions,
      typesOptions,
      updateSearchQuery,
      updateSelectedMaterial,
      updateSelectedTechnique,
      updateSelectedType
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
  width: 18rem;
  margin: auto;
  gap: 10px;
}

.dropdowns-container {
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex: 1;
  width: fit-content;
  background-color: white;
  border-radius: 10px;
}

.dd1 {
  width: 15rem;
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
  .search-container {
    flex-direction: column;
    align-items: stretch;
    top: 80px;
    padding: 10px;
  }

  .search-input {
    margin-bottom: 10px;
  }

  .dropdowns-container {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
