import axios, { type AxiosInstance } from 'axios'
import { type RijksmuseumApiResponse, type ArtworkDetails } from '@/types/types'
import { VITE_APP_API_KEY, VITE_APP_API_URL } from '../../env'

export class RijksmuseumService {
  private static api: AxiosInstance

  static initialize(): void {
    RijksmuseumService.api = axios.create({
      baseURL: VITE_APP_API_URL,
      params: {
        key: VITE_APP_API_KEY,
        format: 'json'
      }
    })
  }

  public static async searchArtworks(
    query: string,
    material: string | null,
    technique: string | null,
    type: string | null,
    page: number,
    pageSize: number
  ): Promise<{ count: number; artObjects: ArtworkDetails[] }> {
    try {
      const params: Record<string, string | null> = {
        key: VITE_APP_API_KEY,
        format: 'json',
        q: query,
        imgonly: 'true',
        p: page.toString(),
        ps: pageSize.toString()
      }

      if (material) {
        params.material = material
      }

      if (technique) {
        params.technique = technique
      }

      if (type) {
        params.type = type
      }

      const response = await RijksmuseumService.api.get<RijksmuseumApiResponse>('/en/collection', {
        params
      })

      const { count, artObjects } = response.data

      return { count, artObjects }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  public static async fetchArtworkDetails(objectNumber: string): Promise<ArtworkDetails> {
    try {
      const response = await RijksmuseumService.api.get<ArtworkDetails>(
        `/en/collection/${objectNumber}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

// Initialize the service
RijksmuseumService.initialize()
