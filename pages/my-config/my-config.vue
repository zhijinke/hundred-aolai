<template>
	<view class="myConfig">
		<!-- 功能 -->
		<view class="config-item">
				<view class="item" @click="goAddress">
					<text>地址管理</text>
					<view> > </view>
				</view>
				<view class="item">
					<text>地址管理</text>
					<view> > </view>
				</view>
				<view class="item">
					<text>地址管理</text>
					<view> > </view>
				</view>
				<view class="item">
					<text>地址管理</text>
					<view> > </view>
				</view>
		</view>
		<!-- 退出 -->
		<view class="secede" @click="OutUser">
			<text>退出登录</text>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				
			}
		},
		computed:{
			...mapState({
				loginStatus:state=>state.userInfo.loginStatus
			})
		},
		methods: {
			...mapMutations(['loginOut']),
			goAddress(){
				uni.navigateTo({
					url:"/pages/address/address"
				})
			},
			// 退出登录
			OutUser(){
				if(this.loginStatus){
					uni.showModal({
						title:'退出提示',
						content:'确定退出登录吗',
						success:(res)=>{
							if(res.confirm){
								this.loginOut()
								uni.navigateTo({
									url:"../index/index"
								})
								uni.showToast({
									title:'退出成功',
									icon:"none"
								})
							}
						}
					})
				}else{
					uni.showToast({
						title:'您还未登录',
						icon:"none"
					})
				}
				
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item{
		display: flex;
		justify-content: space-between;
		padding: 30rpx;
		border-bottom: 8rpx solid #f2f2f2;
	}
	.secede{
		width: 100%;
		height: 100rpx;
		background-color: #49BDFB;
		text{
			display: flex;
			justify-content: center;
			align-items: center;
			line-height: 100rpx;
			color: #fff;
		}
	}
</style>
