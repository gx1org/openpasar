import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import * as bootstrap from 'bootstrap'
window.bootstrap = bootstrap
import './assets/main.scss'

export const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
