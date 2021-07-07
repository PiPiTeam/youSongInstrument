import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueSweetalert2 from 'vue-sweetalert2'
Vue.use(VueSweetalert2)
import 'sweetalert2/dist/sweetalert2.min.css'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import '@/icons' // icon
import '@/permission' // permission control
import permission from '@/directive/permission'
import md5 from 'js-md5'
Vue.prototype.$md5 = md5
Vue.use(permission)

if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
Vue.use(ElementUI)
Vue.use(VXETable)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
