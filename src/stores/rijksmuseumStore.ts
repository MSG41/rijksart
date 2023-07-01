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
    loading: false,
    searchQuery: localStorage.getItem('searchQuery') || '',
    scrollPositions: {} as Record<string, number>
  }),

  actions: {
    resetPagination() {
      this.page = 1
      this.reachedEnd = false
    },

    updateSearchQuery(query: string) {
      this.searchQuery = query.trim()
    },

    async searchArtworks() {
      const query = this.searchQuery

      if (query === '') {
        this.artworks = {}
        return
      }

      try {
        this.loading = true
        const data = await RijksmuseumService.searchArtworks(query, this.page, this.pageSize)
        const newArtworks = {} as Record<string, ArtworkDetails>

        data.artObjects.forEach((artwork) => {
          if (artwork.hasImage && artwork.webImage.url && artwork.showImage) {
            newArtworks[artwork.objectNumber] = artwork
          }
        })

        this.artworks = { ...this.artworks, ...newArtworks }
        this.artworkCache = { ...this.artworkCache, ...newArtworks }
        this.page += 1
        if (data.artObjects.length < this.pageSize) {
          this.reachedEnd = true
        }
      } catch (error) {
        console.error(error)
        this.artworks = { ...this.artworkCache }
      } finally {
        this.loading = false
      }
    },

    async initializeStore() {
      if (this.searchQuery) {
        await this.searchArtworks()
      }
    },

    storeScrollPosition(routePath: string, scrollPosition: number) {
      this.scrollPositions[routePath] = scrollPosition
    },

    retrieveScrollPosition(routePath: string) {
      return this.scrollPositions[routePath] || 0
    }
  }
})
