<template>
  <div class="artwork">
    <h2>{{ artwork.title }}</h2>
    <p>Artist: {{ artwork.artist }}</p>
    <p>Year: {{ artwork.year }}</p>
    <p>Medium: {{ artwork.medium }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

interface Artwork {
  title: string
  artist: string
  year: number
  medium: string
}

export default defineComponent({
  props: {
    artwork: {
      type: Object as PropType<Artwork>,
      required: true
    }
  }
})
</script>

<style scoped>
.artwork {
  border: 1px solid black;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>
