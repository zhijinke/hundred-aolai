<template>
	<view class="details">
		<!-- 详情页商品轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" class="details-banner">
			<swiper-item >
				<view class="swiper-item" >
					<image class="banner-img" :src="DetailData.imgUrl" mode=""></image>
				</view>
			</swiper-item>
		</swiper>
		<!-- 价格和名称 -->
		<view class="content">
			<view class="price">${{DetailData.pprice}}</view>
			<view class="price">${{DetailData.oprice}}</view>
			<view class="text">{{DetailData.name}}</view>
		</view>
		<!-- 商品展示图 -->
		<view class="showDetail">
			<view v-for="(item,index) in showDetails" :key="index">
				<image class="showDetail-img" :src="item.imgUrl" mode=""></image>
			</view>
		</view>
		<!-- 看了又看 -->
		<view class="Watch-and-see">
			<Card>看了又看</Card>
			<CommodityList :dataList="dataList"></CommodityList>
		</view>
		<!-- 详情底部 -->
		<view class="details-footer">
			<view class="iconfont icon-xiaoxi"></view>
			<view class="iconfont icon-gouwuche" @click="goShopCart"></view>
			<view class="addCart" @click="showPop">加入购物车</view>
			<view class="buy">立即购买</view>
		</view>
		<!-- 蒙版 -->
		<view class="pop" v-show="isShow" @touchmove.stop.prevent=''>
			<!-- 遮罩层 -->
			<view class="pop-mask" @click="hidePop"></view>
			<!-- 弹出内容层 -->
			<view class="pop-content" :animation="animationData">
				<view class="content-img">
					<image :src="DetailData.imgUrl" mode=""></image>
				</view>
				<view class="content-num">
					<view>购买数量</view>
					<uniNumberBox 
						:min="1"
						:value=num
						@change="changeNum"
					></uniNumberBox>
				</view>
				<view class="must" @click="addShopCart()">确定</view>
			</view>
		</view>
	</view>
</template>


<script>
	import {mapMutations} from 'vuex'
	import $http from '../../common/api/request.js'
	import uniNumberBox from '../../common/uni/uni-number-box/components/uni-number-box/uni-number-box.vue'
	import Card from '@/components/common/Card.vue'
	import CommodityList from '../../components/common/CommodityList.vue'
	export default {
		components:{
			Card,
			CommodityList,
			uniNumberBox
		},
		onLoad(e){
			this.getData(e.id)
		},
		data() {
			return {
				isShow:false,
				num:1,
				animationData:{},
				// 获取的数据
				DetailData:{},
				detailSwiper:[
					{imgUrl:"../../static/img/details1.jpeg"},
					{imgUrl:"../../static/img/details2.jpeg"},
					{imgUrl:"../../static/img/details3.jpeg"}
				],
				showDetails:[
					{imgUrl:"../../static/img/detail1.jpg"},
					{imgUrl:"../../static/img/detail2.jpg"},
					{imgUrl:"../../static/img/detail3.jpg"},
					{imgUrl:"../../static/img/detail4.jpg"},
					{imgUrl:"../../static/img/detail5.jpg"}
				],
				dataList:[
					{
						id:1,
						imgUrl:"../../static/img/commodity1.jpg",
						name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						pprice:"299",
						oprice:"659",
						discount:"5.2"
					},
					{
						id:2,
						imgUrl:"../../static/img/commodity2.jpg",
						name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						pprice:"299",
						oprice:"659",
						discount:"5.2"
					},
					{
						id:3,
						imgUrl:"../../static/img/commodity3.jpg",
						name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						pprice:"299",
						oprice:"659",
						discount:"5.2"
					},
					{
						id:4,
						imgUrl:"../../static/img/commodity4.jpg",
						name:"大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008大姨绒毛大款2020年必须买,不买你就不行了,爆款疯狂GG008",
						pprice:"299",
						oprice:"659",
						discount:"5.2"
					}
				]
			}
		},
		// 修改返回默认返回的地址
		onBackPress(){
			if(this.isShow){
				this.hidePop()
				return true;
			}
		},
		// 点击分享
		onNavigationBarButtonTap(e){
			if(e.type==='share'){
				uni.share({
					provider:'weixin',
					type:0,
					title:this.DetailData.name,
					scene:'WXSceneSession',
					href:`http://192.168.1.11:8080/#/pages/details/details?id=${this.DetailData.id}`,
					imageUrl:this.DetailData.imgUrl,
					success: function (res) {
						uni.showToast({
							title:'分享成功'
						})
					},
					fail: function (err) {
						console.log("fail:" + JSON.stringify(err));
					}
				})   
			}
		},
		methods: {
			...mapMutations(['addShopcart']),
			// 跳转至购物车页面
			goShopCart(){
				uni.navigateTo({
					url:"/pages/shopCart/shopCart"
				})
			},
			// 加入购物车
			addShopCart(){
				// 因为数据不符，先加入两个字段，然后存入vuex中
				let item = this.DetailData
				this.DetailData['checked'] = false
				this.DetailData['num'] = this.num
				// 发送请求，向数据库中添加数据
				$http.request({
					url:'/addShopCart',
					method:'POST',
					data:{
						...item
					},
					header:{
						token:true
					}
				}).then(res=>{
					if(res.success){
						this.addShopcart(item)
						this.hidePop()
						uni.showToast({
							title:'加入购物车成功',
							icon:'none'
						})
					}
				}).catch(()=>{
					uni.showToast({
						title:'数据获取失败',
						icon:'none'
					})
				})
			},
			// 弹出层改变商品数量
			changeNum(value){
				this.num = value
			},
			// 获取相应的数据
			getData(id){
				$http.request({
					url:'/goods/detailData',
					data:{
						id
					}
				}).then(res=>{
					this.DetailData = res[0]
				}).catch(()=>{
					uni.showToast({
						title:'数据获取失败',
						icon:'none'
					})
				})
			},
			showPop(){
				var animation = uni.createAnimation({
				   duration: 500
				})
				animation.translateY(600).step();
				this.animationData = animation.export();
				this.isShow = true;
				setTimeout(()=>{
					animation.translateY(0).step();
					this.animationData = animation.export();
					// this.isShow = true;
				},500)
			},
			hidePop(){
				var animation = uni.createAnimation({
				   duration: 500
				})
				animation.translateY(600).step();
				this.animationData = animation.export();
				this.isShow = true;
				setTimeout(()=>{
					animation.translateY(0).step();
					this.isShow = false
				},500)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.details-banner{
		width: 100%;
		height: 700rpx;
		.banner-img{
			width: 100%;
			height: 700rpx;
		}
	}
	.content{
		font-weight: bold;
		text-align: center;
		// padding: 20rpx 0;
		view{
			padding: 10rpx 0;
		}
	}
	.showDetail{
		width: 100%;
		.showDetail-img{
			width: 100%;
		}
	}
	.details-footer{
		display: flex;
		width: 100%;
		height: 90rpx;
		justify-content: space-around;
		align-items: center;
		background-color: #f7f7f7;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		.iconfont{
			width: 50rpx;
			height: 50rpx;
			background-color: #000;
			color: #fff;
			border-radius: 50%;
			text-align: center;
			line-height: 50rpx;
			padding: 10rpx;
			font-size: 40rpx;
		}
		.addCart{
			width: 200rpx;
			height: 50rpx;
			background-color: #000;
			color: #fff;
			border-radius: 50rpx;
			text-align: center;
			line-height: 50rpx;
			padding: 10rpx;
		}
		.buy{
			width: 200rpx;
			height: 50rpx;
			background-color: #42B7FB;
			color: #fff;
			border-radius: 50rpx;
			text-align: center;
			line-height: 50rpx;
			padding: 10rpx;
		}
	}
	.pop{
			position: fixed;
			left:0;
			top:0;
			width: 100%;
			height: 100%;
			z-index: 9999;
		.pop-mask{
			position: absolute;
			left:0;
			top:0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.2);
		}
		.pop-content{
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 400px;
			background-color: #fff;
			.content-img{
				width: 240rpx;
				height: 240rpx;
				image{
					width: 240rpx;
					height: 240rpx;
				}
			}
			.content-num{
				display: flex;
				justify-content: space-between;
				padding: 50rpx;
			}
			.must{
				width: 100%;
				height: 100rpx;
				background-color:#42B7FB;
				line-height: 100rpx;
				position: fixed;
				left: 0;
				bottom: 0;
				text-align: center;
			}
		}
	}
</style>
