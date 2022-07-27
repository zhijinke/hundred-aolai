<template>
	<view class="payment">
		
		<!-- 自定义导航栏 -->
		<UniNavBar 
			title="确认支付"
			left-text="关闭"
			:fixed="true"
			status-bar='true'
			@clickLeft="goback()"
		></UniNavBar>
		
		<!-- 支付方式 -->
		<view class="payWay">
			<radio-group>
				<label for="">
					<view class="payWay-item">
						<view class="pay-left">
							<image class="pay-img" src="../../static/img/zfb.png" mode=""></image>
							<view class="pay-comment">
								<view class="pay-text">支付宝支付</view>
								<view class="pay-recommend f-color">推荐支付宝用户使用</view>
							</view>
						</view>
						<label class="radio">
							<radio value="" />
						</label>
					</view>
				</label>
				<label for="">
					<view class="payWay-item">
						<view class="pay-left">
							<image class="pay-img" src="../../static/img/wxf.png" mode=""></image>
							<view class="pay-comment">
								<view class="pay-text">微信支付</view>
								<view class="pay-recommend f-color">推荐微信用户使用</view>
							</view>
						</view>
						<label class="radio">
							<radio value="" />
						</label>
					</view>
				</label>
			</radio-group>
		</view>
		
		<!-- 底部 -->
		<view class="footer">
			<view class="left">
				<view class="add">合计:</view>
				<view class="price">￥{{price}}</view>
			</view>
			<view class="right" @click="goSuccess">
				去支付
			</view>
		</view>
		
	</view>
</template>

<script>
import $http from '../../common/api/request.js'
import { mapState } from 'vuex'
import UniNavBar from '../../common/uni/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue'
export default {
	components:{
		UniNavBar
	},
	data() {
		return {
			price:'',
			list:[]
		}
	},
	onLoad(e) {
		this.price = JSON.parse(e.price)
		this.list = JSON.parse(e.list)
	},
	computed:{
		...mapState({
			order_id:state=>state.order.order_id,
		})
	},
	methods: {
		goSuccess(){
			$http.request({
				url:"/payment",
				method:"POST",
				header:{
					token:true
				},
				data : {
					orderId:this.order_id,
					price:this.price,
					list:this.list
				}
			}).then((res)=>{
				plus.runtime.openURL( res.paymentUrl );
			})
			
			// uni.navigateTo({
			// 	url:"../payment-success/payment-success"
			// })
		},
		goback(){
			uni.navigateBack({
				delta:1
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.payWay{
		.payWay-item{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx;
			.pay-left{
				display: flex;
				align-items: center;
				.pay-img{
					width: 120rpx;
					height: 120rpx;
				}
				.pay-comment{
					padding-left: 20rpx;
					.pay-text{
						font-weight: bold;
						font-size: 35rpx;
					}
				}
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
			width: 60%;
			align-items: center;
			padding-left: 30rpx;
			background-color: #191919;
			.add{
				padding-right: 20rpx;
				color: #929292;
			}
			.price{
				font-size: 40rpx;
				color: #fff;
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
</style>
