import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)


// 购物车模块
import cart from './modules/cart.js'
// 地址管理
import address from './modules/address.js'
// 用户信息
import userInfo from './modules/userInfo'
// 订单页管理
import order from './modules/order'
export default new Vuex.Store({
	modules:{
		cart,
		address,
		userInfo,
		order
	}
})