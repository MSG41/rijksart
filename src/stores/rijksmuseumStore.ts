import { defineStore } from 'pinia'
import { type ArtworkDetails } from '@/types/types'
import { RijksmuseumService } from '@/services/RijksmuseumService'
import materials from '@/data/material.json'
import techniques from '@/data/technique.json'
import types from '@/data/type.json'

const STORAGE_KEY = 'rijksmuseum_store'

export const useRijksmuseumStore = defineStore('rijksmuseum', {
  state: () => ({
    artworks: [] as ArtworkDetails[],
    searchQuery: '',
    selectedMaterial: null as { value: string } | null,
    selectedTechnique: null as { value: string } | null,
    selectedType: null as { value: string } | null,
    materials: materials
      .map((material) => ({
        label: capitalizeFirstLetter(material.value),
        value: material.value
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    techniques: techniques
      .map((technique) => ({
        label: capitalizeFirstLetter(technique.value),
        value: technique.value
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    types: types
      .map((type) => ({
        label: capitalizeFirstLetter(type.value),
        value: type.value
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    loading: false,
    scrollPositions: {} as Record<string, number>,
    reachedEnd: false,
    lastSearchQuery: '',
    lastSelectedMaterial: null as string | null,
    lastSelectedTechnique: null as string | null,
    lastSelectedType: null as string | null,
    page: 1
  }),

  actions: {
    initialize() {
      const storedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      Object.assign(this, storedState)
    },

    retrieveScrollPosition(objectNumber: string): number {
      return this.scrollPositions[objectNumber] || 0
    },

    storeScrollPosition(objectNumber: string, position: number) {
      this.scrollPositions[objectNumber] = position
    },

    async searchArtworks() {
      if (!this.shouldPerformSearch()) return

      // Check if the artworks are already available in localStorage
      const storedArtworks = JSON.parse(localStorage.getItem('artworks') || '[]')
      if (storedArtworks.length > 0) {
        this.artworks = storedArtworks
        this.loading = false
        this.reachedEnd = false
        this.saveStateToLocalStorage()
        return
      }

      this.loading = true

      const typeValue = this.selectedType?.value || null
      const materialValue = this.selectedMaterial?.value || null
      const techniqueValue = this.selectedTechnique?.value || null

      const response = await RijksmuseumService.searchArtworks(
        this.searchQuery,
        materialValue,
        techniqueValue,
        typeValue,
        1,
        10 // Limit to 10 results
      )

      this.artworks = response.artObjects
      this.loading = false
      this.reachedEnd = false
      this.saveStateToLocalStorage()
    },

    async loadMoreArtworks() {
      if (!this.shouldPerformSearch() || this.loading || this.reachedEnd) return

      const container = document.documentElement
      const containerHeight = container.clientHeight
      const contentHeight = container.scrollHeight
      const scrollPosition = container.scrollTop

      // Calculate the remaining content height
      const remainingContentHeight = contentHeight - (scrollPosition + containerHeight)

      // Check if the remaining content height is less than or equal to 10% of the container height
      if (remainingContentHeight <= containerHeight * 0.1) {
        this.loading = true
        const startIndex = this.artworks.length // Store the current number of artworks
        this.page = Math.floor(startIndex / 10) + 1 // Calculate the current page based on the startIndex
        const response = await RijksmuseumService.searchArtworks(
          this.searchQuery,
          this.selectedMaterial?.value || null,
          this.selectedTechnique?.value || null,
          this.selectedType?.value || null,
          this.page,
          10
        )
        const newArtworks = response.artObjects
        this.artworks.push(...newArtworks)

        // Update scroll positions for new artworks
        newArtworks.forEach((artwork, index) => {
          if (!this.scrollPositions[artwork.objectNumber]) {
            this.scrollPositions[artwork.objectNumber] = 0
          }
          this.scrollPositions[artwork.objectNumber] += startIndex + index // Adjust the scroll position based on the startIndex
        })

        this.loading = false
        this.reachedEnd = response.artObjects.length === 0
        this.saveStateToLocalStorage()
      }
    },

    resetFilters() {
      this.searchQuery = ''
      this.selectedMaterial = null
      this.selectedTechnique = null
      this.selectedType = null
      this.artworks = []
      this.reachedEnd = false
      this.loading = false
      this.scrollPositions = {}
      this.page = 1
      this.saveStateToLocalStorage()
      this.searchArtworks()
    },

    shouldPerformSearch() {
      const conditions = [
        this.searchQuery.trim() !== '',
        this.selectedMaterial !== null,
        this.selectedTechnique !== null,
        this.selectedType !== null,
        this.searchQuery.trim() !== this.lastSearchQuery,
        this.selectedMaterial !== this.lastSelectedMaterial,
        this.selectedTechnique !== this.lastSelectedTechnique,
        this.selectedType !== this.lastSelectedType
      ]
      return conditions.some((condition) => condition === true)
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
        lastSelectedType: this.lastSelectedType,
        scrollPositions: this.scrollPositions,
        page: this.page
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore))
      localStorage.setItem('artworks', JSON.stringify(this.artworks)) // Store the fetched artworks in localStorage
    }
  }
})

const capitalizeFirstLetter = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}
