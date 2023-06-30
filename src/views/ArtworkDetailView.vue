<template>
  <div v-if="loading">Loading...</div>
  <div v-else class="artwork-detail">
    <button @click="goBack" class="back-button">Go Back</button>

    <img
      v-if="artworkDetails && artworkDetails.artObject.webImage"
      class="artwork-detail__image"
      :src="artworkDetails.artObject.webImage.url"
      :alt="artworkDetails.artObject.title"
    />
    <h2 v-if="artworkDetails" class="artwork-detail__description">
      {{ artworkDetails.artObject.longTitle }}
    </h2>

    <!-- Additional details -->
    <div v-if="artworkDetails" class="artwork-detail__additional">
      <div v-if="artworkDetails.artObject.principalMaker" class="artwork-detail__info">
        <span class="artwork-detail__info-label">Principal Maker:</span>
        {{ artworkDetails.artObject.principalMaker }}
      </div>
      <div v-if="artworkDetails.artObject.dating?.presentingDate" class="artwork-detail__info">
        <span class="artwork-detail__info-label">Dating:</span>
        {{ artworkDetails.artObject.dating.presentingDate }}
      </div>
      <div v-if="artworkDetails.artObject.techniques.length" class="artwork-detail__info">
        <span class="artwork-detail__info-label">Techniques:</span>
        {{ artworkDetails.artObject.techniques.join(', ') }}
      </div>
      <div v-if="artworkDetails.artObject.materials.length" class="artwork-detail__info">
        <span class="artwork-detail__info-label">Materials:</span>
        {{ artworkDetails.artObject.materials.join(', ') }}
      </div>

      <div v-if="artworkDetails.artObject.dimensions.length" class="artwork-detail__info">
        <span class="artwork-detail__info-label">Dimensions:</span>
        <div v-for="dimension in artworkDetails.artObject.dimensions" :key="dimension.type">
          <span>{{ dimension.type }}:</span>
          <span>{{ dimension.value }} {{ dimension.unit }}</span>
          <span>({{ dimension.part }})</span>
        </div>
      </div>
      <div v-if="artworkDetails.artObject.objectCollection.length" class="artwork-detail__info">
        <span class="artwork-detail__info-label">Object Collection:</span>
        {{ artworkDetails.artObject.objectCollection.join(', ') }}
      </div>
      <div v-if="artworkDetails.artObject.objectTypes.length" class="artwork-detail__info">
        <span class="artwork-detail__info-label">Object Types:</span>
        {{ artworkDetails.artObject.objectTypes.join(', ') }}
      </div>
      <div v-if="artworkDetails.artObject.makers.length" class="artwork-detail__info">
        <span class="artwork-detail__info-label">Makers:</span>
        <div v-for="maker in artworkDetails.artObject.makers" :key="maker.name">
          <span>{{ maker.name }}</span>
          <span>({{ maker.occupation.join(', ') }})</span>
        </div>
      </div>
      <div v-if="artworkDetails.artObject.acquisition.method" class="artwork-detail__info">
        <span class="artwork-detail__info-label">Acquisition Method:</span>
        {{ artworkDetails.artObject.acquisition.method }}
      </div>
      <div
        v-if="artworkDetails.artObject.classification.iconClassIdentifier.length"
        class="artwork-detail__info"
      >
        <span class="artwork-detail__info-label">Icon Class Identifier:</span>
        {{ artworkDetails.artObject.classification.iconClassIdentifier.join(', ') }}
      </div>
      <div
        v-if="artworkDetails.artObject.classification.iconClassDescription.length"
        class="artwork-detail__info"
      >
        <span class="artwork-detail__info-label">Icon Class Description:</span>
        {{ artworkDetails.artObject.classification.iconClassDescription.join(', ') }}
      </div>
      <!-- Add more information here -->
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRijksmuseumStore } from '@/stores/rijksmuseumStore'
import { RijksmuseumService } from '@/services/RijksmuseumService'
import { type ArtworkDetails } from '@/types/types'

export default {
  setup() {
    const route = useRoute()
    const artworkDetails = ref<ArtworkDetails | null>(null)
    const loading = ref(true)
    const router = useRouter()
    const store = useRijksmuseumStore()

    onMounted(async () => {
      const objectNumber = route.params.objectNumber
      if (typeof objectNumber === 'string') {
        artworkDetails.value = await RijksmuseumService.fetchArtworkDetails(objectNumber)
        loading.value = false
      }
    })
    const goBack = () => {
      router.push({ name: 'home', query: { q: store.searchQuery } })
    }
    return {
      artworkDetails,
      loading,
      goBack
    }
  }
}
</script>

<style scoped>
.artwork-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  max-width: 800px;
  margin: 79px auto;
}

.artwork-detail__image {
  /* margin-top: 70px; */
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
}

.artwork-detail__description {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin: 20px auto;
}

.artwork-detail__additional {
  width: 100%;
}

.artwork-detail__info {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
}

.artwork-detail__info-label {
  font-weight: bold;
  margin-right: 8px;
}

.artwork-detail__info > div {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-right: 20px;
}

.back-button {
  background-color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 20px;
  align-self: flex-start;
}

.back-button:hover {
  background-color: #f5f5f5;
}

@media (max-width: 480px) {
  .artwork-detail__image {
    margin-top: 40px;
  }
}
</style>
