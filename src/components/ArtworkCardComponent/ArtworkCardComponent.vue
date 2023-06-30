<template>
  <router-link :to="`/artwork/${artwork.objectNumber}`" class="artwork-card">
    <h2>{{ artwork.title }}</h2>
    <div v-if="artwork.hasImage && artwork.webImage.url" class="image-container">
      <img class="artwork-image" :src="artwork.webImage.url" :alt="artwork.title" />
    </div>
    <p>{{ artwork.longTitle }}</p>
  </router-link>
</template>

<script lang="ts">
import { useRoute, RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue'
import { RijksmuseumService } from '@/services/RijksmuseumService'
import { type ArtworkDetails } from '@/types/types'

export default {
  components: {
    RouterLink
  },
  props: {
    artwork: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const route = useRoute()
    const artworkDetails = ref<ArtworkDetails | null>(null)
    const loading = ref(true)

    onMounted(async () => {
      const objectNumber = route.params.objectNumber.toString()
      if (objectNumber === props.artwork.objectNumber) {
        artworkDetails.value = await RijksmuseumService.fetchArtworkDetails(objectNumber)
        loading.value = false
      }
    })

    return {
      artworkDetails,
      loading
    }
  }
}
</script>

<style scoped>
.artwork-card {
  width: 100%;
  max-width: 300px; /* Add a max-width to limit card width on larger screens */
  border: 1px solid #ccc;
  margin: 10px auto; /* Center the card horizontally */
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;
}

.artwork-card:hover {
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
}

.image-container {
  max-height: 200px; /* Limit the height of the image container */
  overflow: hidden; /* Hide any overflowing image */
}

.artwork-image {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}
</style>
