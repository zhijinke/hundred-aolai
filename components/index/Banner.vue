<template>
	<view class="banner">
		<image class="banner-item" :src="dataList" mode=""></image>
	</view>
</template>

<script>
export default{
	props:{
		dataList:String
	}
}
</script>

<style lang="scss" scoped>
	.banner{
		width: 100%;
		height: 350rpx;
		.banner-item{
			width: 100%;
			height: 350rpx;
		}
	}
</style>