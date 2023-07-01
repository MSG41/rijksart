import { defineStore } from 'pinia'
import { RijksmuseumService } from '../services/RijksmuseumService'
import { type ArtworkDetails } from '@/types/types'

export const useRijksmuseumStore = defineStore({
  id: 'rijksmuseum',

  state: () => ({
    artworks: {} as Record<string, ArtworkDetails>,
    artworkCache: {} as Record<string, ArtworkDetails>,
    page: 1,
    pageSize: 10,
    reachedEnd: false,
    loading: false, // Add this line
    searchQuery: localStorage.getItem('searchQuery') || ''
  }),

  actions: {
    resetPagination() {
      this.page = 1
      this.reachedEnd = false
    },

    async searchArtworks(query: string) {
      this.loading = true // Add this line

      if (query.trim() === '') {
        this.artworks = {}
        this.loading = false // And this line
        return
      }

      try {
        const data = await RijksmuseumService.searchArtworks(query, this.page, this.pageSize)
        const newArtworks = {} as Record<string, ArtworkDetails>

        data.artObjects.forEach((artwork) => {
          if (artwork.hasImage && artwork.webImage.url && artwork.showImage) {
            newArtworks[artwork.objectNumber] = artwork
          }
        })

        this.artworks = { ...this.artworks, ...newArtworks }
        this.artworkCache = newArtworks
        localStorage.setItem('searchQuery', query)
        this.page += 1
        if (data.artObjects.length < this.pageSize) {
          this.reachedEnd = true
        }
      } catch (error) {
        console.error(error)
        this.artworks = { ...this.artworkCache }
      } finally {
        this.loading = false // And finally this line
      }
    },

    async initializeStore() {
      if (this.searchQuery) {
        await this.searchArtworks(this.searchQuery)
      }
    }
  }
})
