<template>
	<view class="address">
		
		<view class="userInfo" v-for="(item,index) in list" :key="index" @click.stop="goUpdateAddress(item,index)">
			<view class="left">
				<view class="up">
					<view class="name">{{item.name}}</view>
					<view class="phone">{{item.tel}}</view>
				</view>
				<view class="down">
					<view class="default" v-if="item.isDefault==1">默认</view>
					<view class="text"> {{item.province}} {{item.city}} {{item.district}} {{item.address}}</view>
				</view>
			</view>
			<view class="deleteRight" @click.stop="deleteItem(item)">
				<button size="mini" type="button">删除</button>
			</view>
			
		</view>
		
		
		<!-- 新增地址 -->
		<view class="newAddress">
			<view class="addAddress">
				<view @click="goMyAddPath">新增地址</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {mapState,mapMutations,mapActions} from 'vuex'
	import $http from '../../common/api/request.js'
	export default {
		data() {
			return {
				// 是否是确认订单页面跳转过来的
				isConfirmOrder:false
			}
		},
		computed:{
			...mapState({
				list:state=>state.address.list
			})
		},
		onLoad(e){
			if(e.selectPath == "selectRess"){
				this.isConfirmOrder = true
			}
			this.init_selectAddress()
		},
		methods: {
			...mapMutations(['insertAddress']),
			...mapActions(['deleteAddressFn']),
			// 初始化查询数据库中用户对应的数据
			init_selectAddress(){
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
				}).catch((err)=>{
					uni.showToast({
						title:'出错啦',
						icon:'none'
					})
				})
			},
			// 新增地址
			goMyAddPath(){
				uni.navigateTo({
					url:"/pages/my-add-path/my-add-path"
				})
			},
			// 修改地址
			goUpdateAddress(item,index){
				if(this.isConfirmOrder){
					// 要携带的参数
					uni.$emit('selectPathItem',item)
					// 返回确认订单页
					uni.navigateBack({
						delta:1
					})
				}else{
					let items = JSON.stringify(item)
					uni.navigateTo({
						url:`/pages/my-add-path/my-add-path?obj=${items}&index=${index}`
					})
				}
			},
			// 删除收货地址
			deleteItem(item){
				// console.log(item)
				uni.showModal({
					title:'删除提示',
					content:'确定要删除该地址吗',
					success:(res)=>{
						if(res.confirm){
							
							// 发请求获取数据
							$http.request({
								url:'/deleteAddress',
								method:'POST',
								data:{
									iid:item.id,
									isDefault:item.isDefault
								},
								header:{
									token:true
								}
							}).then(res=>{
								if(res.success){
									// this.deleteAddressFn(item.id)
									// console.log(item.id)
									this.init_selectAddress()
								}
							}).catch((err)=>{
								uni.showToast({
									title:'出错啦',
									icon:'none'
								})
							})
						}
					}
				})
				// this.deleteItem(item)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.userInfo{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		font-size: 30rpx;
		border-bottom: 5rpx solid #d2d2d2;
		.deleteRight{
			z-index: 999;
			button{
				background-color: red;
				color: #fff;
			}
		}
		.up{
			display: flex;
			.name{
				padding-right: 20rpx;
			}
		}
		.down{
			display: flex;
			.default{
				background-color: #49BDFB;
				padding: 2rpx 10rpx;
				border-radius: 30rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #fff;
				white-space: nowrap;
			}
			.text{
				  display:block;
				  white-space:nowrap;
				  overflow:hidden;
				  text-overflow:ellipsis;
			}
		}
	}
	
	.address{
		.newAddress{
			display: flex;
			justify-content: center;
			padding: 20rpx 0;
			.addAddress{
				width: 150rpx;
				height: 50rpx;
				border: 2rpx solid #49BDFB;
				border-radius: 40rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 5rpx 20rpx;
				color: #49BDFB;
			}
		}
		
	}

</style>
