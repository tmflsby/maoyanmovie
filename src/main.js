import Vue from 'vue'
import App from './App.vue'
import router from './routers'
import store from './stores'
import axios from 'axios'
import Scroller from '@/components/Scroller'
import Loading from '@/components/Loading'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

Vue.use(VueAwesomeSwiper)

// axios.defaults.baseURL = 'http://39.97.33.178'
Vue.prototype.axios = axios

Vue.filter('setWH', (url, arg) => {
  return url.replace(/w\.h/, arg)
})

Vue.component('Scroller', Scroller)

Vue.component('Loading', Loading)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
