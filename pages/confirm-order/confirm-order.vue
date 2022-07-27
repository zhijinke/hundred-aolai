<template>
	<view class="confirm-order">
		<Lines></Lines>
		<!-- 地址 -->
		<view class="address">
			<view class="address-left" >
				<view class="up">
					<view class="left">
						<text>收货人:</text>
						<view>{{item.name}}</view>
					</view>
					<view class="right">{{item.tel}}</view>
				</view>
				<view class="down">
					<text class="receive f-color">收货地址:</text>
					<view class="ressDetail"> {{item.province}} {{item.city}} {{item.district}} {{item.address}}</view>
				</view>
			</view>
			<view class="address-right f-color" @click="goAddress"> > </view>
		</view>
		<Lines></Lines>
		<!-- 商品 -->
		<view class="goods-list">
			<view class="goods-item" v-for="(item,index) in goods_list" :key="index">
				<orderList :item="item" :index="index"></orderList>
			</view>
			<Lines></Lines>
			<view class="total">
				<view class="num">共{{totalCount.num}}件商品 小计:</view>
				<view class="price f-active-color">{{totalCount.price.toFixed(2)}}</view>
			</view>
		</view>
		
		<!-- 底部 -->
		<view class="footer">
			<view class="left">
				<view class="add">合计:</view>
				<view class="price f-active-color">{{totalCount.price.toFixed(2)}}</view>
			</view>
			<view class="right" @click="goPayment">
				提交订单
			</view>
		</view>
		
	</view>
</template>

<script>
	import $http from '../../common/api/request.js'
	import {mapGetters,mapState,mapMutations} from 'vuex'
	import Lines from '../../components/common/Lines.vue'
	import orderList from '../../components/order/order-list.vue'
export default {
	components:{
		Lines,
		orderList
	},
	data() {
		return {
			// 选中商品的id
			cartId:[],
			// 默认地址
			item:[],
		}
	},
	computed:{
		...mapState({
			list:state=>state.cart.list,
			selectList:state=>state.cart.selectList,
			order_id:state=>state.order.order_id
		}),
		...mapGetters(['defaultPath','totalCount']),
		// 根据选中商品的id从list中拿到商品的详情
		goods_list(){
			return this.cartId.map(id=>{
				return this.list.find(v => v.id==id)
			})
		},
	},
	onLoad(e){
		// 购物车页面传过来的要购买的id
		this.cartId = JSON.parse(e.detail)

			// 发请求获取数据
			$http.request({
				url:'/selectAddress',
				method:'POST',
				header:{
					token:true
				}
			}).then(res=>{
				// 本地存储
				this.insertAddress(res)
				// 拿到vuex 购物车中的默认地址数据
				if(this.defaultPath.length>0){
				 	this.item = this.defaultPath[0]
				} 
			}).catch((err)=>{
				uni.showToast({
					title:'出错啦',
					icon:'none'
				})
			})

		// 点击选择地址  返回选择的地址数据
		uni.$on('selectPathItem',(res)=>{
			this.item = res
		})
	},
	onUnload(){
		uni.$off('selectPathItem',()=>{
			console.log('selectPathItem 卸载完成')
		})
	},
	methods: {
		...mapMutations(['insertAddress']),
		goAddress(){
			uni.navigateTo({
				url:"/pages/address/address?selectPath=selectRess"
			})
		},
		goPayment(){
			if(this.defaultPath.length<1){
				return uni.showToast({
					title:'请选择收货地址',
					icon:'none'
				})
			}else{
				// 发送请求，改变商品状态
				$http.request({
					url:'/changeOrderStatus',
					method:'POST',
					header:{
						token:true
					},
					data:{
						orderId:this.order_id,
						shopArr:this.selectList
					}
				}).then(res=>{
					// console.log(res)
					if(res.success){
						let newName = [];
						this.goods_list.forEach(v=>{
							newName.push( v.name );
						})
						
						// 路由跳转  list:newName
						uni.navigateTo({
							url:`/pages/payment/payment?price=${JSON.stringify(this.totalCount.price.toFixed(2))}&list=${JSON.stringify(newName)}`
						})
					}
				}).catch((err)=>{
					console.log(err)
					uni.showToast({
						title:'出错啦',
						icon:'none'
					})
				})
			}
		},
	}
}
</script>

<style lang="scss" scoped>
	.confirm-order{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 100%;
		background-color: #f7f7f7;
		.address{
			background-color: #fff;
			display: flex;
			padding: 30rpx;
			.address-left{
				width: 90%;
				.up{
					display: flex;
					font-weight: bold;
					justify-content: space-between;
					padding: 5rpx 0;
					.left{
						display: flex;
						flex-direction: row;
						text{
							margin-right: 20rpx;
						}
					}
					.right{
						margin-right: 30rpx;
					} 
					
				}
				.down{
					display: flex;
					padding: 5rpx 0;
					font-size: 30rpx;
					.receive{
						margin-right: 20rpx;
						white-space: nowrap
					}
					.ressDetail{
						white-space:nowrap;
						overflow:hidden;
						text-overflow:ellipsis;
						margin-right: 30rpx;
					}
				}
			}
			.address-right{
				flex:1;
				font-size: 60rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 20rpx;
			}
		}
		
		.goods-list{
			background-color: #fff;
			.goods-item{
				margin-bottom: 20rpx;
			}
			.total{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				padding: 30rpx;
				.price{
					font-size: 40rpx;
				}
			}
		}
		.footer{
			background-color: #fff;
			display: flex;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 100rpx;
			.left{
				display: flex;
				width: 70%;
				justify-content: flex-end;
				align-items: center;
				padding-right: 20rpx;
				.add{
					padding-right: 20rpx;
				}
				.price{
					font-size: 40rpx;
				}
			}
			.right{
				flex: 1;
				background-color: #49BDFB;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}

</style>
