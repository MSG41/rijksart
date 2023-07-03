import { defineStore } from 'pinia'
import { type ArtworkDetails } from '@/types/types'
import { RijksmuseumService } from '@/services/RijksmuseumService'

export const useRijksmuseumStore = defineStore('rijksmuseum', {
  state: () => ({
    artworks: [] as ArtworkDetails[],
    searchQuery: '',
    selectedMaterial: null as string | null,
    selectedTechnique: null as string | null,
    selectedType: null as string | null,
    loading: false,
    scrollPositions: {} as Record<string, number>,
    reachedEnd: false,
    lastSearchQuery: '',
    lastSelectedMaterial: null as string | null,
    lastSelectedTechnique: null as string | null,
    lastSelectedType: null as string | null
  }),

  actions: {
    initialize() {
      // Perform initialization here if needed
    },

    updateSearchQuery(query: string) {
      this.searchQuery = query.trim()
      if (this.searchQuery === '') {
        this.selectedMaterial = ''
        this.selectedTechnique = ''
        this.selectedType = ''
      }
    },

    updateSelectedMaterial(value: string | null) {
      this.selectedMaterial = value
    },

    updateSelectedTechnique(value: string | null) {
      this.selectedTechnique = value
    },

    updateSelectedType(value: string | null) {
      this.selectedType = value
    },

    storeScrollPosition(routePath: string, scrollPosition: number) {
      this.scrollPositions[routePath] = scrollPosition
    },

    retrieveScrollPosition(routePath: string) {
      return this.scrollPositions[routePath] || 0
    },

    async searchArtworks() {
      if (this.shouldPerformSearch()) {
        try {
          this.loading = true
          const response = await RijksmuseumService.searchArtworks(
            this.searchQuery,
            this.selectedMaterial,
            this.selectedTechnique,
            this.selectedType,
            1, // Page number
            10 // Page size
          )
          this.artworks = response.artObjects
          this.updateLastSearchFields()

          // Check if there are more artworks to load
          this.reachedEnd = response.artObjects.length < 10
        } catch (error) {
          console.error(error)
          // Handle error
        } finally {
          this.loading = false
        }
      } else {
        this.artworks = [] // Clear the artworks array when there are no search filters
      }
    },

    async loadMoreArtworks() {
      if (!this.loading && !this.reachedEnd) {
        try {
          this.loading = true
          const page = Math.ceil(this.artworks.length / 10) + 1
          const response = await RijksmuseumService.searchArtworks(
            this.searchQuery,
            this.selectedMaterial,
            this.selectedTechnique,
            this.selectedType,
            page,
            10 // Page size
          )
          this.artworks = [...this.artworks, ...response.artObjects]

          // Check if there are more artworks to load
          this.reachedEnd = response.artObjects.length < 10
        } catch (error) {
          console.error(error)
          // Handle error, e.g., show error message to the user
        } finally {
          this.loading = false
        }
      }
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
    }
  }
})
