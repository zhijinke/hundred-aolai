<template>
	<view class="shop-list">
	
		<view class="shop-content">
			<view class="shop-item" v-for="(item,index) in shopData.data" :key="index" @click="addActive(index)">
				<view class="item-text" :class="shopData.currentIndex==index?'f-active-color':'f-color'">{{item.name}}</view>
				<view class="item-icon">
					<view class="up iconfont icon-shangjiantou" :class="item.status==1?'f-active-color':'f-color'"></view>
					<view class="down iconfont icon-xiajiantou" :class="item.status==2?'f-active-color':'f-color'"></view>
				</view>
			</view>
		</view>
		<Lines></Lines>
		<CommodityList :dataList="dataList"></CommodityList>
	</view>
</template>
 
<script>
import $http from '../../common/api/request.js'
import Lines from "./Lines"
import CommodityList from "./CommodityList"
export default{
	props:{
		keyWord:String
	},
	onLoad(e){
		
	},
	components:{
		Lines,
		CommodityList
	},
	data(){
		return{
			dataList:[],
			shopData:{			
				currentIndex:0,
				data:[
					{name:'价格',status:1,key:'pprice'},
					{name:'折扣',status:0,key:'discount'},
					{name:'品牌',status:0,key:'oprice'}
				]
			},
		}
	},
	mounted(){
		this.getData()
	},
	computed:{
		orderBy(){
			// 拿到当前对象
			let obj = this.shopData.data[this.shopData.currentIndex]
			let val = obj.status=='1'?'desc':'asc'
			return {
				[obj.key]:val
			}
		}
	},
	methods:{
		addActive(index){
			// 点击再次发送数据
			this.getData()
			// 索引值
			let idx = this.shopData.currentIndex
			// 具体哪一个对象
			let item = this.shopData.data[idx]
			// 改变相应对象里的状态
			if(idx == index){
				return item.status = item.status == 1 ? 2 : 1
			}
			// 新的值
			let newItem = this.shopData.data[index]
			item.status = 0
			this.shopData.currentIndex = index
			newItem.status = 1
		},
		getData(){
			$http.request({
			url:'/goods/search',
			data:{
				name:this.keyWord,
				...this.orderBy
			}
			}).then(res=>{
				this.dataList = res.data
			}).catch((err)=>{
				console.log(err)
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.shop-content{
		display: flex;
		padding: 20rpx;
		.shop-item{
			display: flex;
			flex: 1;
			justify-content: center;
			.item-icon{
				position: relative;
				margin-left: 10rpx;
				.up{
					// top: -4rpx;
				}
				.down{
					top: 14rpx;
				}
				.iconfont{
					position: absolute;
				}
			}
		}
	}
</style>