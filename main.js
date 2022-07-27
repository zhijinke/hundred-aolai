import App from './App'
import store from './store' 
Vue.prototype.$store = store

// 判断是否登录
Vue.prototype.navigateTo = (options)=>{
	// 没有登录  拦截
	if(!store.state.userInfo.loginStatus){
			uni.showToast({
				title:'请先登录',
				icon:'none'
			})
			return uni.navigateTo({
				url:'/pages/login/login'
			})
	}else{
		uni.redirectTo(options)
	}
}




// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif