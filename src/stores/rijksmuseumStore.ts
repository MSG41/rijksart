import { defineStore } from 'pinia'
import { RijksmuseumService } from '../services/RijksmuseumService'
import { type ArtworkDetails } from '@/types/types'

export const useRijksmuseumStore = defineStore({
  id: 'rijksmuseum',

  state: () => ({
    artworks: {} as Record<string, ArtworkDetails>, // Add index signature
    loading: false,
    page: 1, // Add page state
    pageSize: 10, // Add pageSize state
    reachedEnd: false, // Add reachedEnd state
    searchQuery: localStorage.getItem('searchQuery') || ''
  }),

  actions: {
    async searchArtworks(query: string) {
      this.loading = true
      try {
        const data = await RijksmuseumService.searchArtworks(query, this.page, this.pageSize)
        data.artObjects.forEach((artwork) => {
          if (artwork.hasImage && artwork.webImage.url && artwork.showImage) {
            this.artworks[artwork.objectNumber] = artwork // Store artwork using `objectNumber` as key
          }
        })
        localStorage.setItem('searchQuery', query) // Persist the search query
        // Increase page for the next loading
        this.page += 1
        // Check if we have less items than requested, means we've reached the end
        if (data.artObjects.length < this.pageSize) {
          this.reachedEnd = true
        }
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
