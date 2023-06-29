import apiService from './apiService'

export default {
  fetchArtworks(
    principalMaker: string,
    datingPeriod: number,
    technique: string,
    productionPlace: string,
    material: string
  ) {
    return apiService.get('/', {
      principalMaker: principalMaker,
      datingPeriod: datingPeriod,
      technique: technique,
      productionPlaces: productionPlace,
      material: material
    })
  },

  fetchRandomArtwork() {
    const randomPage = Math.floor(Math.random() * 1000)
    return apiService.get('/', { p: randomPage, ps: 1 })
  },

  fetchArtworkDetails(objectNumber: string) {
    return apiService.get(`/${objectNumber}`, {})
  }
}
