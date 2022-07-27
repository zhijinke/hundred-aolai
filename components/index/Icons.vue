<template>
	<view class="icons">
		
		<view class="icon-item" v-for="(item,index) in dataList" :key="index">
			<image class="item-img" :src="item.imgUrl" mode=""></image>
			<view class="item-text f-color">{{item.name}}</view>
		</view>	
	</view>
</template>

<script>
export default{
	props:{
		dataList:Array
	}
}
</script>

<style lang="scss" scoped>
	.icons{
		display: flex;
		flex-wrap: wrap;
		.icon-item{
			width: 25%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			padding-top: 20rpx;
			.item-img{
				width: 110rpx;
				height: 110rpx;
			}
			.item-text{
				margin-top: 10rpx;
			}
		}
	}
</style>