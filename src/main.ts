import './assets/main.css'
import 'primeicons/primeicons.css'
import Aura from '@primevue/themes/aura'
import 'primeflex/primeflex.css'

import { initializeApp } from 'firebase/app'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ProgressSpinner from 'primevue/progressspinner'

import App from './App.vue'
import router from './router'

const firebaseConfig = {
  apiKey: 'AIzaSyBnij74Uti-cTh4ftd4xodqJfgFriPYUY8',
  authDomain: 'applist-4134d.firebaseapp.com',
  projectId: 'applist-4134d',
  storageBucket: 'applist-4134d.firebasestorage.app',
  messagingSenderId: '14841724841',
  appId: '1:14841724841:web:c94a7c8719ea99b710ceb8',
}
initializeApp(firebaseConfig)

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(ToastService)

app.component('app-menubar', Menubar)
app.component('app-button', Button)
app.component('app-input-text', InputText)
app.component('app-toast', Toast)
app.component('app-progress', ProgressSpinner)

app.mount('#app')
