import Vue from 'vue'
import App from './App.vue'

import '@/styles/index.scss'

import errorHandle from '@/utils/error-handle'
Vue.use(errorHandle)

new Vue({
  render: h => h(App)
}).$mount('#app')