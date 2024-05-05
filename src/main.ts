import './assets/main.css'

import { createApp } from 'vue'
import Highcharts from 'highcharts'
import Maps from 'highcharts/modules/map'
import HighchartsVue from 'highcharts-vue'
import App from './App.vue'
import router from './router'
import Stock from 'highcharts/modules/stock'
Maps(Highcharts)
Stock(Highcharts)
const app = createApp(App)
app.use(HighchartsVue)

app.use(router)

app.mount('#app')
