<template>
	<view class="content">
		<Lines></Lines>
		<view class="list">
			
			
			<!-- 左侧数据 -->
			<scroll-view scroll-y="true" class="list-left" :style="'height: '+clentHeight+'px;'">
				<view v-for="(item,index) in leftData" class="left-text" @click="changTab(index,item.id)" :class="currentIndex==index?'left-acive-text':''">{{item.name}}</view>
			</scroll-view>
			
			<!-- 右侧数据 -->
			<scroll-view scroll-y="true" class="list-right" :style="'height: '+clentHeight+'px;'">
					<view class="right-item" v-for="(item,index) in rightData" :key="index">
						<block v-for="(i,k) in item">
							<view class="right-text">{{i.title}}</view>
							<view class="item-content">
								<view class="item" v-for="(items,indexs) in i.list">
									<image class="item-img" :src="items.imgUrl" mode=""></image>
									<view class="item-text">{{items.title}}</view>
								</view>
							</view>
						</block>
					</view>
			</scroll-view>
			
			
		</view> 
		<Tabbar currentPage="list"></Tabbar>
	</view>
</template>

<script>
import Tabbar from '../../components/common/Tabbar.vue'
import $http from '../../common/api/request.js'
import Lines from '../../components/common/Lines.vue'
	export default {
		components:{
			Lines,
			Tabbar
		},
		data() {
			return {
				// 高度值
				clentHeight:0,
				currentIndex:0,
				//左侧数据
				leftData:[],
				// 右侧数据
				rightData:[]
			}
		},
		onLoad(){
			this.getData()
		},
		onReady(){
			uni.getSystemInfo({
				success: (res) => {
					this.clentHeight = res.windowHeight - uni.upx2px(-88) - this.getClientHeight();
				}
			})
		},
		methods: {
			// 获取数据
			getData(id){
				// 判断点击的是否是同一个数据，如果是直接返回
				if(id === (this.currentIndex)){
					return;
				}
				$http.request({
					url:'/goods/list'
				}).then(res=>{
					let leftData = []
					let rightData = []
					res.forEach(v=>{
						leftData.push({
							id:v.id,
							name:v.title 
						})
						//如果点击的id值相同
						if(v.id===(this.currentIndex+1)){
							rightData.push(v.data)
						}
						
					})
					this.leftData = leftData
					this.rightData = rightData
					
				})
			},
			// 点击事件
			changTab(index){
				this.getData(index)
				this.currentIndex = index
			},
			// 获取可视区域高度 【兼容】
			getClientHeight(){
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
		},
		// input输入框点击跳转
		onNavigationBarSearchInputClicked(){
			uni.navigateTo({
				url:"/pages/search/search"
			})
		},
		
	}
</script>

<style lang="scss" scoped>
	.list{
		display: flex;
		.list-left{
			width: 200rpx;
			background-color: #f7f7f7;
			.left-text{
				display: flex;
				justify-content: center;
				padding: 30rpx 60rpx;
				border-bottom: 2rpx solid #fff;
				white-space: nowrap;
			}
			.left-acive-text{
				background-color: #fff;
				border-left: 6rpx solid #49BDFB;
			}
		}
		.list-right{
			flex: 1;
			margin-left:20rpx;
			.right-text{
				font-weight: bold;
				padding: 30rpx 60rpx;
			}
			.item-content{
				display: flex;
				flex-wrap: wrap;
				padding-bottom: 20rpx;
				// justify-content: center;
				.item{
					width: 33.33333333%;
					text-align: center;
					white-space: wrap;
					.item-img{
						width: 150rpx;
						height: 150rpx;
					}
				}
			}
			
		}
	}
</style>
