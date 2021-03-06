/*
 * @Author: 张闯
 * @Date: 2021-03-11 14:37:12
 * @LastEditors: 张闯
 * @LastEditTime: 2021-03-27 13:25:10
 * @Description:
 * @FilePath: \src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import treeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component("tree-table", treeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
