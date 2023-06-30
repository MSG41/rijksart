// types.ts
export interface WebImage {
  guid: string
  offsetPercentageX: number
  offsetPercentageY: number
  width: number
  height: number
  url: string
}

export interface Artwork {
  id: string
  objectNumber: string
  title: string
  hasImage: boolean
  showImage: boolean
  webImage: WebImage
  longTitle: string
}

export interface RijksmuseumApiResponse {
  elapsedMilliseconds: number
  count: number
  artObjects: Artwork[]
}

export interface ArtworkDetails {
  id: string
  objectNumber: string
  title: string
  hasImage: boolean
  showImage: boolean
  webImage: WebImage
  longTitle: string
  principalMaker: string
  materials: string[]
  techniques: string[]
}
