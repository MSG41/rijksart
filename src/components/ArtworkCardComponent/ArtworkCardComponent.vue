<template>
  <div class="artwork-card">
    <h2>{{ artwork.title }}</h2>
    <div v-if="artwork.hasImage && artwork.webImage.url">
      <img class="artwork-image" :src="artwork.webImage.url" :alt="artwork.title" />
    </div>
    <p>{{ artwork.ma }}</p>
    <p>{{ artwork.longTitle }}</p>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    artwork: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.artwork-card {
  width: 300px;
  border: 1px solid #ccc;
  margin: 10px;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;
}

.artwork-card:hover {
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
}

.artwork-image {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
}
</style>
