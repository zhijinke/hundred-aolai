<template>
	<view class="myOrder">
		<Lines></Lines>
		<!-- 顶部选择条 -->
		<view class="tab-header">
			<view class="header-item" @click="changeStatus(index)" :class="currentIndex == index ? 'active':''" v-for="(item,index) in tabList" :key="index">{{item.name}}</view>
		</view>
		
		<block v-for="(tabItem,tabI) in tabList" :key="tabI">
			<view v-if="tabI===currentIndex">
				<!-- 支付订单 -->
				<view class="order-main" :style="'height: '+seeContent+'px;'" v-if="tabItem.list.length>0">
					<view v-for="(itemOuter,indexOuter) in tabItem.list" :key="indexOuter">
						<!-- 待买家支付 -->
						<view class="f-active-color waitPay">{{itemOuter.status}}</view>
						<!-- 待支付商品 -->
						<view class="main-item" v-for="(item,index) in itemOuter.goods_item" :key="index">
							<order-list :item="item" :index="index"></order-list>
						</view>
						 <!-- 待支付价格 -->
						<view class="main-pirce">
							<view class="price-text">合计:</view>
							<view class="f-active-color price-price">￥{{itemOuter.totalPrice}}</view>
							<view class="price-text">(含运费:￥0.00)</view>
						</view>
					</view>
					<Lines></Lines>
					<!-- 支付 -->
						<text class="pay">支付</text>
				</view>
				<!-- 没有数据的时候 -->
				<view class="order-main-else" :style="'height: '+seeContent+'px;'" v-else>
					<view class="else-text">您还没有相关订单</view>
					<view class="else-home">去首页逛逛</view>
				</view>
			</view>
			
		</block>
	</view>
</template>

<script>
	import Lines from '../../components/common/Lines.vue'
	import orderList from '../../components/order/order-list.vue'
	export default {
		components:{
			Lines,
			orderList
		},
		data() {
			return {
				seeContent:0,
				currentIndex:0,
				tabList:[
					{
						name:'全部',
						list:[
							{
								status:"代付款",
								totalPrice:"699.00",
								goods_item:[
									{
										imgUrl:"../../static/img/commodity1.jpg",
										name:"2022超火流行韩版卫衣，男女都可。夏季时尚。不买绝逼后悔",
										attrs:"黑色 尺码: M",
										price:"499",
										num:"1"
									},
									{
										imgUrl:"../../static/img/commodity1.jpg",
										name:"2022超火流行韩版卫衣，男女都可。夏季时尚。不买绝逼后悔",
										attrs:"黑色 尺码: M",
										price:"499",
										num:"5"
									}
								]
							}
						]
					},
					{
						name:'待付款',
						list:[]
					},
					{
						name:'待发货',
						list:[]
					},
					{
						name:'待收货',
						list:[]
					},
					{
						name:'待评价',
						list:[]
					}
				]
			}
		},
		onReady(){
			uni.getSystemInfo({
				success: (res) => {
					// this.clentHeight = res.windowHeight - uni.upx2px(80)-this.getClientHeight();
					this.seeContent = res.windowHeight -this.getClientHight();
				}
			})
		},
		methods: {
			// 顶部点击事件
			changeStatus(index){
				this.currentIndex = index
			},
			// 获取可视区域高度 【兼容】
			getClientHight(){
				const res =	uni.getSystemInfoSync()
				const system = res.platform
				if(system === 'ios'){
					return 44+res.statusBarHeight
				}else if(system === 'android'){
					return 48+res.statusBarHeight;
				}else{
					return 0;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.myOrder{
		background-color: #F7F7F7;
		height: 100%;
		.tab-header{
			background-color: #ffffff;
			display: flex;
			justify-content: space-around;
			.header-item{
				padding: 30rpx 0;
			}
			.active{
				border-bottom: 5rpx solid #49BDFB;
			}
		}
		.order-main{
			background-color: #ffffff;
			.waitPay{
				display: flex;
				justify-content: flex-end;
				padding: 20rpx 30rpx;
			}
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
			.main-pirce{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				padding: 30rpx 20rpx;
				.price-text{
					font-size: 30rpx;
				}
				.price-price{
					font-size: 40rpx;
					
				}
			}
			
				.pay{
					color: #49BDFB;
					border: 5rpx solid #49BDFB;
					float: right;
					border-radius: 50rpx;
					padding: 10rpx 60rpx;
					font-size: 35rpx;
					margin:30rpx ;
				}
		}
		.order-main-else{
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
	}
	
	
	
</style>
