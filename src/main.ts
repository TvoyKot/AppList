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
import Textarea from 'primevue/textarea'
import RadioButton from 'primevue/radiobutton';
import confirmationService from 'primevue/confirmationservice'
import ConfirmDialog from 'primevue/confirmdialog'
import ProgressSpinner from 'primevue/progressspinner'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import DatePicker from 'primevue/datepicker'
import Column from 'primevue/column'
import InlineMessage from 'primevue/inlinemessage'
import InputNumber from 'primevue/inputnumber'

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
app.use(ToastService)
app.use(confirmationService)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

app.component('app-menubar', Menubar)
app.component('app-button', Button)
app.component('app-input-text', InputText)
app.component('app-toast', Toast)
app.component('app-progress', ProgressSpinner)
app.component('app-card', Card)
app.component('app-data-table', DataTable)
app.component('app-column', Column)
app.component('app-dialog', ConfirmDialog)
app.component('app-message', InlineMessage)
app.component('app-input-number', InputNumber)
app.component('app-textarea', Textarea)
app.component('app-datepicker', DatePicker)
app.component('app-radio', RadioButton)

app.mount('#app')
