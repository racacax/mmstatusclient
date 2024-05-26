import './assets/main.scss'

import { createApp } from 'vue'
import Highcharts from 'highcharts'
import Maps from 'highcharts/modules/map'
import HighchartsVue from 'highcharts-vue'
import App from './App.vue'
import router from './router'
import Stock from 'highcharts/modules/stock'
//import HighchartsBoost from "highcharts/modules/boost"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as bootstrap from 'bootstrap'
Maps(Highcharts)
Stock(Highcharts)
// HighchartsBoost(Highcharts)
const app = createApp(App)
app.use(HighchartsVue)

app.use(router)

app.mount('#app')
