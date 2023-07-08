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

      if (!storedState || Object.keys(storedState).length === 0) {
        this.artworks = []
        this.searchArtworks()
      }
    },

    retrieveScrollPosition(objectNumber: string): number {
      return this.scrollPositions[objectNumber] || 0
    },

    storeScrollPosition(objectNumber: string, position: number) {
      this.scrollPositions[objectNumber] = position
    },

    shouldPerformSearch() {
      return true
    },

    async searchArtworks() {
      // Only perform search if there's a change in filters or query
      if (
        this.searchQuery !== this.lastSearchQuery ||
        this.selectedMaterial?.value !== this.lastSelectedMaterial ||
        this.selectedTechnique?.value !== this.lastSelectedTechnique ||
        this.selectedType?.value !== this.lastSelectedType
      ) {
        this.loading = true
        const response = await RijksmuseumService.searchArtworks(
          this.searchQuery,
          this.selectedMaterial?.value || null,
          this.selectedTechnique?.value || null,
          this.selectedType?.value || null,
          1,
          10
        )

        this.artworks = response.artObjects
        this.lastSearchQuery = this.searchQuery
        this.lastSelectedMaterial = this.selectedMaterial?.value || null
        this.lastSelectedTechnique = this.selectedTechnique?.value || null
        this.lastSelectedType = this.selectedType?.value || null

        this.loading = false
        this.reachedEnd = false
        this.page = 1
        this.saveStateToLocalStorage()
      }
    },

    async loadMoreArtworks() {
      if (this.loading || this.reachedEnd) return

      this.loading = true
      this.page += 1
      const response = await RijksmuseumService.searchArtworks(
        this.lastSearchQuery,
        this.lastSelectedMaterial,
        this.lastSelectedTechnique,
        this.lastSelectedType,
        this.page,
        10
      )

      this.artworks.push(...response.artObjects)
      this.loading = false
      this.reachedEnd = response.artObjects.length === 0
      this.saveStateToLocalStorage()
    },

    resetFilters() {
      this.searchQuery = ''
      this.selectedMaterial = null
      this.selectedTechnique = null
      this.selectedType = null
      this.reachedEnd = false
      this.loading = false
      this.scrollPositions = {}
      this.page = 1
      this.artworks = [] // Clear the artworks array

      setTimeout(() => {
        if (this.shouldPerformSearch()) {
          this.searchArtworks()
        }
      }, 1000) // Adjust delay as needed
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
