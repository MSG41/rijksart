import axios from 'axios'
import { type RijksmuseumApiResponse, type ArtworkDetails } from '@/types/types'
import { VITE_APP_API_KEY, VITE_APP_API_URL } from '../../env'

export class RijksmuseumService {
  public static async searchArtworks(
    query: string,
    page: number,
    pageSize: number
  ): Promise<RijksmuseumApiResponse> {
    try {
      const response = await axios.get<RijksmuseumApiResponse>(
        `${VITE_APP_API_URL}/en/collection`,
        {
          params: {
            key: VITE_APP_API_KEY,
            format: 'json',
            q: query,
            imgonly: true,
            p: page,
            ps: pageSize
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
      const response = await axios.get<ArtworkDetails>(
        `${VITE_APP_API_URL}/en/collection/${objectNumber}`,
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

  public static async getAllFacets(facetName: string): Promise<any[]> {
    try {
      const response = await axios.get(`${VITE_APP_API_URL}/en/collection`, {
        params: {
          key: VITE_APP_API_KEY,
          imgonly: true,
          ps: 0,
          facets: facetName,
          'facet[field]': facetName
        }
      })

      const facetIndex = response.data.facets.findIndex((facet: any) => facet.name === facetName)

      if (facetIndex === -1) {
        console.warn(`Facet "${facetName}" not found in the response`)
        return []
      }

      const facetArray = response.data.facets[facetIndex].facets

      const facets = facetArray
        .slice(0, 1000) // Limit to 1000 facets or adjust as needed
        .map((item: { key: string }) => ({
          value: item.key
        }))

      console.log(`Fetched ${facetName}:`, facets)
      return facets
    } catch (error: any) {
      console.error(`Error fetching ${facetName}: ${error}`)
      throw error
    }
  }

  public static async fetchAllFacets(): Promise<void> {
    try {
      const facetNames = ['material', 'type', 'technique']

      for (const facetName of facetNames) {
        const facets = await this.getAllFacets(facetName)
        this.downloadFacetsJson(facetName, facets)
      }
    } catch (error) {
      console.error('Error fetching facets:', error)
      throw error
    }
  }

  private static downloadFacetsJson(facetName: string, data: any[]): void {
    const jsonData = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${facetName}.json`
    link.setAttribute('style', 'display: none')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
