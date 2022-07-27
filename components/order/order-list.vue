<template>
	<!-- 待支付商品 -->
	<view class="main-item">
		<view class="item-img">
			<image :src="item.imgUrl" mode=""></image>
		</view>
		<view class="item-content">
			<view class="up">
				<view class="up-left">{{item.name}}</view>
				<view class="up-right">
					<view class="right-price">￥{{item.pprice}}</view>
					<view class="right-num f-color">*{{item.num}}</view>
				</view>
			</view>
			<view class="f-color colorSort">颜色分类: 黑色 M </view>
			<view class="f-active-color noReason">7天无理由</view>
		</view>
	</view>
</template>

<script>
export default{
	props:{
		item:Object,
		index:Number
	}
}
</script>

<style lang="scss" scoped>
	.main-item{
		margin-bottom: 10rpx;
		padding: 10rpx 20rpx;
		display: flex;
		width: 100%;
		height: 240rpx;
		background-color: #F7F7F7;
		justify-content: center;
		align-items: center;
		.item-img{
			image{
				width: 200rpx;
				height: 200rpx;
			}
		}
		.item-content{
			flex: 1;
			padding: 0 20rpx;
			box-sizing: border-box;
			.up{
				display: flex;
				.up-left{
					padding-right:20rpx ;
					-webkit-line-clamp:2;//限制文字显示行数
					display: -webkit-box;//将对象作为伸缩的盒子显示
					-webkit-box-orient: vertical;//盒子内子对象排列方式
					overflow:hidden;
					font-size: 30rpx;
				}
				.up-right{
					padding-right: 20rpx;
					.right-num{
						float: right;
					}
				}
			}
		}
		.colorSort{
			font-size: 30rpx;
		}
		.noReason{
			font-size: 30rpx;
			padding-top: 30rpx;
		}
	}
</style>