<template>
  <div class="about-page">
    <h1>About</h1>
    <div class="content">
      <p>
        Welcome to my Rijksmuseum Artwork Search Engine! I'm thrilled to share my journey of
        creating this application with you.
      </p>
      <p>
        As an art enthusiast, I wanted to build a platform where users can easily explore the vast
        collection of artworks from the Rijksmuseum. However, I encountered a challenge—the
        Rijksmuseum API didn't provide specific endpoints for techniques, materials, and types of
        artworks. But that didn't stop me!
      </p>
      <p>
        I devised a smart solution to overcome this limitation. By leveraging the available data and
        employing creative filtering techniques, I was able to implement a robust search
        functionality. Users can now search for artworks based on their preferred techniques,
        materials, and types, and discover the beauty of the Rijksmuseum collection in a more
        personalized way.
      </p>
      <p>
        The development process was focused on creating a scalable and maintainable project
        structure. I designed the application architecture with modularity in mind, allowing for
        easy extension and future improvements. This ensures that the search engine can grow
        alongside the ever-expanding Rijksmuseum collection.
      </p>
      <p>
        I'm delighted with the results so far, but I'm not stopping here! I'm committed to
        continuously enhancing this application, refining its features, and providing an exceptional
        user experience. I have exciting plans to incorporate additional functionality, such as
        advanced search options and curated art collections.
      </p>
      <p>
        Thank you for joining me on this journey through art and technology. I hope you enjoy using
        the Rijksmuseum Artwork Search Engine as much as I enjoyed creating it. Stay tuned for more
        updates and new features!
      </p>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  margin: 80px 2rem;
  text-align: center;
}

h1 {
  font-size: 36px;
  margin-bottom: 30px;
}

.content {
  font-size: 18px;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background-color: #ffffff;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.content p {
  margin-bottom: 20px;
}
</style>
