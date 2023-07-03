import { defineStore } from 'pinia'
import { type ArtworkDetails } from '@/types/types'
import { RijksmuseumService } from '@/services/RijksmuseumService'

const STORAGE_KEY = 'rijksmuseum_store'

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
    lastSelectedType: null as string | null,
    container: null as HTMLElement | null // Add a container reference
  }),

  actions: {
    initialize() {
      const storedState = localStorage.getItem(STORAGE_KEY)
      if (storedState) {
        const parsedState = JSON.parse(storedState)
        this.artworks = parsedState.artworks || []
        this.searchQuery = parsedState.searchQuery || ''
        this.selectedMaterial = parsedState.selectedMaterial || null
        this.selectedTechnique = parsedState.selectedTechnique || null
        this.selectedType = parsedState.selectedType || null
        this.reachedEnd = parsedState.reachedEnd || false
        this.lastSearchQuery = parsedState.lastSearchQuery || ''
        this.lastSelectedMaterial = parsedState.lastSelectedMaterial || null
        this.lastSelectedTechnique = parsedState.lastSelectedTechnique || null
        this.lastSelectedType = parsedState.lastSelectedType || null
      }
    },

    updateSearchQuery(query: string) {
      this.searchQuery = query.trim()
      if (this.searchQuery === '') {
        this.selectedMaterial = null
        this.selectedTechnique = null
        this.selectedType = null
      }
      this.saveStateToLocalStorage()
    },

    updateSelectedMaterial(value: string | null) {
      this.selectedMaterial = value
      this.saveStateToLocalStorage()
    },

    updateSelectedTechnique(value: string | null) {
      this.selectedTechnique = value
      this.saveStateToLocalStorage()
    },

    updateSelectedType(value: string | null) {
      this.selectedType = value
      this.saveStateToLocalStorage()
    },

    storeScrollPosition(routePath: string, scrollPosition: number) {
      this.scrollPositions[routePath] = scrollPosition
    },

    retrieveScrollPosition(routePath: string) {
      return this.scrollPositions[routePath] || 0
    },

    setContainer(element: HTMLElement) {
      this.container = element
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
      this.saveStateToLocalStorage()
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
      this.saveStateToLocalStorage()
    },

    scrollHandler() {
      if (this.container) {
        const isScrolledToBottom =
          this.container.scrollHeight - this.container.scrollTop === this.container.clientHeight

        if (isScrolledToBottom) {
          this.loadMoreArtworks()
        }
      }
    },

    shouldPerformSearch() {
      return (
        this.selectedMaterial !== null ||
        this.selectedTechnique !== null ||
        this.selectedType !== null ||
        (this.searchQuery.trim() !== '' &&
          (this.searchQuery.trim() !== this.lastSearchQuery ||
            this.selectedMaterial !== this.lastSelectedMaterial ||
            this.selectedTechnique !== this.lastSelectedTechnique ||
            this.selectedType !== this.lastSelectedType))
      )
    },

    updateLastSearchFields() {
      this.lastSearchQuery = this.searchQuery
      this.lastSelectedMaterial = this.selectedMaterial
      this.lastSelectedTechnique = this.selectedTechnique
      this.lastSelectedType = this.selectedType
    },

    saveStateToLocalStorage() {
      const stateToStore = {
        artworks: this.artworks,
        searchQuery: this.searchQuery,
        selectedMaterial: this.selectedMaterial,
        selectedTechnique: this.selectedTechnique,
        selectedType: this.selectedType,
        reachedEnd: this.reachedEnd,
        lastSearchQuery: this.lastSearchQuery,
        lastSelectedMaterial: this.lastSelectedMaterial,
        lastSelectedTechnique: this.lastSelectedTechnique,
        lastSelectedType: this.lastSelectedType
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore))
    }
  }
})
