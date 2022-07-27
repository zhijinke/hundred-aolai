<template>
	<view class="success">
		<view class="order-main-else">
			<view class="else-text">支付成功</view>
			<view class="else-home" @click="goHome">去首页逛逛</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			goHome(){
				uni.switchTab({
					url:"../index/index"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.order-main-else{
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		.else-text{
			font-size: 35rpx;
		}
		.else-home{
			margin-top: 20rpx;
			color: #49BDFB;
			border: 5rpx solid #49BDFB;
			padding: 15rpx 60rpx;
			border-radius: 50rpx;
		}
	}

</style>
