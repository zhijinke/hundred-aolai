<template>
	<view class="tabbar">
		
		<view class="tabbar-main">
			<view class="tabbar-item" v-for="(item,index) in tabbarList" :key="index" @click="changeTabbar(item.pagePath)">
				<image v-if=" currentPage == item.pagePath "  :src="item.selectedIconPath" mode=""></image>
				<image v-else :src="item.iconPath" mode=""></image>
				<text>{{item.text}}</text>
			</view>
			
		</view>
		
	</view>
</template>

<script>
export default{
	props:{
		currentPage:{
			type:String,
			default:'index'
		}
	},
	data(){
		return{
			tabbarList:[
				{
					"text": "首页",
					"pagePath": "index",
					"iconPath": "/static/tabbar/index.png",
					"selectedIconPath": "/static/tabbar/indexSelected.png"
				},
				{
					"text": "分类",
					"pagePath": "list",
					"iconPath": "/static/tabbar/list.png",
					"selectedIconPath": "/static/tabbar/listSelected.png"
				},
				{
					"text": "购物车",
					"pagePath": "shopCart",
					"iconPath": "/static/tabbar/shop.png",
					"selectedIconPath": "/static/tabbar/shopSelected.png"
				},
				{
					"text": "我的",
					"pagePath": "my",
					"iconPath": "/static/tabbar/my.png",
					"selectedIconPath": "/static/tabbar/mySelected.png"
				}
			]
		}
	},
	methods:{
		changeTabbar(e){
			clearInterval()
			if(e == 'shopCart' || e == 'my'){
				this.navigateTo({
					url:`../../pages/${e}/${e}`,
					animationType:"fade-in",
					animationDuration:0
				})
			}else{
				uni.redirectTo({
					url:`../../pages/${e}/${e}`
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.tabbar{
		padding-top: -120rpx;
	}
	.tabbar-main{
		background-color: #ffffff;
		display: flex;
		height: 100rpx;
		width: 100%;
		justify-content: space-around;
		align-items: center;
		position: fixed;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 9999;
		.tabbar-item{
			padding: 10rpx 0;
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			image{
				width: 50rpx;
				height: 50rpx;
				padding-bottom: 4rpx;
			}
			text{
				font-size: 30rpx;
			}
		}
	}
</style>