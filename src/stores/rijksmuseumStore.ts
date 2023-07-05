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
    selectedMaterial: null as string | null,
    selectedTechnique: null as string | null,
    selectedType: null as string | null,
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
    lastSelectedType: null as string | null
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
      this.loading = true
      const response = await RijksmuseumService.searchArtworks(
        this.searchQuery,
        this.selectedMaterial,
        this.selectedTechnique,
        this.selectedType,
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
      this.loading = true
      const page = Math.floor(this.artworks.length / 10) + 1
      const response = await RijksmuseumService.searchArtworks(
        this.searchQuery,
        this.selectedMaterial,
        this.selectedTechnique,
        this.selectedType,
        page,
        10 // Load 10 more results
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
      this.artworks = []
      this.reachedEnd = false
      this.loading = false
      this.scrollPositions = {}
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
        scrollPositions: this.scrollPositions
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore))
    }
  }
})
const capitalizeFirstLetter = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}
