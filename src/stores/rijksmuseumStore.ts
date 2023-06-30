import { defineStore } from 'pinia'
import { RijksmuseumService } from '../services/RijksmuseumService'
import { type ArtworkDetails } from '@/types/types'

export const useRijksmuseumStore = defineStore({
  id: 'rijksmuseum',

  state: () => ({
    artworks: {} as Record<string, ArtworkDetails>, // Add index signature
    loading: false,
    searchQuery: localStorage.getItem('searchQuery') || ''
  }),

  actions: {
    async searchArtworks(query: string) {
      this.loading = true
      this.artworks = {} // Clear previous artworks
      try {
        const data = await RijksmuseumService.searchArtworks(query)
        data.artObjects.forEach((artwork) => {
          if (artwork.hasImage && artwork.webImage.url && artwork.showImage) {
            this.artworks[artwork.objectNumber] = artwork // Store artwork using `objectNumber` as key
          }
        })
        localStorage.setItem('searchQuery', query) // Persist the search query
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async initializeStore() {
      if (this.searchQuery) {
        await this.searchArtworks(this.searchQuery)
      }
    }
  }
})
