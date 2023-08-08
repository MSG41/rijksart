import axios, { type AxiosInstance } from 'axios'
import {
  type RijksmuseumApiResponse,
  type ArtworkDetails,
  type FacetsResponse
} from '@/types/types'
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
  ): Promise<{ count: number; artObjects: ArtworkDetails[]; facets?: FacetsResponse }> {
    const params: Record<string, string | null> = {
      q: query,
      imgonly: 'true',
      p: page.toString(),
      ps: pageSize.toString(),
      material,
      technique,
      type
    }

    const response = await RijksmuseumService.api.get<RijksmuseumApiResponse>('/en/collection', {
      params
    })

    const { count, artObjects, facets } = response.data

    return { count, artObjects, facets }
  }

  public static async fetchArtworkDetails(objectNumber: string): Promise<ArtworkDetails> {
    const response = await RijksmuseumService.api.get<ArtworkDetails>(
      `/en/collection/${objectNumber}`
    )
    return response.data
  }
}

RijksmuseumService.initialize()
