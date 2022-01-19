import Vue from 'vue'
import App from './App.vue'

import '@/styles/index.scss'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import '@geoman-io/leaflet-geoman-free';  
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'; 
import 'leaflet-plot'
import 'leaflet-plot/dist/leaflet-plot.css'

new Vue({
  render: h => h(App)
}).$mount('#app')