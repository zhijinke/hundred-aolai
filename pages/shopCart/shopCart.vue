<template>
	<view class="shop-cart">
		
		<template v-if="list.length>0">
			<!-- 自定义导航栏 -->
			<UniNavBar 
				title="购物车"
				:right-text="isNavbar?'完成':'编辑'"
				:fixed="true"
				status-bar='true'
				@clickRight="isNavbar = !isNavbar"
			></UniNavBar>
			
			<!-- 购物车内容 -->
			<view class="cart-content">
				<view class="cart-item" v-for="(item,index) in list" :key="index">
					<label class="radio" @click="selectItem(index)">
						<radio value="" :checked="item.checked" /><text></text>
					</label>
					<view class="item-img">
						<image :src="item.imgUrl" mode=""></image>
					</view>
					<view class="item-text">
						<view class="text">{{item.name}}</view>
						<view class="f-color item-spec">{{item.specification}}</view>
						<view class="item-num">
							<view class="item-font">
								<view>￥</view>
								<view class="item-price">{{item.pprice}}</view>
							</view>
							<template v-if="!isNavbar">
								<view>*{{item.num}}</view>
							</template>
							<template v-else>
								<uniNumberBox
									:min="1"
									:value="item.num"
									@change="changeNum($event,index)"
									background="#fff"
								></uniNumberBox>
							</template>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 底部-->
			<view class="cart-footer">
				<label class="radio" >
					<radio value="" @click="isCheckedAll" :checked="isCheckAll" /><text>全选</text>
				</label>
				<view class="footer-right">
					<view class="left">
						<template v-if="isNavbar" class="temp-text">
							<view class="item-isNavbar-text">移入收藏夹</view>
						</template>
						<template v-else>
							<view class="left-item">
								<view>合计:</view>
								<view class="f-active-color">￥{{totalCount.price.toFixed(2)}}</view>
							</view>
							<view class="item-text">不含运费</view>
						</template>
					</view>
					<view class="right">
						<template v-if="!isNavbar">
							<view @click="goConfirmOrder">结算({{totalCount.num}})</view>
						</template v-else>
						<template>
							<view @click="deleteShopCart(getListItem)">删除</view>
						</template>
					</view>
				</view>
			</view>
		</template>
		<template v-else>
			<UniNavBar
				title="购物车"
				:fixed="true"
				status-bar='true'
			></UniNavBar>
			<text class="text-else">囧~购物车还没有数据~</text>
		</template>
		<Tabbar currentPage="shopCart"></Tabbar>
	</view>
</template>

<script>
	import $http from '../../common/api/request.js'
	import Tabbar from '../../components/common/Tabbar.vue'
	import {mapState,mapActions,mapGetters,mapMutations} from 'vuex'
	import UniNavBar from '../../common/uni/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue'
	import uniNumberBox  from '../../common/uni/uni-number-box/components/uni-number-box/uni-number-box.vue'
	export default {
		components:{
			UniNavBar,
			uniNumberBox,
			Tabbar
		},
		computed:{
			...mapState({
				list:state=>state.cart.list,
				selectList:state=>state.cart.selectList
			}),
			...mapGetters(['isCheckAll','totalCount','getListItem'])
		},
		data() {
			return {
				// 编辑和完成进行切换
				isNavbar:false,
			}
		},
		onShow() {
			// 获取购物车数据
			this.getData()
		},
		methods: {
			...mapActions(['isCheckedAll','deleteItem']),
			...mapMutations(['selectItem','initGetData','initOrder']),
			
			// 获取购物车数据
			getData(){
				$http.request({
					url:'/selectShopCart',
					method:'POST',
					header:{
						token:true
					}
				}).then(res=>{
					// 赋值list，读取购物车内容
					this.initGetData(res.data)
					// console.log(res)
				}).catch((err)=>{
					uni.showToast({
						title:'出错啦',
						icon:'none'
					})
				})
			},
			// 删除购物车数据
			deleteShopCart(item){
				// 发请求删除购物车数据
				$http.request({
					url:'/deleteShopCart',
					method:'POST',
					data:{
						id:item
					},
					header:{
						token:true
					}
				}).then(res=>{
					// 删除本地list的里的数据
					this.deleteItem()
				}).catch((err)=>{
					uni.showToast({
						title:'出错啦',
						icon:'none'
					})
				})
			},
			changeNum(value,index){
				let newNum = value
				let cartId = this.list[index].id
				// 发请求，修改数据库中的购物车商品的数量
				$http.request({
					url:'/updateShopCart',
					method:'POST',
					data:{
						newNum,
						cartId
					},
					header:{
						token:true
					}
				}).then(res=>{
					this.list[index].num = value
				}).catch((err)=>{
					uni.showToast({
						title:'出错啦',
						icon:'none'
					})
				})
			},
			goConfirmOrder(){
				// 判断是否选中商品，如果没有不跳转
				if(this.selectList.length<1){
					return uni.showToast({
						title:'至少选择一件商品',
						icon:'none'
					})
				}else{
					// 要把选中的商品给后端传送过去
					let newItem = []
					this.list.forEach(item=>{
						this.selectList.filter(v=>{
							if(item.id == v){
								newItem.push(item)
							}
						})
					})
					// 生成一个订单
					$http.request({
						url:'/addOrder',
						method:'POST',
						header:{
							token:true
						},
						data:{
							OrderItem:newItem
						}
					}).then(res=>{
						let id =  res.data[0].order_id
						if(res.success){
							// 订单号，存入vuex
							this.initOrder(id)
							// 路由跳转
							let item = JSON.stringify(this.selectList)
							uni.navigateTo({
								url:`/pages/confirm-order/confirm-order?detail=${item}`
							})
						}
					}).catch((err)=>{
						uni.showToast({
							title:'出错啦',
							icon:'none'
						})
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
 // 购物车内容样式
 .cart-content{
	 padding-bottom: 100rpx;
	.cart-item{
		margin-bottom: 10rpx;
		height: 240rpx;
		display: flex;
		align-items: center;
		background-color: #f6f6f6;
		.item-img{
			width: 200rpx;
			height: 200rpx;
			image{
				width: 200rpx;
				height: 200rpx;
			}
		}
		.item-text{
			flex: 1;
			padding: 20rpx;
			.text{
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical; /*设置对齐模式*/
				-webkit-line-clamp: 2; /*设置多行的行数，示例为2行*/
			}
			.item-spec{
				padding: 10rpx 0;
			}
			.item-num{
				display: flex;
				justify-content: space-between;
				.item-font{
					display: flex;
					align-items: center;
					.item-price{
						font-size: 36rpx;
					}
				}
			}
		}
	}
 }
 // 没有数据样式
 .text-else{
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	background-color: #f6f6f6;
 }
 // 底部样式
 .cart-footer{
	 // #ifdef H5  */
	 // padding-bottom: 100rpx;
	 // /* #endif
	 padding-bottom: 100rpx;
	position: fixed;
	left: 0;
	bottom: 0;
	background-color: #ffffff;
	width: 100%;
	height: 100rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-top: 2rpx solid #f6f6f6;
	.radio{
		margin-left: 50rpx;
	}
	.footer-right{
		display: flex;
		flex-direction: row;
		.left{
				.item-isNavbar-text{
					background-color: black;
					color: #ffffff;
					height: 100rpx;
					width: 200rpx;
					margin-top: -20rpx;
					margin-right: -20rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 30rpx;
				}
			
			margin-top: 20rpx;
			padding-right: 20rpx;
			.left-item{
				display: flex;
				flex-direction: row;
			}
			.item-text{
				font-size: 20rpx;
				float: right;
			}
		}
		.right{
			width: 200rpx;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			background-color: #49BDFB;
		}
	}
 }
</style>
