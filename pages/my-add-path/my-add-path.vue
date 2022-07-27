<template>
	<view class="my-add-path">
		<view class="item">
			<text>收件人</text>
			<input class="input" type="text" v-model="pathObj.name" placeholder="收件人姓名">
		</view>
		<view class="item">
			<text>手机号</text>
			<input class="input" type="text" v-model="pathObj.tel" placeholder="11位手机号">
		</view>
		<view class="item item-address">
			<text>所在地址</text>
			<view class="address" @tap="linked" v-model="pathObj.city">{{selectAddress}}</view>
			<mpvue-city-picker ref="mpvueCityPicker"  @onConfirm="onConfirm">
			</mpvue-city-picker>
		</view>
		<view class="item">
			<text>详细地址</text>
			<input class="input" type="text" v-model="pathObj.address" placeholder="5~60个字符">
		</view>
		<view class="item input">
			<text>设为默认地址</text>
			<radio-group @change="changeStatus">
				<label class="radio">
					<radio value="" :checked="pathObj.isDefault==1?true:false"/>
				</label>
			</radio-group>
			
		</view>
	</view>
</template>

<script>
	import {mapActions} from 'vuex'
	import $http from '../../common/api/request.js'
	import mpvueCityPicker from '../../common/uni/mpvue-citypicker/mpvueCityPicker.vue'
	export default {
		components:{
			mpvueCityPicker
		},
		data() {
			return {
				pathObj:{
					name:'',// 收货人姓名
					tel:'',// 收货人手机号
					province:'', // 省
					city:'请选择', // 市
					district:'', // 区
					address:'', // 详细地址
					isDefault:false // 默认地址
				},
				i:-1,
				// 是否是修改状态
				isStatus:false
			}
		},
		onLoad(e){
			if(e.obj){
				uni.setNavigationBarTitle({
					title: "修改地址"
				})
				let result = JSON.parse(e.obj)
				this.pathObj = result
				this.i = e.index
				this.isStatus = true
			}
		},
		onNavigationBarButtonTap(e){
			if(e.text === '保存'){
				if(this.isStatus){
					// 发送请求，修改用户的收货地址
					$http.request({
						url:'/updateAddress',
						method:'POST',
						data:{
							...this.pathObj
						},
						header:{
							token:true
						}
					}).then(res=>{
						this.updateAddressFn({item:this.pathObj,index:this.i})
						uni.navigateBack({
							delta:1
						})
					}).catch((err)=>{
						uni.showToast({
							title:'出错啦',
							icon:'none'
						})
					})
				}else{
					// 添加地址
					// 发请求，先存入数据库
					$http.request({
						url:'/addAddress',
						method:'POST',
						data:{
							...this.pathObj
						},
						header:{
							token:true
						}
					}).then(res=>{
						this.addListItemFn(this.pathObj)
						uni.navigateBack({
							delta:1
						})
					}).catch((err)=>{
						uni.showToast({
							title:'出错啦',
							icon:'none'
						})
					})
				}
			}
		},
		computed:{
			selectAddress(){
				if(this.pathObj.district){
					return ` ${this.pathObj.province}-${this.pathObj.city}-${this.pathObj.district}`
				}else{
					return '请选择'
				}
			}
		},
		methods: {
			...mapActions(['addListItemFn','updateAddressFn']),
			linked(){
				this.$refs.mpvueCityPicker.show();
			},
			onConfirm(e){
				let arr = e.label.split('-')
				this.pathObj.province = arr[0]
				this.pathObj.city = arr[1]
				this.pathObj.district = arr[2]
			},
			changeStatus(){
				this.pathObj.isDefault = this.pathObj.isDefault == 1 ? true:false
				this.pathObj.isDefault = !this.pathObj.isDefault
			}
		}
	}
</script>

<style lang="scss" scoped>
	.my-add-path{
		.item{
			display: flex;
			padding: 20rpx;
			border-bottom: 5rpx solid #f2f2f2;
			text{
				font-size: 30rpx;
				padding-right:20rpx ;
			}
		}
		.item-address{
			display: flex;
			justify-content: space-between;
			.address{
				color:#808080 ;
			}
		}
		.input{
			display: flex;
			justify-content: space-between;
		}
	}
</style>
