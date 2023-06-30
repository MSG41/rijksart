import axios, { type AxiosResponse } from 'axios'
import { type RijksmuseumApiResponse, type ArtworkDetails } from '@/types/types'
import { VITE_APP_API_KEY, VITE_APP_API_URL } from '../../env'

export class RijksmuseumService {
  // Include pagination parameters: page and pageSize
  public static async searchArtworks(
    query: string,
    page: number,
    pageSize: number
  ): Promise<RijksmuseumApiResponse> {
    try {
      const response: AxiosResponse<RijksmuseumApiResponse> = await axios.get(
        `${VITE_APP_API_URL}`,
        {
          params: {
            key: VITE_APP_API_KEY,
            format: 'json',
            q: query,
            imgonly: true,
            p: page, // Page number
            ps: pageSize // Number of results per page
          }
        }
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  public static async fetchArtworkDetails(objectNumber: string): Promise<ArtworkDetails> {
    try {
      const response: AxiosResponse<ArtworkDetails> = await axios.get(
        `${VITE_APP_API_URL}/${objectNumber}`,
        {
          params: {
            key: VITE_APP_API_KEY,
            format: 'json'
          }
        }
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
