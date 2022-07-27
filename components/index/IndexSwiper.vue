<template>
	<view class="IndexSwiper">
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item,index) in dataList" :key="index">
				<image :src="item.imgUrl" mode=""></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
export default{
	props:{
		dataList:Array
	}
}
</script>

<style scoped>
	swiper{
		width: 100%;
		height: 400rpx;
	}
	image{
		width: 100%;
		height: 400rpx;
	}
</style>