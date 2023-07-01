export interface WebImage {
  guid: string
  offsetPercentageX: number
  offsetPercentageY: number
  width: number
  height: number
  url: string
}

export interface ArtObject {
  id: string
  priref: string
  language: string
  title: string
  webImage: WebImage
  colors: string[]
  colorsWithNormalization: string[]
  normalizedColors: string[]
  normalized32Colors: string[]
  materialsThesaurus: string[]
  techniquesThesaurus: string[]
  productionPlacesThesaurus: string[]
  titles: string[]
  description: string | null
  labelText: string | null
  objectTypes: string[]
  objectCollection: string[]
  makers: Maker[]
  principalMakers: Maker[]
  plaqueDescriptionDutch: string | null
  plaqueDescriptionEnglish: string | null
  principalMaker: string
  artistRole: string | null
  associations: string[]
  acquisition: Acquisition
  exhibitions: string[]
  materials: string[]
  techniques: string[]
  productionPlaces: string[]
  dating: Dating
  classification: Classification
  hasImage: boolean
  historicalPersons: string[]
  inscriptions: string[]
  documentation: string[]
  catRefRPK: string[]
  principalOrFirstMaker: string
  dimensions: Dimension[]
  physicalProperties: string[]
  physicalMedium: string
  longTitle: string
  subTitle: string
  scLabelLine: string
  label: Label
  showImage: boolean
  location: string | null
}

export interface Maker {
  name: string
  unFixedName: string
  placeOfBirth: string | null
  dateOfBirth: string | null
  dateOfBirthPrecision: string | null
  dateOfDeath: string | null
  dateOfDeathPrecision: string | null
  placeOfDeath: string | null
  occupation: string[]
  roles: string[]
  nationality: string | null
  biography: string | null
  productionPlaces: string[]
  qualification: string
  labelDesc: string
}

export interface Acquisition {
  method: string
  date: string
  creditLine: string | null
}

export interface Dating {
  presentingDate: string
  sortingDate: number
  period: number
  yearEarly: number
  yearLate: number
}

export interface Classification {
  iconClassIdentifier: string[]
  iconClassDescription: string[]
  motifs: string[]
  events: string[]
  periods: string[]
  places: string[]
  people: string[]
  objectNumbers: string[]
}

export interface Dimension {
  unit: string
  type: string
  precision: string | null
  part: string
  value: string
}

export interface Label {
  title: string | null
  makerLine: string | null
  description: string | null
  notes: string | null
  date: string | null
}

export interface RijksmuseumApiResponse {
  elapsedMilliseconds: number
  count: number
  artObjects: ArtworkDetails[]
}

export interface ArtworkDetails {
  id: string
  objectNumber: string
  title: string
  hasImage: boolean
  showImage: boolean
  webImage: WebImage
  longTitle: string
  principalOrFirstMaker: string
  materials: string[]
  techniques: string[]
  artObject: ArtObject
}

export interface Suggestion {
  title: string
  artist: string
}
