<template>
	<view class='login'>


		<swiper vertical='true' style="height: 100vh;">
			<swiper-item>
				<scroll-view>
					<view class='login-tel'>
						<view class='tel-main'>
							<view class='close' @tap="goBack">
								<image class='close-img' src="../../static/img/close.png" mode=""></image>
							</view>
							<view class='logo'>
								<image class='logo-img' src="../../static/img/logo.jpg" mode=""></image>
							</view>
							<view class='tel' @tap="goLoginTel">手机号注册</view>
							<LoginOther></LoginOther>
							<view class='login-go'>
								<view>已有账号，去登录</view>
								<image src="../../static/img/down.png" mode=""></image>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<scroll-view scroll-y="true" >
					<view class='login-tel'>
						<view class='tel-main'>
							<view class='close close-center'>
								<view @tap="goBack">
									<image class='close-img' src="../../static/img/close.png" mode=""></image>
								</view>
								<view class='login-go'>
									<image class='close-img' src="../../static/img/up.png" mode=""></image>
									<view>没有账号，去注册</view>
								</view>
								<view></view>
							</view>
							<view class='login-from'>
								<view class='login-user'>
									<text class='user-text'>账号</text>
									<input type="text" v-model="userName" value="" placeholder="请输入手机号/昵称"/>
								</view>
								<view class='login-user'>
									<text class='user-text'>密码</text>
									<input type="text" v-model="userPwd" value="" placeholder="6-16位字符"/>
								</view>
							</view>
							<view class='login-quick'>
								<view>忘记密码?</view>
								<view>免密登录</view>
							</view>
							<view class='tel' @tap="submit">登录</view>
							<view class='reminder'>温馨提示：您可以选择免密登录，更加方便</view>
							<LoginOther></LoginOther>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		
	</view>

</template>

<script>
	import {mapMutations} from 'vuex'
	import $http from '../../common/api/request.js'
	import LoginOther from '@/components/login/login-other.vue'
	export default {
		data() {
			return {
				// 用户输入的
				userName:'',
				userPwd:'',
				rules:{
					userName:{
						rule:/\S/,
						msg:'账号不能为空'
					},
					userPwd:{
						rule:/^[0-9a-zA-z]{6,16}$/,
						msg:'密码应该为6-16位字符'
					}
				}

			}
		},
		components:{
			LoginOther
		},
		methods: {
			...mapMutations(['setUserInfo']),
			// 返回上一页，
			goBack(){
				uni.reLaunch({
					url:'../index/index'
				})
			},
			// 点击确定
			submit(){
				if(!this.vaildata('userName')) return
				if(!this.vaildata('userPwd')) return
				
				// 发送请求看看核对账号密码
				$http.request({
					url:'/login',
					method:'POST',
					data:{
						userName:this.userName,
						userPwd:this.userPwd
					}
				}).then(res=>{
					// console.log(res)
					uni.showToast({
						title:res.msg,
						icon:"none"
					})
					if(res.success){
						// 把用户信息存入到vux永久存储
						this.setUserInfo(res.data)
						uni.navigateBack({
							delta:1
						})
					}
				}).catch((err)=>{
					uni.showToast({
						title:'出错啦',
						icon:'none'
					})
				})
			},
			// 验证用户输入的是否合理
			vaildata(key){
				let bool = true
				// console.log(this.rules[key])
				if(!this.rules[key].rule.test(this[key])){
					uni.showToast({
						title:this.rules[key].msg,
						icon:"none"
					})
					bool = false
					return false
				}
				return bool
			},
			goLoginTel(){
				uni.navigateTo({
					url:"/pages/login-tel/login-tel"
				})
			}
		}
	}

</script>

<style scoped>
.login-tel{
	width: 100vw;
	height: 100vh;
}
.tel-main{
	padding:0 20rpx;
}
.close{
	padding:20rpx 0;
}
.close-img{
	width:60rpx;
	height: 60rpx;
}
.logo{
	padding-bottom: 100rpx;
	display: flex;
	justify-content: center;
}
.tel{
	width:100%;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	color:#FFFFFF;
	background-color: #49BDFB;
	border-radius: 40rpx;
}
.login-go{
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.login-go image{
	width:60rpx;
	height: 60rpx;
}
/*第二*/
.close-center{
	display: flex;
}
.close-center >view{
	flex:1;
}
.login-from{
	padding-top:100rpx;
}
.login-user{
	font-size:32rpx;
	padding:10rpx 0;
	display: flex;
	align-items: center;
	border-bottom:2rpx solid #f7f7f7;
}
.user-text{
	padding-right:10rpx;
}
.login-quick{
	display: flex;
	justify-content: space-between;
	padding: 20rpx 0;
}
.reminder{
	color:#CCCCCC;
	padding:20rpx 0;
	text-align: center;
}
</style>

