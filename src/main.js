import Vue from 'vue'
import router from './router'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import './static/element-variables.scss'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8080/api'
Vue.prototype.$axios = axios 
Vue.config.productionTip = false
//设置默认大小和弹窗zIndex
Vue.use(ElementUI, { size: 'small', zIndex: 3000 });
new Vue({
  router,
  // ElementUI,
  render: h => h(App),
}).$mount('#app')
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>'
// })
