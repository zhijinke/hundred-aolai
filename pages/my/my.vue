<template>
	<view class="my">
		<!-- 顶部背景图部分 -->
		<view class="my-header">
			<view class="header-main">
				<view class="main-img">
					<image @click="goMyConfig" src="../../static/img/config.png" mode=""></image>
				</view>
				<view class="main-user" >
					<image :src=" loginStatus ? userInfo.imgUrl : '../../static/img/Furnishing2.jpg' " mode=""></image>
					<view class="text">{{loginStatus? userInfo.nickName : '用户昵称'}}</view>
				</view>
			</view>
		</view>
		
		<!-- 我的订单页面 -->
		<view class="myOrder">
			<view class="order_header" >
				<view>我的订单</view>
				<view @click="goMyOrder">全部订单 > </view>
			</view>
			<view class="my-icons">
				<view class="item">
					<image src="../../static/img/order1.png" mode=""></image>
					<text class="f-color">待付款</text>
				</view>
				<view class="item">
					<image src="../../static/img/order1.png" mode=""></image>
					<text class="f-color">待发货</text>
				</view>
				<view class="item">
					<image src="../../static/img/order1.png" mode=""></image>
					<text class="f-color">待收货</text>
				</view>
				<view class="item">
					<image src="../../static/img/order1.png" mode=""></image>
					<text class="f-color">待评价</text>
				</view>
				<view class="item">
					<image src="../../static/img/order1.png" mode=""></image>
					<text class="f-color">退款管理</text>
				</view>
			</view>
		</view>
		
		<!-- 我的收藏... -->
		<view class="function">
			<view class="item">
				<text>我的收藏</text>
				<view> > </view>
			</view>
		</view>
		<Tabbar currentPage="my"></Tabbar>
	</view>
</template>

<script>
	import Tabbar from '../../components/common/Tabbar.vue'
	import {mapState} from 'vuex'
	export default {
		components:{
			Tabbar
		},
		data() {
			return {
				
			}
		},
		computed:{
			...mapState({
				loginStatus:state=>state.userInfo.loginStatus,
				userInfo:state=>state.userInfo.userInfo
			})
		},
		methods: {
			goMyConfig(){
				uni.navigateTo({
					url:"/pages/my-config/my-config"
				})
			},
			goMyOrder(){
				uni.navigateTo({
					url:"/pages/my-order/my-order"
				})
			},
			goLogin(){
				uni.navigateTo({
					url:"../login/login"
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.my{
		background-color:#f2f2f2 ;
	}
	.my-header{
		background: url('../../static/img/mybg.png')no-repeat;
		width: 100%;
		height: 400rpx;
		.header-main{
			width: 100%;
			height: 400rpx;
			.main-img{
				image{
					width: 50rpx;
					height: 50rpx;
					padding: 50rpx 20rpx;
				}
			}
			.main-user{
				margin: -50rpx 0;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				image{
					width: 150rpx;
					height: 150rpx;
					border-radius: 50%;
					margin-bottom: 20rpx;
				}
				.text{
					text-align: center;
				}
			}
		}
	}
	.myOrder{
		margin-bottom: 20rpx;
		background-color: #fff;
		.order_header{
			display: flex;
			justify-content: space-between;
			padding: 20rpx;
			font-weight: bold;
		}
		.my-icons{
			display: flex;
			margin-top: 30rpx;
			.item{
				flex: 1;
				display: flex;
				align-items: center;
				flex-direction: column;
				image{
					width: 66rpx;
					height: 66rpx;
					margin-bottom: 5rpx;
				}
				text{
					font-size: 30rpx;
					padding-bottom: 20rpx;
				}
			}
		}
	}
	.function{
		background-color: #fff;
		.item{
			display: flex;
			justify-content: space-between;
			padding: 30rpx;
			border-bottom: 8rpx solid #f2f2f2;
		}
	}
</style>
