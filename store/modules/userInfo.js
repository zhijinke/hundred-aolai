export default{
	state:{
		// 登录状态
		loginStatus:false,
		// token
		token:null,
		// 用户信息（头像，名称...）
		userInfo:{}
	},
	getters:{
		
	},
	mutations:{
		// 读取本地用户信息
		initUser(state){
			let userInfo = uni.getStorageSync('userInfo')
			if(userInfo){
				userInfo = JSON.parse(userInfo)
				state.userInfo = userInfo
				state.loginStatus = true
				state.token = userInfo.token
			}
		},
		// 存储用户信息
		setUserInfo(state,userInfo){
			state.userInfo = userInfo
			state.loginStatus = true
			state.token = userInfo.token
			// 本地存储  对象转换为字符串
			uni.setStorageSync('userInfo',JSON.stringify(userInfo))
		},
		// 退出登录
		loginOut(state){
			state.loginStatus = false
			state.token = null
			state.userInfo = {}
			// 删除本地存储
			uni.removeStorageSync('userInfo')
		}
	},
	actions:{
		
	}
}