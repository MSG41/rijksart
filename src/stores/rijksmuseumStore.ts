// rijksmuseumStore.ts
import { defineStore } from 'pinia'
import { RijksmuseumService } from '../services/RijksmuseumService'
import { type Artwork } from '@/types/types' // import the Artwork type

export const useRijksmuseumStore = defineStore({
  id: 'rijksmuseum',

  state: (): { artworks: Artwork[]; loading: boolean } => ({
    artworks: [],
    loading: false
  }),

  actions: {
    async searchArtworks(query: string) {
      this.loading = true
      this.artworks = []
      try {
        const data = await RijksmuseumService.searchArtworks(query)
        this.artworks = data.artObjects.filter(
          (artwork) => artwork.hasImage && artwork.webImage.url && artwork.showImage
        )
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
})
