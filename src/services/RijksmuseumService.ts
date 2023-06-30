// RijksmuseumService.ts
import axios, { type AxiosResponse } from 'axios'
import { type RijksmuseumApiResponse, type ArtworkDetails } from '@/types/types'

const API_ENDPOINT = import.meta.env.VITE_APP_API_URL
const API_KEY = import.meta.env.VITE_APP_API_KEY

export class RijksmuseumService {
  public static async searchArtworks(query: string): Promise<RijksmuseumApiResponse> {
    try {
      const response: AxiosResponse<RijksmuseumApiResponse> = await axios.get(`${API_ENDPOINT}`, {
        params: {
          key: API_KEY,
          format: 'json',
          q: query,
          imgonly: true
        }
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  public static async fetchArtworkDetails(objectNumber: string): Promise<ArtworkDetails> {
    try {
      const response: AxiosResponse<ArtworkDetails> = await axios.get(
        `${API_ENDPOINT}/${objectNumber}`,
        {
          params: {
            key: API_KEY,
            format: 'json'
          }
        }
      )
      console.log('resp: ', response.data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
