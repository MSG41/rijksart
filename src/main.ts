import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

// Set up the scroll behavior for the router
router.beforeEach((to, from, next) => {
  if (to.name === 'home' && from.name === 'detail') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  next()
})

app.mount('#app')
