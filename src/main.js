import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
import './assets/icon/font_2171488_33r86ja887p/iconfont.css'
import axios from 'axios'
// 设置axios请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
Vue.use(ElementUI);

Vue.config.productionTip = false
Vue.use(axios)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
