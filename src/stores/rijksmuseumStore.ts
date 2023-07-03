import { defineStore } from 'pinia'
import { RijksmuseumService } from '../services/RijksmuseumService'
import { debounce } from 'lodash'
import { type ArtworkDetails } from '@/types/types'

// Define the searchArtworks action separately
async function searchArtworks(this: any, page: number, pageSize: number) {
  if (this.shouldPerformSearch()) {
    try {
      this.loading = true
      const cacheKey = generateCacheKey(
        this.searchQuery,
        this.selectedMaterial,
        this.selectedTechnique,
        this.selectedType
      )
      const cachedArtworks = getCachedArtworks(cacheKey)

      if (cachedArtworks) {
        this.artworks = cachedArtworks
      } else {
        const response = await RijksmuseumService.searchArtworks(
          this.searchQuery,
          this.selectedMaterial,
          this.selectedTechnique,
          this.selectedType,
          page,
          pageSize
        )
        this.artworks = response.artObjects
        this.updateLastSearchFields()

        // Cache the artworks for future use
        cacheArtworks(cacheKey, this.artworks)

        // Check if there are more artworks to load
        if (response.artObjects.length < pageSize) {
          this.reachedEnd = true
        }
      }
    } catch (error) {
      console.error(error)
      // Handle error
    } finally {
      this.loading = false
    }
  } else {
    this.artworks = [] // Clear the artworks array when there are no search filters
  }
}

// Generate a cache key based on the search parameters
function generateCacheKey(
  searchQuery: string,
  selectedMaterial: string | null,
  selectedTechnique: string | null,
  selectedType: string | null
): string {
  return `${searchQuery}-${selectedMaterial}-${selectedTechnique}-${selectedType}`
}

// Cache the artworks using the cache key
function cacheArtworks(cacheKey: string, artworks: ArtworkDetails[]): void {
  // Implement your caching mechanism here, such as storing in local storage or session storage
  // Example using local storage:
  localStorage.setItem(cacheKey, JSON.stringify(artworks))
}

// Get the cached artworks using the cache key
function getCachedArtworks(cacheKey: string): ArtworkDetails[] | null {
  // Implement your caching mechanism here, such as retrieving from local storage or session storage
  // Example using local storage:
  const cachedData = localStorage.getItem(cacheKey)
  if (cachedData) {
    return JSON.parse(cachedData) as ArtworkDetails[]
  }
  return null
}

export const useRijksmuseumStore = defineStore({
  id: 'rijksmuseum',

  state: () => ({
    artworks: [] as ArtworkDetails[],
    searchQuery: '',
    selectedMaterial: null as string | null,
    selectedTechnique: null as string | null,
    selectedType: null as string | null,
    loading: false,
    scrollPositions: {} as Record<string, number>,
    lastSearchQuery: '',
    lastSelectedMaterial: null as string | null,
    lastSelectedTechnique: null as string | null,
    lastSelectedType: null as string | null
  }),

  actions: {
    initialize() {
      RijksmuseumService.initialize()
    },

    updateSearchQuery: debounce(function (this: any, query: string) {
      this.searchQuery = query.trim()
      this.searchArtworks(1, 10)
    }, 200),

    updateSelectedMaterial: debounce(function (this: any, value: string | null) {
      this.selectedMaterial = value
      this.searchArtworks(1, 10)
    }, 200),

    updateSelectedTechnique: debounce(function (this: any, value: string | null) {
      this.selectedTechnique = value
      this.searchArtworks(1, 10)
    }, 200),

    updateSelectedType: debounce(function (this: any, value: string | null) {
      this.selectedType = value
      this.searchArtworks(1, 10)
    }, 200),

    storeScrollPosition(routePath: string, scrollPosition: number) {
      this.scrollPositions[routePath] = scrollPosition
    },

    retrieveScrollPosition(routePath: string) {
      return this.scrollPositions[routePath] || 0
    },

    shouldPerformSearch() {
      return (
        (this.searchQuery.trim() !== '' ||
          this.selectedMaterial !== null ||
          this.selectedTechnique !== null ||
          this.selectedType !== null) &&
        (this.searchQuery.trim() !== this.lastSearchQuery ||
          this.selectedMaterial !== this.lastSelectedMaterial ||
          this.selectedTechnique !== this.lastSelectedTechnique ||
          this.selectedType !== this.lastSelectedType)
      )
    },

    updateLastSearchFields() {
      this.lastSearchQuery = this.searchQuery
      this.lastSelectedMaterial = this.selectedMaterial
      this.lastSelectedTechnique = this.selectedTechnique
      this.lastSelectedType = this.selectedType
    },

    searchArtworks
  }
})
