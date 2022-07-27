<template>
	<view class="commodity" :style="'flex-wrap:' +wrap+';'">
		
		<view 
		class="commodity-item" 
		v-for="(item,index) in dataList" 
		:key="index"
		:style="'width:'+itemW+';'"
		@click="goDetails(item.id)"
		>
			<image
			 :src="item.imgUrl" 
			 :style="'height:'+bigH+';'"
			 ></image>
			<view class="commodity-content">
				<view class="content-text" :style="'font-size:'+nameSize+';'">{{item.name}}</view>
				<view class="pprice">${{item.pprice}}</view>
				<view class="oprice">${{item.oprice}}</view>
				<view class="discount">{{item.discount}}折</view>
			</view>
		</view>
		
	</view>
</template>

<script>
export default{
	props:{ 
		// 数据
		dataList:Array,
		// 宽度
		 itemW:{
			 type:String,
			 default:"375rpx"
		 },
		 // 高度
		 bigH:{
			 type:String,
			 default:"375rpx"
		 },
		 // 是否换行
		 wrap:{
			 type:String,
			 default:"wrap"
		 },
		 // 字体大小
		 nameSize:{
			 type:String,
			 default:"26rpx"
		 }
	},
	methods:{
		goDetails(id){
			uni.navigateTo({
				url:`/pages/details/details?id=${id}`
			})
		}
	}
}
</script>

<style scoped lang="scss">
	.commodity{
		display: flex;
		// flex-wrap: wrap;
		.commodity-item{
			// width: 375rpx;
			image{
				width: 100%;
				// height: 375rpx;
			}
			padding-bottom: 20rpx;
			.commodity-content{
				text-align: center;
				.content-text{
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp:2;
						-webkit-box-orient:vertical;
						color:#333333;
						word-break: break-all;
						padding:6rpx 20rpx;
				}
				.oprice{
					text-decoration: line-through;
					font-size: 28rpx;
					color: #999;
				}
				.discount{
					border: 1px solid #FF3333;
					border-radius: 4rpx;
					font-size: 20rpx;
					padding: 2rpx 10rpx;
					display: inline-block;
					color: #FF3333;
				}
			}
		}
	}
</style>