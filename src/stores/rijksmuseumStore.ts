import { defineStore } from 'pinia'
import { type ArtworkDetails } from '@/types/types'
import { RijksmuseumService } from '@/services/RijksmuseumService'
import materials from '@/data/material.json'
import techniques from '@/data/technique.json'
import types from '@/data/type.json'

const CACHE_SIZE = 100

export const useRijksmuseumStore = defineStore('rijksmuseum', {
  state: () => ({
    artworks: [] as ArtworkDetails[],
    selectedArtwork: null as ArtworkDetails | null,
    searchQuery: '',
    selectedMaterial: null as { value: string } | null,
    selectedTechnique: null as { value: string } | null,
    selectedType: null as { value: string } | null,
    materials: sortData(materials),
    techniques: sortData(techniques),
    types: sortData(types),
    loading: false,
    scrollPositions: {} as Record<string, number>,
    reachedEnd: false,
    page: 1,
    cache: new Map<string, ArtworkDetails[]>(),
    availableMaterials: sortData(materials),
    availableTechniques: sortData(techniques),
    availableTypes: sortData(types)
  }),
  actions: {
    setSelectedArtwork(artwork: ArtworkDetails) {
      this.selectedArtwork = artwork
    },
    getSelectedArtwork(): ArtworkDetails | null {
      return this.selectedArtwork
    },
    async initialize() {
      this.artworks = []
    },
    retrieveScrollPosition(objectNumber: string): number {
      return this.scrollPositions[objectNumber] || 0
    },
    storeScrollPosition(objectNumber: string, position: number) {
      this.scrollPositions[objectNumber] = position
    },

    async updateAvailableOptions() {
      const response = await RijksmuseumService.searchArtworks(
        this.searchQuery,
        this.selectedMaterial?.value ?? null,
        this.selectedTechnique?.value ?? null,
        this.selectedType?.value ?? null,
        this.page,
        1 // Set the page size to 1 to get facets
      )

      if (response.facets) {
        const materialFacet = response.facets.find((facet) => facet.name === 'material')
        const techniqueFacet = response.facets.find((facet) => facet.name === 'technique')
        const typeFacet = response.facets.find((facet) => facet.name === 'type')

        if (materialFacet && materialFacet.facets) {
          this.availableMaterials = sortData(
            materialFacet.facets.map((option) => ({
              label: capitalizeFirstLetter(option.key),
              value: option.key
            }))
          )
        } else {
          this.availableMaterials = sortData(this.materials)
        }

        if (techniqueFacet && techniqueFacet.facets) {
          this.availableTechniques = sortData(
            techniqueFacet.facets.map((option) => ({
              label: capitalizeFirstLetter(option.key),
              value: option.key
            }))
          )
        } else {
          this.availableTechniques = sortData(this.techniques)
        }

        if (typeFacet && typeFacet.facets) {
          this.availableTypes = sortData(
            typeFacet.facets.map((option) => ({
              label: capitalizeFirstLetter(option.key),
              value: option.key
            }))
          )
        } else {
          this.availableTypes = sortData(this.types)
        }
      }
    },

    async searchArtworks() {
      this.loading = true
      this.reachedEnd = false
      try {
        const response = await RijksmuseumService.searchArtworks(
          this.searchQuery,
          this.selectedMaterial?.value ?? null,
          this.selectedTechnique?.value ?? null,
          this.selectedType?.value ?? null,
          this.page,
          10
        )

        // Update available options based on the response and selected material
        this.updateAvailableOptions()

        this.artworks = response.artObjects.slice(0, 10)
        const cacheKey = this.getCacheKey()
        this.cache.set(cacheKey, this.artworks)
        if (this.cache.size > CACHE_SIZE) {
          this.cache.delete(this.cache.keys().next().value)
        }
        this.page = 1
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async loadMoreArtworks() {
      if (this.loading || this.reachedEnd) return
      this.loading = true
      this.page += 1
      const response = await RijksmuseumService.searchArtworks(
        this.searchQuery,
        this.selectedMaterial?.value ?? null,
        this.selectedTechnique?.value ?? null,
        this.selectedType?.value ?? null,
        this.page,
        10
      )
      this.artworks.push(...response.artObjects)
      this.loading = false
      this.reachedEnd = response.artObjects.length === 0
    },
    shouldPerformSearch() {
      return (
        !!this.searchQuery ||
        !!this.selectedMaterial ||
        !!this.selectedTechnique ||
        !!this.selectedType
      )
    },

    resetFilters() {
      this.artworks = []
      this.searchQuery = ''
      this.selectedMaterial = null
      this.selectedTechnique = null
      this.selectedType = null
      this.page = 1
      this.loading = false
      this.selectedArtwork = null
      this.reachedEnd = false
    },

    getCacheKey() {
      return `${this.searchQuery}-${this.selectedMaterial?.value}-${this.selectedTechnique?.value}-${this.selectedType?.value}`
    }
  }
})

function capitalizeFirstLetter(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

function sortData(data: any) {
  return data
    .map((item: any) => ({
      label: capitalizeFirstLetter(item.value),
      value: item.value
    }))
    .sort((a: any, b: any) => a.label.localeCompare(b.label))
}
