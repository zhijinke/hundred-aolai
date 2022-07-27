<template>
	<view>
		<Lines></Lines>
		<view class='login-tel'>
			<view class='tel-main'>
				<view class='login-from'>
					<view class='login-user'>
						<text class='user-text'>验证码</text>
						<input type="number" v-model="userCode" focus='true' value="" placeholder="请输入验证码"/>
						<button class="code f-color" :disabled="disabled" size="mini" @click="getCode">{{codeText}}</button>
					</view>
				</view>
				<view class='tel' @click="register">下一步</view>
			</view>
		</view>
	</view>
</template>


<script>
	import $http from '../../common/api/request.js'
	import Lines from '@/components/common/Lines.vue'
	import {mapMutations} from 'vuex'
	export default {
		data() {
			return {
				// 验证码倒计时
				codeNum:10,
				// 显示的文字
				codeText:'重新发送',
				// 按钮是否禁用
				disabled:false,
				// 手机号
				phone:'',
				// 用户输入的验证码
				userCode:'',
				// 后端返回的验证码
				getUserCode:''
			}
		},
		components:{
			Lines
		},
		onLoad(e){
			this.phone = e.phone
		},
		onReady(){
			this.sendCode()
		},
		methods: {
			...mapMutations(['setUserInfo']),
			// 点击发送验证码
			sendCode(){
				// 请求接口返回验证码
				$http.request({
					url:'/code',
					method:'POST',
					data:{
						userName:this.phone
					}
				}).then(res=>{
					if(res.success){
						console.log(res.code)
						this.getUserCode = res.code
					}
				}).catch((err)=>{
					uni.showToast({
						title:'出错啦',
						icon:'none'
					})
				})
				this.disabled = true
				let timer = setInterval(()=>{
					this.codeNum--
					this.codeText = `重新发送 ${this.codeNum}`
				},1000)
				setTimeout(()=>{
					clearInterval(timer)
					this.codeText = '重新发送'
					this.disabled = false
					this.codeNum = 10
				},10000)
			},
			getCode(){
				this.sendCode()
			},
			// 比较验证码是否一致，注册
			register(){
				if(this.getUserCode == this.userCode){
					// 发请求，数据库添加数据
					$http.request({
						url:'/addUser',
						method:'POST',
						data:{
							userName:this.phone,
							userCode:this.userCode
						}
					}).then(res=>{
						if(res.success){
							uni.showToast({
								title:res.msg,
								icon:'none'
							})
							
							// 默认登录
							this.setUserInfo(res.data)
							
							uni.navigateTo({
								url:'../index/index'
							})
						}
					}).catch((err)=>{
						uni.showToast({
							title:'出错啦',
							icon:'none'
						})
					})
				}else{
					// 提示用户验证码不正确
					uni.showToast({
						title:"验证码不正确",
						icon:"none"
					})
				}
			}
		}
	}
</script>


<style scoped>
	.code{
		padding: 3rpx 30rpx;
		border: 2rpx solid #636263;
		border-radius: 50rpx;
	}
.login-tel{
	width: 100vw;
	height: 100vh;
}
.tel-main{
	padding:0 20rpx;
}
.login-from{
	padding:30rpx 0;
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
.tel{
	width:100%;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	color:#FFFFFF;
	background-color: #49BDFB;
	border-radius: 40rpx;
}
</style>

