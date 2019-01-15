import Vue from 'vue'
import App from './App'
import '../static/css/reset.css'
import globalStore from "./stores/globalStore"

var Fly=require("flyio/dist/npm/wx")
var fly=new Fly
//添加拦截器
fly.interceptors.request.use((config,promise)=>{
  //给所有请求添加自定义header
  config.headers["sessionKey"] = globalStore.state.sessionKey;
  return config;
})
fly.config.baseURL='http://z8rj8y.natappfree.cc' //配置请求基地址
Vue.prototype.$http=fly  //将fly实例挂在vue上



Vue.config.productionTip = false //生产模式提示
App.mpType = 'app' //定义当前文件作为微信的app.js

const app = new Vue(App)
app.$mount()  //挂载到实例对象

// 使用vue prototype定义小程序的全局变量
Vue.prototype.miniApp = getApp()
Vue.prototype.globalData = getApp().globalData
//配置自定义组件
export default {
  
}